import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { NoticeStatus } from '../../libs/enums/notice.enum';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('notice') private readonly noticeModel: Model<Notice>) {}

	public async createNotice(input: NoticeInput): Promise<Notice> {
		try {
			const result = await this.noticeModel.create(input);

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotices(memberId: ObjectId, input: NoticesInquiry): Promise<Notices> {
		const match: T = {};
		const sort: T = { [input?.direction ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateNotice(memberId: ObjectId, input: NoticeUpdate): Promise<Notice> {
		let { noticeCategory, noticeStatus, noticeContent, noticeTitle } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			noticeStatus: NoticeStatus.ACTIVE,
		};

		const result = await this.noticeModel.findByIdAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}
}
