import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { NotificationsInquiry, NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Notification1, Notifications } from '../../libs/dto/notification/notification';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification1)
	public async updateNotification(
		@Args('input') input: NotificationUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification1> {
		console.log('Mutation: updateNotification');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.notificationService.updateNotification(input, memberId);
	}

	// @UseGuards(AuthGuard)
	// @Query((returns) => Notification1)
	// public async getNotification(
	// 	@Args('notificationId') input: string,
	// 	@AuthMember('_id') memberId: ObjectId,
	// ): Promise<Notification1> {
	// 	console.log('Query: getNotification');
	// 	console.log('input', input);

	// 	const productId = shapeIntoMongoObjectId(input);
	// 	return await this.notificationService.getNotification(memberId, productId);
	// }

	@UseGuards(AuthGuard)
	@Query(() => Notifications)
	public async getAllNotifications(
		@Args('input') input: NotificationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notifications> {
		console.log('Query: getAllNotifications');
		// input.receiverId = memberId;
		return await this.notificationService.getAllNotifications(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Notifications)
	public async getAllNotifications1(
		@Args('input') input: NotificationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notifications> {
		console.log('Query: getAllNotifications1');
		return await this.notificationService.getAllNotifications1(input, memberId);
	}
}
