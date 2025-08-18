import { Field, ObjectType, InputType, Float } from '@nestjs/graphql';

@InputType()
export class IngestInput {
	@Field() docId!: string;
	@Field() text!: string;
	@Field() type!: string;
	@Field() ref!: string;
	@Field({ nullable: true }) title?: string;
	@Field({ nullable: true }) url?: string;
}

@ObjectType()
export class RagSource {
	@Field() rank!: number;
	@Field(() => Float, { nullable: true }) score?: number;
	@Field({ nullable: true }) title?: string;
	@Field({ nullable: true }) url?: string;
	@Field() type!: string;
	@Field() ref!: string;
	@Field() preview!: string;
}

@ObjectType()
export class RagAnswer {
	@Field() answer!: string;
	@Field(() => [RagSource]) sources!: RagSource[];
}

// rag/graphql/rag-chunk.type.ts

@ObjectType()
export class RagChunkType {
	@Field()
	_id: string;

	@Field()
	text: string;

	@Field(() => Float, { nullable: true })
	score?: number;

	@Field(() => String, { nullable: true })
	source?: string;
}
