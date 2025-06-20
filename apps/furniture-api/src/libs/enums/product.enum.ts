import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	SOFA = 'SOFA',
	BED = 'BED',
	TABLE = 'TABLE',
	CHAIR = 'CHAIR',
	CABINET = 'CABINET',
	OUTDOOR = 'OUTDOOR',
	LAMP = 'LAMP',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	PAUSE = 'PAUSE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
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

export enum OrderStatus {
	PAUSE = 'PAUSE',
	PROCESS = 'PROCESS',
	FINISH = 'FINISH',
	DELETE = 'DELETE',
}
registerEnumType(OrderStatus, {
	name: 'OrderStatus',
});

export enum ProductMaterial {
	WOOD = 'WOOD',
	METAL = 'METAL',
	FABRICS = 'FABRICS',
	LEATHER = 'LEATHER',
	VELVET = 'VELVET',
	PLYWOOD = 'PLYWOOD',
	GLASS = 'GLASS',
}
registerEnumType(ProductMaterial, {
	name: 'ProductMaterial',
});
