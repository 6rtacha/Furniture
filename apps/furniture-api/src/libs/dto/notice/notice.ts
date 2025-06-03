import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ProductLocation, ProductMaterial, ProductStatus, ProductType } from '../../enums/product.enum';
import { IsOptional } from 'class-validator';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@ObjectType() // dto
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Notices {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
