import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	product = 'product',
	ARTICLE = 'ARTICLE',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
