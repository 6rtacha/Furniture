import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RagChunk } from '../../schemas/Rag-chunk.model';
import { Product } from '../../libs/dto/product/product';

type SourceMeta = { type: string; ref: string; title?: string; url?: string };

@Injectable()
export class RagService {
	private readonly logger = new Logger(RagService.name);
	private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

	constructor(
		@InjectModel(RagChunk.name)
		private readonly ragChunkModel: Model<RagChunk>,
		@InjectModel('product') private readonly productModel: Model<Product>,
	) {}

	async generateEmbedding(text: string): Promise<number[]> {
		const res = await this.openai.embeddings.create({
			model: 'text-embedding-3-small',
			input: text,
		});
		return res.data[0].embedding;
	}

	async syncProduct(product: any) {
		if (!product.description?.trim()) return;

		this.logger.log(`Syncing product ${product._id} to ragchunks...`);

		// Generate embedding
		const embedding = await this.generateEmbedding(product.productTitle + ' ' + product.description);

		// 1️⃣ Save embedding in products collection
		await this.productModel.updateOne({ _id: product._id }, { $set: { productEmbedding: embedding } });

		// 2️⃣ Sync to RAG chunks as before
		await this.ragChunkModel.updateOne(
			{ docId: String(product._id) },
			{
				$set: {
					docId: String(product._id),
					text: product.description,
					embedding,
					source: {
						type: 'product',
						ref: `products/${product._id}`,
						title: product.productTitle,
						url: `/products/${product._id}`,
					},
				},
			},
			{ upsert: true },
		);

		this.logger.log(`✅ Synced product ${product._id}`);
	}

	// naive char-based chunker (replace with token-based later if you want)
	private chunkText(text: string, size = 1200, overlap = 150) {
		const chunks: string[] = [];
		let i = 0;
		while (i < text.length) {
			const end = Math.min(text.length, i + size);
			chunks.push(text.slice(i, end));
			i = end - overlap;
			if (i < 0) i = 0;
		}
		return chunks.map((s) => s.trim()).filter(Boolean);
	}

	async embed(texts: string[]): Promise<number[][]> {
		const res = await this.openai.embeddings.create({
			model: 'text-embedding-3-small', // 1536-dim
			input: texts,
		});
		return res.data.map((v) => v.embedding as number[]);
	}

	async ingestDocument(docId: string, fullText: string, source: SourceMeta) {
		const chunks = this.chunkText(fullText);
		const vectors = await this.embed(chunks);

		const bulkOps = chunks.map((text, idx) => ({
			updateOne: {
				filter: { docId, 'source.ref': source.ref, text },
				update: {
					$set: {
						docId,
						text,
						source,
						embedding: vectors[idx],
						updatedAt: new Date(),
					},
					$setOnInsert: { createdAt: new Date() },
				},
				upsert: true,
			},
		}));

		await this.ragChunkModel.bulkWrite(bulkOps);
		return { inserted: chunks.length };
	}

	// rag/rag.service.ts
	async search(query: string, limit = 5): Promise<any[]> {
		const embedding = await this.generateEmbedding(query);

		const results = await this.ragChunkModel.aggregate([
			{
				$vectorSearch: {
					index: 'vector_index', // ⚠️ replace with your Atlas Vector Index name
					path: 'embedding',
					queryVector: embedding,
					numCandidates: 100,
					limit,
				},
			},
			{
				$project: {
					_id: 1,
					text: 1,
					score: { $meta: 'vectorSearchScore' },
					source: 1,
				},
			},
		]);

		return results;
	}

	// Build a prompt and call your existing AiService if you prefer;
	// shown here directly for clarity.
	async answerWithRag(question: string, system?: string) {
		const topK = await this.search(question, 6);

		const context = topK.map((c, i) => `[#${i + 1}] (${c.source?.type}:${c.source?.ref}) ${c.text}`).join('\n\n');

		const input = [
			system ? { role: 'system', content: [{ type: 'input_text', text: system }] } : null,
			{
				role: 'user',
				content: [
					{
						type: 'input_text',
						text: `Use ONLY the context to answer. If missing, say you don't know.
Return concise, factual answers.

CONTEXT:
${context}

QUESTION:
${question}`,
					},
				],
			},
		].filter(Boolean) as any[];

		const res = await this.openai.responses.create({
			model: 'gpt-5-mini',
			input,
		});

		const answer = (res as any).output_text ?? '';
		const sources = topK.map((c, i) => ({
			rank: i + 1,
			score: c.score,
			title: c.source?.title,
			url: c.source?.url,
			type: c.source?.type,
			ref: c.source?.ref,
			preview: c.text.slice(0, 240),
		}));

		return { answer, sources };
	}
}
