import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ProductLocation, ProductMaterial, ProductStatus, ProductType } from '../../enums/product.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticeUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeContent?: string;
}
