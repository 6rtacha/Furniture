import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async createNotice(@Args('input') input: NoticeInput, @AuthMember('_id') memberId: ObjectId): Promise<Notice> {
		console.log('Mutation: createNotice');
		input.memberId = memberId;

		return await this.noticeService.createNotice(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notices)
	public async getNotices(
		@Args('input') input: NoticesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		console.log('Query: getNotices');
		return await this.noticeService.getNotices(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async updateNotice(
		@Args('input') input: NoticeUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: createNotice');
		input._id = shapeIntoMongoObjectId(input._id);

		return await this.noticeService.updateNotice(memberId, input);
	}
}
