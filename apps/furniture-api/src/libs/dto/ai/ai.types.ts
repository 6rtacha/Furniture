import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class ChatMessageInput {
	@Field({ nullable: true }) system?: string;
	@Field(() => [String]) historyUser?: string[]; // alternating user/assistant pairs (optional)
	@Field(() => [String]) historyAssistant?: string[]; // optional
	@Field() message!: string;
	@Field({ nullable: true }) model?: string;
}

@ObjectType()
export class ChatReply {
	@Field() text!: string;
}
