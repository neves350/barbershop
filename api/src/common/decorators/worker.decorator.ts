import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

const workerExample = {
	id: '46cf0946-4bd2-4154-a214-b5935b319428',
	supabaseId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
	name: 'João Silva',
	specialty: 'BEAUTICIAN',
	avatarUrl: null,
	active: true,
	createdAt: '2026-05-23T10:00:00.000Z',
	updatedAt: '2026-05-23T10:00:00.000Z',
}

export function ApiCreateWorkerResponses() {
	return applyDecorators(
		ApiResponse({
			status: 201,
			description: 'Worker created successfully',
			schema: {
				example: {
					worker: workerExample,
					message: 'Worker created successfull',
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
			status: 404,
			description: 'Supabase user not found.',
		}),
		ApiResponse({
			status: 409,
			description: 'Conflict — a worker for this Supabase user already exists.',
		}),
	)
}

export function ApiFindAllWorkerResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'List of workers retrieved successfully',
			schema: {
				example: [
					workerExample,
					{
						id: 'ca742fcb-efff-41a7-868d-2fc1d04b8d39',
						supabaseId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
						name: 'Maria Santos',
						specialty: 'ESTHETICS',
						avatarUrl: 'https://example.com/avatar.jpg',
						active: true,
						createdAt: '2026-05-23T11:00:00.000Z',
						updatedAt: '2026-05-23T11:00:00.000Z',
					},
				],
			},
		}),
	)
}

export function ApiFindOneWorkerResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Worker retrieved successfully',
			schema: { example: workerExample },
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
		ApiResponse({
			status: 404,
			description: 'Worker not found.',
		}),
	)
}

export function ApiUpdateWorkerResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Worker updated successfully',
			schema: {
				example: {
					worker: {
						...workerExample,
						name: 'João Silva Updated',
						specialty: 'ESTHETICS',
						updatedAt: '2026-05-23T12:00:00.000Z',
					},
					message: 'Worker updated successfully',
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
			status: 404,
			description: 'Worker not found.',
		}),
	)
}

export function ApiDeleteWorkerResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Worker deleted successfully',
			schema: {
				example: {
					message: 'Worker deleted successfully',
					success: true,
				},
			},
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
		ApiResponse({
			status: 404,
			description: 'Worker not found.',
		}),
	)
}
