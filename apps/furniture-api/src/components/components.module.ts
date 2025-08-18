import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ProjectModule } from './project/project.module';
import { NotificationModule } from './notification/notification.module';
import { SocketModule } from '../socket/socket.module';
import { OrderItemModule } from './order-item/order-item.module';
import { NoticeModule } from './notice/notice.module';
import { AiModule } from './ai/ai.module';
import { RagModule } from './rag/rag.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		ProductModule,
		BoardArticleModule,
		LikeModule,
		ViewModule,
		CommentModule,
		FollowModule,
		OrderModule,
		ProjectModule,
		NotificationModule,
		SocketModule,
		OrderItemModule,
		NoticeModule,
		AiModule,
		RagModule,
	],
})
export class ComponentsModule {}
