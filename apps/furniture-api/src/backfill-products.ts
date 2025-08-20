import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductService } from './components/product/product.service';

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);

	const productService = app.get(ProductService);

	await productService.backfillEmbeddings();

	await app.close();
}

bootstrap()
	.then(() => {
		console.log('✅ Backfill completed');
		process.exit(0);
	})
	.catch((err) => {
		console.error('❌ Backfill failed', err);
		process.exit(1);
	});
