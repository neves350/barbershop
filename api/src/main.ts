import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('Barbershop API')
		.setDescription(
			'API for barbershop public website and a private dashboard.',
		)
		.setVersion('1.0.0')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, documentFactory, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	})

	app.use(
		'/docs',
		apiReference({
			theme: 'elysiajs',
			content: documentFactory,
		}),
	)

	await app.listen(process.env.PORT ?? 3000)
	Logger.log('[INFO] Server listening at http://localhost:3000')
	Logger.log('[INFO] API Reference available at http://localhost:3000/docs')
}
bootstrap()
