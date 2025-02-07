import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Products, Product } from '../../libs/dto/product/product';
import {
	AgentProductsInquiry,
	AllProductsInquiry,
	OrdinaryInquiry,
	ProductsInquiry,
	ProductInput,
} from '../../libs/dto/product/product.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Product)
	public async createproduct(
		@Args('input') input: ProductInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: createproduct');
		input.memberId = memberId;

		return await this.productService.createproduct(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Product)
	public async getproduct(@Args('productId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Product> {
		console.log('Mutation: getproduct');
		const productId = shapeIntoMongoObjectId(input);
		return await this.productService.getproduct(memberId, productId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async updateproduct(
		@Args('input') input: ProductUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: updateproduct');
		input._id = shapeIntoMongoObjectId(input._id);

		return await this.productService.updateproduct(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Products)
	public async getProperties(
		@Args('input') input: ProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Mutation: getProperties');
		return await this.productService.getProperties(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Products)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getFavorites');
		return await this.productService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Products)
	public async getVisited(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getVisited');
		return await this.productService.getVisited(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => Products)
	public async getAgentProperties(
		@Args('input') input: AgentProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Mutation: getAgentProperties');
		return await this.productService.getAgentProperties(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Product)
	public async likeTargetproduct(
		@Args('productId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: likeTargetproduct');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.productService.likeTargetproduct(memberId, likeRefId);
	}

	/**  ADMIN */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Products)
	public async getAllPropertiesByAdmin(
		@Args('input') input: AllProductsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Products> {
		console.log('Query: getAllPropertiesByAdmin');
		return await this.productService.getAllPropertiesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async updateproductByAdmin(@Args('input') input: ProductUpdate): Promise<Product> {
		console.log('Mutation: updateproductByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);

		return await this.productService.updateproductByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Product)
	public async removeproductByAdmin(@Args('productId') input: string): Promise<Product> {
		console.log('Mutation: removeproductByAdmin');
		const productId = shapeIntoMongoObjectId(input);

		return await this.productService.removeproductByAdmin(productId);
	}
}
