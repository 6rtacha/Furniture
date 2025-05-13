import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Project, Projects } from '../../libs/dto/project/project';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import {
	AgentProjectsInquiry,
	AllProjectsInquiry,
	OrdinaryProjectInquiry,
	ProjectInput,
	ProjectsInquiry,
} from '../../libs/dto/project/project.input';
import * as moment from 'moment';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ProjectStatus } from '../../libs/enums/project.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { ProjectUpdate } from '../../libs/dto/project/project.update';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ProjectService {
	constructor(
		@InjectModel('Project') private readonly projectModel: Model<Project>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
		private notificationService: NotificationService,
	) {}

	public async createProject(input: ProjectInput): Promise<Project> {
		try {
			const result = await this.projectModel.create(input);

			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProjects',
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProject(memberId: ObjectId, projectId: ObjectId): Promise<Project> {
		const search: T = {
			_id: projectId,
			projectStatus: ProjectStatus.ACTIVE,
		};

		const targetProject: Project = await this.projectModel.findOne(search).exec();
		if (!targetProject) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: projectId, viewGroup: ViewGroup.PROJECT };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.projectStatsEditor({ _id: projectId, targetKey: 'projectViews', modifier: 1 });
				targetProject.projectViews++;
			}

			const likeInput = { memberId: memberId, likeRefId: projectId, likeGroup: LikeGroup.PROJECT };
			targetProject.meLiked = await this.likeService.checkLikeExistance(likeInput);
		}

		targetProject.memberData = await this.memberService.getMember(null, targetProject.memberId);
		return targetProject;
	}

	public async getProjects(memberId: ObjectId, input: ProjectsInquiry): Promise<Projects> {
		const match: T = { projectStatus: ProjectStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.projectModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		console.log('result: ', result[0]);

		return result[0];
	}

	private shapeMatchQuery(match: T, input: ProjectsInquiry): void {
		const { memberId, locationList, categoryList, projectStyle, pricesRange, text } = input.search;
		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.projectLocation = { $in: locationList };
		if (categoryList && categoryList.length) match.projectCategory = { $in: categoryList };
		if (projectStyle && projectStyle.length) match.projectStyle = { $in: projectStyle };
		if (pricesRange) match.projectPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (text) match.projectTitle = { $regex: new RegExp(text, 'i') };
	}

	public async getFavorites(memberid: ObjectId, input: OrdinaryProjectInquiry): Promise<Projects> {
		return await this.likeService.getFavoriteProjects(memberid, input);
	}

	public async getVisited(memberid: ObjectId, input: OrdinaryProjectInquiry): Promise<Projects> {
		return await this.viewService.getVisitedProjects(memberid, input);
	}

	public async getAgentProjects(memberId: ObjectId, input: AgentProjectsInquiry): Promise<Projects> {
		const { projectStatus } = input.search;
		if (projectStatus === ProjectStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			projectStatus: projectStatus ?? { $ne: ProjectStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.projectModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async likeTargetProject(memberId: ObjectId, likeRefId: ObjectId): Promise<Project> {
		const target: Project = await this.projectModel
			.findOne({ _id: likeRefId, projectStatus: ProjectStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.PROJECT,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.projectStatsEditor({ _id: likeRefId, targetKey: 'projectLikes', modifier: modifier });

		if (modifier == 1) {
			const notification: NotificationInput = {
				notificationType: NotificationType.LIKE,
				notificationGroup: NotificationGroup.PROJECT,
				notificationTitle: 'liked your project!',
				authorId: memberId,
				receiverId: target.memberId,
			};
			await this.notificationService.createNotification(notification);
		} else {
			console.log('like qaytarib olingdi');
		}

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	/**  ADMIN */

	public async getAllProjectsByAdmin(input: AllProjectsInquiry): Promise<Projects> {
		const { projectStatus, projectLocationList } = input.search;

		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (projectStatus) match.projectStatus = projectStatus;
		if (projectLocationList) match.productLocationList = { $in: projectStatus };

		const result = await this.projectModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateProjectByAdmin(input: ProjectUpdate): Promise<Project> {
		let { projectStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			projectStatus: ProjectStatus.ACTIVE,
		};

		if (projectStatus === ProjectStatus.ACTIVE) soldAt = moment().toDate();
		else if (projectStatus === ProjectStatus.PAUSE) deletedAt = moment().toDate();

		const result = await this.projectModel.findByIdAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProjects',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeProjectByAdmin(productId: ObjectId): Promise<Project> {
		const search: T = {
			_id: productId,
			projectStatus: ProjectStatus.DELETE,
		};
		const result = await this.projectModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async projectStatsEditor(input: StatisticModifier): Promise<Project> {
		const { _id, targetKey, modifier } = input;
		return await this.projectModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
