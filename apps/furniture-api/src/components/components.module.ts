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
	],
})
export class ComponentsModule {}
