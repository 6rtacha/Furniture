import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { IsOptional } from 'class-validator';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { ProjectCategory, ProjectLocation, ProjectStatus, ProjectStyle } from '../../enums/project.enum';

@ObjectType() // dto
export class Project {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => [ProjectStyle])
	projectStyle: ProjectStyle;

	@Field(() => ProjectCategory)
	projectCategory: ProjectCategory;

	@Field(() => ProjectStatus)
	projectStatus: ProjectStatus;

	@Field(() => ProjectLocation)
	projectLocation: ProjectLocation;

	@Field(() => String)
	projectTitle: string;

	@Field(() => Number)
	projectPrice: number;

	@Field(() => Int)
	projectViews: number;

	@Field(() => Int)
	projectLikes: number;

	@Field(() => Int)
	projectComments: number;

	@Field(() => Int)
	projectRank: number;

	@Field(() => [String])
	projectImages: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	projectDesc?: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	/** from aggregation */

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Projects {
	@Field(() => [Project])
	list: Project[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
