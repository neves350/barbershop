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

export function ApiFindOneResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Service retrieved successfully',
			schema: {
				example: {
					id: '0b60e8dd-14ec-49c2-9131-8a7ebb6b28bf',
					name: 'Depil. 1/2 Perna',
					description: 'Depilação de meia perna.',
					price: '0',
					duration: 30,
					category: 'AESTHETICS',
					active: true,
					featured: true,
					workerId: null,
					createdAt: '2026-05-20T21:38:34.797Z',
				},
			},
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
		ApiResponse({
			status: 404,
			description: 'Service not found.',
		}),
	)
}

export function ApiUpdateServiceResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Service updated successfully',
			schema: {
				example: {
					id: '0b60e8dd-14ec-49c2-9131-8a7ebb6b28bf',
					name: 'Depil. 1/2 Perna',
					description: 'Depilação de meia perna.',
					price: '25.00',
					duration: 30,
					category: 'AESTHETICS',
					active: true,
					featured: true,
					workerId: 'e3b0c442-98fc-1c14-9afb-f4c8996fb924',
					createdAt: '2026-05-20T21:38:34.797Z',
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
		ApiResponse({
			status: 403,
			description: 'Forbidden — service does not belong to this worker.',
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
