import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { OrderInquiry, OrderItemInput, OrderUpdateInput } from '../../libs/dto/order/order.input';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('order') private readonly orderModel: Model<Order>,
		@InjectModel('orderItem') private readonly orderItemModel: Model<OrderItem>,
	) {}

	async createOrder(input: OrderItemInput[], memberId: ObjectId): Promise<Order> {
		const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
			return accumulator + item.itemPrice * item.itemQuantity;
		}, 0);
		const delivery = amount < 100 ? 5 : 0;
		try {
			const newOrder: Order = await this.orderModel.create({
				orderTotal: amount + delivery,
				orderDelivery: delivery,
				memberId: memberId,
			});

			const orderId = newOrder._id;
			console.log('orderId', orderId);
			await this.recordOrderItem(orderId, input);
			//TODO create orderItems

			return newOrder;
		} catch (err) {
			console.log('Error, model:createOrder:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	async getMyOrders(input: OrderInquiry, memberId: ObjectId): Promise<Orders> {
		const matches: T = { memberId: memberId };

		const result = await this.orderModel
			.aggregate([
				{ $match: matches },
				{ $sort: { updatedAt: -1 } },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							{
								$lookup: {
									from: 'orderItems',
									localField: '_id',
									foreignField: 'orderId',
									as: 'orderItems',
								},
							},
							// { $unwind: '$orderItems' },

							{
								$lookup: {
									from: 'products',
									localField: 'orderItems.productId',
									foreignField: '_id',
									as: 'productData',
								},
							},
							// { $unwind: '$productData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		console.log(result);

		return result[0];
	}

	async updateOrder(input: OrderUpdateInput, memberId: ObjectId): Promise<Order> {
		const orderStatus = input.orderStatus;

		const result = await this.orderModel
			.findOneAndUpdate({ memberId: memberId, _id: input.orderId }, { orderStatus: orderStatus }, { new: true })
			.exec();
		if (!result) if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		// orderStatus Pause => Process + 1 to users
		// if (orderStatus === OrderStatus.PROCESS) {
		//   await this.memberService.addUserPoint(member, 1);
		// }
		return result;
	}

	private async recordOrderItem(orderId: ObjectId, input: OrderItemInput[]): Promise<void> {
		const promisedList = input.map(async (item: OrderItemInput) => {
			item.orderId = orderId;
			//   item.productId = shapeIntoMongooseObjectId(item.productId);
			await this.orderItemModel.create(item);

			return 'INSERTED';
		});

		const orderItemsState = await Promise.all(promisedList);
		console.log('orderItemsState:', orderItemsState);
	}
}
