import mongoose, { Schema } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../libs/enums/notice.enum';

const FAQSchema = new Schema(
	{
		faqCategory: {
			type: String,
			enum: NoticeCategory,
			required: true,
		},

		faqQuestion: {
			type: String,
			required: true,
		},

		faqAnswer: {
			type: String,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'notices' },
);

export default FAQSchema;
