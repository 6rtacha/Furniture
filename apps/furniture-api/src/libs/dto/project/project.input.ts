import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { availableOptions, availableproductSorts, availableprojectSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { ProjectCategory, ProjectLocation, ProjectStatus, ProjectStyle } from '../../enums/project.enum';

@InputType()
export class ProjectInput {
	@IsNotEmpty()
	@Field(() => [ProjectStyle])
	projectStyle: ProjectStyle;

	@IsNotEmpty()
	@Field(() => ProjectCategory)
	projectCategory: ProjectCategory;

	@IsNotEmpty()
	@Field(() => ProjectLocation)
	projectLocation: ProjectLocation;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	projectTitle: string;

	@IsNotEmpty()
	@Field(() => Number)
	projectPrice: number;

	@IsNotEmpty()
	@Field(() => [String])
	projectImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	projectDesc?: string;

	memberId?: ObjectId;
}

@InputType()
export class ProjectPricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class PrISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: string;

	@IsOptional()
	@Field(() => [ProjectLocation], { nullable: true })
	locationList?: ProjectLocation[];

	@IsOptional()
	@Field(() => [ProjectCategory], { nullable: true })
	categoryList?: ProjectCategory[];

	@IsOptional()
	@Field(() => [ProjectStyle], { nullable: true })
	projectStyle?: ProjectStyle[];

	@IsOptional()
	@Field(() => ProjectPricesRange, { nullable: true })
	pricesRange?: ProjectPricesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProjectsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableprojectSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PrISearch)
	search: PrISearch;
}

@InputType()
class APrISearch {
	@IsOptional()
	@Field(() => ProjectStatus, { nullable: true })
	projectStatus?: ProjectStatus;
}

@InputType()
export class AgentProjectsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableproductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APrISearch)
	search: APrISearch;
}

@InputType()
class ALPrISearch {
	@IsOptional()
	@Field(() => ProjectStatus, { nullable: true })
	projectStatus?: ProjectStatus;

	@IsOptional()
	@Field(() => [ProjectLocation], { nullable: true })
	projectLocationList?: ProjectLocation[];
}

@InputType()
export class AllProjectsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableproductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPrISearch)
	search: ALPrISearch;
}

@InputType()
export class OrdinaryProjectInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
