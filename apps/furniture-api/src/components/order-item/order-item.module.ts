import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import OrderItemSchema from '../../schemas/OrderItem.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'orderItem',
				schema: OrderItemSchema,
			},
		]),
	],
})
export class OrderItemModule {}
