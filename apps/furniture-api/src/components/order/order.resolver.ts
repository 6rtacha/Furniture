import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Order, Orders } from '../../libs/dto/order/order';
import { OrderInquiry, OrderItemInput, OrderUpdateInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async createOrder(
		@Args('input', { type: () => [OrderItemInput] }) input: OrderItemInput[],
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		return await this.orderService.createOrder(input, memberId);
	}
	@UseGuards(AuthGuard)
	@Query(() => Orders)
	public async getMyOrders(@Args('input') input: OrderInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Orders> {
		return await this.orderService.getMyOrders(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	async updateOrder(@Args('input') input: OrderUpdateInput, @AuthMember('_id') memberId: ObjectId): Promise<Order> {
		return await this.orderService.updateOrder(input, memberId);
	}
}
