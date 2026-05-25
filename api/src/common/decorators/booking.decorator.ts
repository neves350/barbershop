import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

const bookingExample = {
	id: '46cf0946-4bd2-4154-a214-b5935b319428',
	clientName: 'João Silva',
	phone: '910200300',
	email: 'joao@example.com',
	notes: null,
	source: null,
	date: '2026-05-30T10:00:00.000Z',
	status: 'PENDING',
	workerId: null,
	createdAt: '2026-05-25T10:00:00.000Z',
	updatedAt: '2026-05-25T10:00:00.000Z',
}

export function ApiCreateBookingResponses() {
	return applyDecorators(
		ApiResponse({
			status: 201,
			description: 'Booking created successfully',
			schema: {
				example: {
					booking: bookingExample,
					message: 'Booking created successfull',
				},
			},
		}),
		ApiResponse({
			status: 400,
			description: 'Validation error — invalid or missing fields.',
		}),
	)
}

export function ApiFindAllBookingResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'List of bookings retrieved successfully',
			schema: {
				example: [
					bookingExample,
					{
						...bookingExample,
						id: 'ca742fcb-efff-41a7-868d-2fc1d04b8d39',
						clientName: 'Maria Santos',
						phone: '920300400',
						date: '2026-05-31T14:00:00.000Z',
						status: 'CONFIRMED',
					},
				],
			},
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
	)
}

export function ApiFindOneBookingResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Booking retrieved successfully',
			schema: { example: bookingExample },
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized — invalid or missing bearer token.',
		}),
		ApiResponse({
			status: 404,
			description: 'Booking not found.',
		}),
	)
}

export function ApiUpdateBookingResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Booking updated successfully',
			schema: {
				example: {
					booking: {
						...bookingExample,
						status: 'CONFIRMED',
						updatedAt: '2026-05-25T11:00:00.000Z',
					},
					message: 'Booking updated successfully',
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
			description: 'Booking not found.',
		}),
	)
}

export function ApiDeleteBookingResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Booking deleted successfully',
			schema: {
				example: {
					message: 'Booking deleted successfully',
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
			description: 'Booking not found.',
		}),
	)
}
