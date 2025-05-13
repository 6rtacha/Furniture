import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ProjectLocation, ProjectStatus, ProjectStyle } from '../../enums/project.enum';

@InputType()
export class ProjectUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => [ProjectStyle], { nullable: true })
	projectStyle?: ProjectStyle;

	@IsOptional()
	@Field(() => ProjectStatus, { nullable: true })
	projectStatus?: ProjectStatus;

	@IsOptional()
	@Field(() => ProjectLocation, { nullable: true })
	projectLocation?: ProjectLocation;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	projectTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	projectPrice?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	projectImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	projectDesc?: string;

	soldAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
