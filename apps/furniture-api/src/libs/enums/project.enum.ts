import { registerEnumType } from '@nestjs/graphql';

export enum ProjectCategory {
	LIVINGROOM = 'LIVINGROOM',
	BEDROOM = 'BEDROOM',
	DININGROOM = 'DININGROOM',
	KIDSROOM = 'KIDSROOM',
	KITCHEN = 'KITCHEN',
	OFFICE = 'OFFICE',
	RESTAURANT = 'RESTAURANT',
}
registerEnumType(ProjectCategory, {
	name: 'ProjectCategory',
});

export enum ProjectStyle {
	MIDMODERN = 'MIDMODERN',
	MODERN = 'MODERN',
	SCANDINAVIAN = 'SCANDINAVIAN',
	BOHEMIAN = 'BOHEMIAN',
	TRADITIONAL = 'TRADITIONAL',
	MINIMALIST = 'MINIMALIST',
	RUSTIC = 'RUSTIC',
}
registerEnumType(ProjectStyle, {
	name: 'ProjectStyle',
});

export enum ProjectStatus {
	ACTIVE = 'ACTIVE',
	PAUSE = 'PAUSE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProjectStatus, {
	name: 'ProjectStatus',
});

export enum ProjectLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(ProjectLocation, {
	name: 'ProjectLocation',
});
