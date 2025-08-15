import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
	private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

	// ai.service.ts
	async reply({
		system,
		messages,
		model = 'gpt-5-mini',
	}: {
		system?: string;
		messages: { role: 'user' | 'assistant'; content: string }[];
		model?: string;
	}) {
		const input = [
			system ? { role: 'system', content: [{ type: 'input_text', text: system }] } : null,
			...messages.map((m) => ({
				role: m.role,
				content: [
					{
						type: m.role === 'assistant' ? 'output_text' : 'input_text',
						text: m.content,
					},
				],
			})),
		].filter(Boolean) as any[];

		const res = await this.client.responses.create({ model, input });
		return res.output_text ?? '';
	}
}
