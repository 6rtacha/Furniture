// rag/schemas/rag-chunk.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RagChunk extends Document {
	@Prop({ required: true })
	docId: string; // reference to product._id

	@Prop()
	text: string;

	@Prop({ type: [Number] })
	embedding: number[];

	@Prop({ type: Object })
	source: {
		type: string;
		ref: string;
		title: string;
		url: string;
	};
}

export const RagChunkSchema = SchemaFactory.createForClass(RagChunk);
