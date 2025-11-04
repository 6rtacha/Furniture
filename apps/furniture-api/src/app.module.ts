import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';
import { NoticeResolver } from './no-spec/components/notice/notice.resolver';
import { NoticeService } from './no-spec/components/notice/notice.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
	imports: [
		ConfigModule.forRoot(),
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			playground: true,
			uploads: false,
			autoSchemaFile: 'schema.gql',
			installSubscriptionHandlers: false,
			context: () => ({}),
			formatError: (error: T) => {
				const graphqlFormattedError = {
					code: error?.extensions.code,
					message:
						error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
				};
				console.log('Graphql global error', graphqlFormattedError);
				return graphqlFormattedError;
			},
		}),
		ComponentsModule,
		DatabaseModule,
		SocketModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		AppResolver,
		NoticeResolver,
		NoticeService,
		{
			provide: 'PUB_SUB',
			useValue: new PubSub(),
		},
	],
})
export class AppModule {}
