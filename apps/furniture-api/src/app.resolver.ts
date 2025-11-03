import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
	@Query(() => String)
	public async sayHello(): Promise<string> {
		return 'GraphQL ApI Server';
	}
}
