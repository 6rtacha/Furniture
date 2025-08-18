import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RagService } from './rag.service';
import { IngestInput, RagAnswer, RagChunkType } from '../../libs/dto/rag/rag.types';

@Resolver()
export class RagResolver {
	constructor(private readonly rag: RagService) {}

	@Mutation(() => Boolean)
	async ingest(@Args('input') input: IngestInput) {
		const { docId, text, type, ref, title, url } = input;
		await this.rag.ingestDocument(docId, text, { type, ref, title, url });
		return true;
	}

	// @Mutation(() => Boolean)
	// async deleteDoc(@Args('docId') docId: string) {
	// 	await this.rag.removeByDocId(docId);
	// 	return true;
	// }

	@Query(() => RagAnswer)
	async askRag(
		@Args('question') question: string,
		@Args('system', { nullable: true }) system?: string,
	): Promise<RagAnswer> {
		return this.rag.answerWithRag(question, system);
	}

	@Query(() => [RagChunkType])
	async searchRag(
		@Args('query') query: string,
		@Args('limit', { type: () => Number, nullable: true }) limit = 5,
	): Promise<RagChunkType[]> {
		return this.rag.search(query, limit);
	}
}
