import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { OrderStatus } from '../../enums/product.enum';

@InputType()
export class OrderItemInput {
	@IsNotEmpty()
	@Field(() => Int)
	itemQuantity: number;

	@IsNotEmpty()
	@Field(() => Int)
	itemPrice: number;

	@IsNotEmpty()
	@Field(() => String)
	productId: ObjectId;

	orderId?: ObjectId;
}

@InputType()
export class OISearch {
	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;
}

@InputType()
export class OrderInquiry {
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

	@IsOptional()
	@Field(() => OISearch, { nullable: true })
	search?: OISearch;
}

@InputType()
export class OrderUpdateInput {
	@IsNotEmpty()
	@Field(() => String)
	orderId: string;

	@IsNotEmpty()
	@Field(() => OrderStatus)
	orderStatus: OrderStatus;
}
