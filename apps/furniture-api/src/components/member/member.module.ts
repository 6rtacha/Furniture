import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import MemberSchema from '../../schemas/Member.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import FollowSchema from '../../schemas/Follow.model';
import { NotificationModule } from '../notification/notification.module';
import { SocketModule } from '../../socket/socket.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
		AuthModule,
		ViewModule,
		LikeModule,
		NotificationModule,
		SocketModule,
	],
	providers: [MemberResolver, MemberService],
	exports: [MemberService],
})
export class MemberModule {}
