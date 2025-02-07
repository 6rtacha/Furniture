import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	product = 'product',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
