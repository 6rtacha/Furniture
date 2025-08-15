import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AiService } from './ai.service';
import { ChatMessageInput, ChatReply } from '../../libs/dto/ai/ai.types';

@Resolver()
export class AiResolver {
	constructor(private readonly ai: AiService) {}

	@Mutation(() => ChatReply)
	async chat(@Args('input') input: ChatMessageInput): Promise<ChatReply> {
		const { system, historyUser = [], historyAssistant = [], message, model } = input;

		const messages: { role: 'user' | 'assistant'; content: string }[] = [];

		const len = Math.min(historyUser.length, historyAssistant.length);
		for (let i = 0; i < len; i++) {
			messages.push({ role: 'user', content: historyUser[i] });
			messages.push({ role: 'assistant', content: historyAssistant[i] });
		}
		messages.push({ role: 'user', content: message });

		const text = await this.ai.reply({ system, messages, model });
		return { text };
	}
}
