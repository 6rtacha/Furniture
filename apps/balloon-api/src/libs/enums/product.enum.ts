import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	RIDE = 'RIDE',
	SHOW = 'SHOW',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	INREPAIR = 'INREPAIR',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductLocation {
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
registerEnumType(ProductLocation, {
	name: 'ProductLocation',
});
