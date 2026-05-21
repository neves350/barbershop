import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiCreateServiceResponses() {
	return applyDecorators(
		ApiResponse({
			status: 201,
			description: 'Service created successfully',
			schema: {
				example: {
					service: {
						id: '46cf0946-4bd2-4154-a214-b5935b319428',
						name: 'Corte de cabelo',
						description: 'Corte personalizado para o teu tipo de cabelo e estilo de vida.',
						price: '35.00',
						duration: 45,
						category: 'HAIR',
						active: true,
						featured: false,
						createdAt: '2026-05-20T15:37:55.038Z',
					},
					message: 'Service created successfull',
				},
			},
		}),
		ApiResponse({
			status: 400,
			description: 'Validation error — invalid or missing fields.',
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
	)
}

export function ApiFindAllResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'List of services retrieved successfully',
			schema: {
				example: [
					{
						id: '46cf0946-4bd2-4154-a214-b5935b319428',
						name: 'Brushing Head Spa',
						description: 'Tratamento relaxante de head spa com brushing final.',
						price: '0',
						duration: 90,
						category: 'HAIR',
						active: true,
						createdAt: '2026-05-20T15:37:55.038Z',
					},
					{
						id: 'ca742fcb-efff-41a7-868d-2fc1d04b8d39',
						name: 'Depil. 1/2 Perna',
						description: 'Depilação de meia perna.',
						price: '0',
						duration: 30,
						category: 'AESTHETICS',
						active: true,
						createdAt: '2026-05-20T15:37:57.953Z',
					},
				],
			},
		}),
		ApiResponse({
			status: 404,
			description: 'Service not found.',
		}),
	)
}

export function ApiFindFeaturedResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Up to 4 featured services retrieved successfully',
			schema: {
				example: [
					{
						id: '46cf0946-4bd2-4154-a214-b5935b319428',
						name: 'Corte de cabelo',
						description:
							'Corte personalizado para o teu tipo de cabelo e estilo de vida.',
						price: '35.00',
						duration: 45,
						category: 'HAIR',
						active: true,
						featured: true,
						createdAt: '2026-05-20T15:37:55.038Z',
					},
				],
			},
		}),
		ApiResponse({
			status: 200,
			description: 'Empty array if no featured services are set.',
		}),
	)
}
