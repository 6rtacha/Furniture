import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { Products } from '../../libs/dto/product/product';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { Projects } from '../../libs/dto/project/project';
import { NotificationService } from '../notification/notification.service';
import { MemberService } from '../member/member.service';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}
	private readonly notificationService: NotificationService;
	private readonly memberService: MemberService;

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				const result = await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, LikeModel:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(` -- Like modifier ${modifier} --`);
		return modifier;
	}

	public async checkLikeExistance(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		console.log('input', input);

		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		console.log(result);

		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProducts(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		console.log('memberId', memberId);
		console.log('input', input);
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PRODUCT, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'products',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteProduct',
					},
				},
				{ $unwind: '$favoriteProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: Products = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteProduct);

		console.log('result:', result);

		return result;
	}

	public async getFavoriteProjects(memberId: ObjectId, input: OrdinaryInquiry): Promise<Projects> {
		console.log('memberId', memberId);
		console.log('input', input);
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PROJECT, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'projects',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteProject',
					},
				},
				{ $unwind: '$favoriteProject' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteProject.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: Projects = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteProduct);

		console.log('result:', result);

		return result;
	}
}
