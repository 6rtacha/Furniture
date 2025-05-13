import { Schema } from 'mongoose';
import { ProjectCategory, ProjectLocation, ProjectStatus, ProjectStyle } from '../libs/enums/project.enum';

const ProjectSchema = new Schema(
	{
		projectStyle: {
			type: [String],
			enum: ProjectStyle,
			required: true,
		},

		projectCategory: {
			type: String,
			enum: ProjectCategory,
			required: true,
		},

		projectStatus: {
			type: String,
			enum: ProjectStatus,
			default: ProjectStatus.ACTIVE,
		},

		projectLocation: {
			type: String,
			enum: ProjectLocation,
			required: true,
		},

		projectTitle: {
			type: String,
			required: true,
		},

		projectPrice: {
			type: Number,
			required: true,
		},

		projectViews: {
			type: Number,
			default: 0,
		},

		projectLikes: {
			type: Number,
			default: 0,
		},

		projectComments: {
			type: Number,
			default: 0,
		},

		projectRank: {
			type: Number,
			default: 0,
		},

		projectImages: {
			type: [String],
			required: true,
		},

		projectDesc: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		createdAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'projects' },
);

ProjectSchema.index({ projectCategory: 1, projectTitle: 1, projectPrice: 1 }, { unique: true });

export default ProjectSchema;
