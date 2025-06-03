import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	INQUIRY = 'INQUIRY',
	EVENT = 'EVENT',
	UPDATE = 'UPDATE',
	IMPORTANT = 'IMPORTANT',
}
registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
	COMPLETED = 'COMPLETED',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});
