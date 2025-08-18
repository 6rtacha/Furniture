// rag/rag.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RagService } from './rag.service';
import { RagChunk, RagChunkSchema } from '../../schemas/Rag-chunk.model';
import ProductSchema from '../../schemas/Product.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: RagChunk.name, schema: RagChunkSchema }]),
		MongooseModule.forFeature([{ name: 'product', schema: ProductSchema }]),
	],
	providers: [RagService],
	exports: [RagService],
})
export class RagModule {}
