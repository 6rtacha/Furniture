import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ProductLocation, ProductMaterial, ProductStatus, ProductType } from '../../enums/product.enum';
import { IsOptional } from 'class-validator';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType() // dto
export class Product {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ProductType)
	productType: ProductType;

	@Field(() => ProductStatus)
	productStatus: ProductStatus;

	@Field(() => ProductLocation)
	productLocation: ProductLocation;

	@Field(() => String)
	productAddress: string;

	@Field(() => String)
	productTitle: string;

	@Field(() => Number)
	productPrice: number;

	@Field(() => ProductMaterial)
	productMaterial: ProductMaterial;

	@Field(() => String)
	productColors: string;

	@Field(() => Int)
	productWidth: number;

	@Field(() => Int)
	productHeight: number;

	@Field(() => Int)
	productLength: number;

	@Field(() => Int)
	productViews: number;

	@Field(() => Int)
	productLikes: number;

	@Field(() => Int)
	productComments: number;

	@Field(() => Int)
	productRank: number;

	@Field(() => [String])
	productImages: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	productDesc?: string;

	@Field(() => Boolean)
	productPurchase: boolean;

	@Field(() => Boolean)
	productRent: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => [Number], { nullable: true })
	productEmbedding?: number[];

	@Field(() => Number, { nullable: true })
	score?: number; // similarity score

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation */

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Products {
	@Field(() => [Product])
	list: Product[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
