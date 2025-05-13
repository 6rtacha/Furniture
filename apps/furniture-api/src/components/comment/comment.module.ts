import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { ProductModule } from '../product/product.module';
import ProjectSchema from '../../schemas/Project.model';
import { NotificationModule } from '../notification/notification.module';
import { ProjectModule } from '../project/project.module';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import MemberSchema from '../../schemas/Member.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Comment',
				schema: CommentSchema,
			},
		]),
		MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
		MongooseModule.forFeature([{ name: 'BoardArticle', schema: BoardArticleSchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		AuthModule,
		MemberModule,
		ProductModule,
		BoardArticleModule,
		NotificationModule,
		ProjectModule,
	],
	providers: [CommentResolver, CommentService],
})
export class CommentModule {}
