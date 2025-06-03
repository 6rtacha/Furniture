import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { OrderStatus } from '../../enums/product.enum';
import { Product } from '../product/product';

@ObjectType()
export class OrderItem {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Number)
	itemQuantity: number;

	@Field(() => Number)
	itemPrice: number;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number)
	orderDelivery: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [OrderItem])
	orderItems: OrderItem[];

	@Field(() => [Product])
	productData: Product[];
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
