import { Field, Int, ObjectType } from '@nestjs/graphql';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Notification1 {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NotificationType)
	notificationType: NotificationType;

	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	notificationTitle: string;

	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@Field(() => String)
	authorId?: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Notifications {
	@Field(() => [Notification1])
	list: Notification1[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
