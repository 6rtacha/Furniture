import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Project, Projects } from '../../libs/dto/project/project';
import {
	AgentProjectsInquiry,
	AllProjectsInquiry,
	OrdinaryProjectInquiry,
	ProjectInput,
	ProjectsInquiry,
} from '../../libs/dto/project/project.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProjectUpdate } from '../../libs/dto/project/project.update';

@Resolver()
export class ProjectResolver {
	constructor(private readonly projectService: ProjectService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Project)
	public async createProject(
		@Args('input') input: ProjectInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Project> {
		console.log('Mutation: createProject');
		input.memberId = memberId;

		return await this.projectService.createProject(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Project)
	public async getProject(@Args('projectId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Project> {
		console.log('Query: getProject');
		console.log('input', input);

		const projectId = shapeIntoMongoObjectId(input);
		return await this.projectService.getProject(memberId, projectId);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Projects)
	public async getProjects(
		@Args('input') input: ProjectsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Projects> {
		console.log('Query: getProjects');
		return await this.projectService.getProjects(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Projects)
	public async getFavoriteProjects(
		@Args('input') input: OrdinaryProjectInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Projects> {
		console.log('Query: getFavoriteProjects');
		console.log('memberId:', memberId);

		return await this.projectService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Projects)
	public async getVisitedProjects(
		@Args('input') input: OrdinaryProjectInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Projects> {
		console.log('Query: getVisitedProjects');
		return await this.projectService.getVisited(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => Projects)
	public async getAgentProjects(
		@Args('input') input: AgentProjectsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Projects> {
		console.log('Mutation: getAgentProjects');
		return await this.projectService.getAgentProjects(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Project)
	public async likeTargetProject(
		@Args('projectId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Project> {
		console.log('Mutation: likeTargetProject');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.projectService.likeTargetProject(memberId, likeRefId);
	}

	/**  ADMIN */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Projects)
	public async getAllProjectsByAdmin(
		@Args('input') input: AllProjectsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Projects> {
		console.log('Query: getAllProjectsByAdmin');
		return await this.projectService.getAllProjectsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Project)
	public async updateProjectByAdmin(@Args('input') input: ProjectUpdate): Promise<Project> {
		console.log('Mutation: updateProjectByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);

		return await this.projectService.updateProjectByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Project)
	public async removeProjectByAdmin(@Args('productId') input: string): Promise<Project> {
		console.log('Mutation: removeProjectByAdmin');
		const productId = shapeIntoMongoObjectId(input);

		return await this.projectService.removeProjectByAdmin(productId);
	}
}
