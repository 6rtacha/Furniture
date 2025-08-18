// scripts/ingest-products-to-rag.ts
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MONGO_URI = process.env.MONGO_DEV || '';
const DB_NAME = 'Furniture';
const PRODUCTS_COLLECTION = 'products';
const RAG_COLLECTION = 'ragchunks';

async function generateEmbedding(text: string): Promise<number[]> {
	const response = await openai.embeddings.create({
		model: 'text-embedding-3-small', // 1536 dimensions
		input: text,
	});
	return response.data[0].embedding;
}

async function main() {
	const client = new MongoClient(MONGO_URI);
	await client.connect();
	const db = client.db(DB_NAME);

	const products = db.collection(PRODUCTS_COLLECTION);
	const ragchunks = db.collection(RAG_COLLECTION);

	// Fetch products that don’t have a corresponding ragchunk yet
	const docs = await products.find({}).toArray();
	console.log(`Found ${docs.length} products...`);

	for (const doc of docs) {
		const content = doc.description || doc.text || doc.content || '';
		if (!content.trim()) continue;

		console.log(`Embedding product _id=${doc._id}...`);
		const embedding = await generateEmbedding(content);

		await ragchunks.updateOne(
			{ docId: String(doc._id) },
			{
				$set: {
					docId: String(doc._id),
					text: content,
					embedding,
					source: {
						type: 'product',
						ref: `products/${doc._id}`,
						title: doc.name || 'Untitled',
						url: `/products/${doc._id}`,
					},
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		);
	}

	console.log('✅ RAG ingestion complete.');
	await client.close();
}

main().catch(console.error);
