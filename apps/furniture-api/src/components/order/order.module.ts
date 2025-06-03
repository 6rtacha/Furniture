import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema from '../../schemas/Order.model';
import { OrderItemModule } from '../order-item/order-item.module';
import { AuthModule } from '../auth/auth.module';
import OrderItemSchema from '../../schemas/OrderItem.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'order',
				schema: OrderSchema,
			},
			{
				name: 'orderItem',
				schema: OrderItemSchema,
			},
		]),
		OrderItemModule,
		AuthModule,
	],
	providers: [OrderResolver, OrderService],
	exports: [OrderService],
})
export class OrderModule {}
