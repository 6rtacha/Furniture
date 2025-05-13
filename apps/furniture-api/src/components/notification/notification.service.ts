import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationsInquiry, NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { Notification1, Notifications } from '../../libs/dto/notification/notification';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { lookupAuthor } from '../../libs/config';
import { SocketGateway } from '../../socket/socket.gateway';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { MemberService } from '../member/member.service';
import { NoticeStatus } from '../../libs/enums/notice.enum';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('notification') private readonly notificationModel: Model<Notification1>,
		private readonly socketGateway: SocketGateway,
		// private memberService: MemberService,
	) {}

	public async createNotification(input: NotificationInput): Promise<Notification1> {
		const notification = await this.notificationModel.create(input);
		console.log('notification', notification);

		this.socketGateway.handleNotification(null, notification);

		return notification;
	}

	public async updateNotification(input: NotificationUpdate, memberId: ObjectId): Promise<Notification1> {
		const result = await this.notificationModel.findOneAndUpdate({ _id: input._id }, input, { new: true }).exec();

		return result;
	}

	// public async getNotification(memberId: ObjectId, productId: ObjectId): Promise<Notification1> {
	// 	const search: T = {
	// 		_id: productId,
	// 		notificationStatus: NotificationStatus.WAIT,
	// 	};

	// 	const targetNotification: Notification1 = await this.notificationModel.findOne(search).exec();
	// 	if (!targetNotification) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

	// 	targetNotification.memberData = await this.memberService.getMember(null, targetNotification.authorId);
	// 	return targetNotification;
	// }

	public async getAllNotifications(input: NotificationsInquiry, memberId: ObjectId): Promise<Notifications> {
		const match: T = { receiverId: memberId };
		const sort: T = { [input?.direction ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthor,
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

	public async getAllNotifications1(input: NotificationsInquiry, memberId: ObjectId): Promise<Notifications> {
		const match: T = { receiverId: memberId, notificationStatus: NotificationStatus.WAIT };
		const sort: T = { [input?.direction ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthor,
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
}
