import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import productSchema from 'apps/balloon-api/src/schemas/product.model';
import MemberSchema from 'apps/balloon-api/src/schemas/Member.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'product', schema: productSchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
	],
	controllers: [BatchController],
	providers: [BatchService],
})
export class BatchModule {}
