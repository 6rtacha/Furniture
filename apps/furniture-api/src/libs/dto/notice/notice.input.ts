import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProductLocation, ProductMaterial, ProductStatus, ProductType } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availableproductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@IsNotEmpty()
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	noticeContent: string;

	memberId?: ObjectId;
}

@InputType()
export class NoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;
}
