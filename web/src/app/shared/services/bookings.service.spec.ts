import { TestBed } from '@angular/core/testing'
import { BookingsApi } from '@core/api/bookings.api'
import { makeBooking } from '@core/testing/factories'
import { mockBookings } from '@core/testing/mocks'
import { firstValueFrom, of, throwError } from 'rxjs'
import { beforeEach, describe, it, vi } from 'vitest'
import { BookingsService } from './bookings.service'

describe('BookingsService', () => {
	let service: BookingsService

	beforeEach(() => {
		vi.clearAllMocks() // clear all mocks before tests

		TestBed.configureTestingModule({
			providers: [{ provide: BookingsApi, useValue: mockBookings }],
		})
		service = TestBed.inject(BookingsService)
	})

	describe('create()', () => {
		const payload = {
			customerName: 'Client 1',
			customerPhone: '910200300',
			date: new Date(),
			serviceId: 's-1',
		}
		const booking = makeBooking({
			id: 'b-1',
			customerName: 'Client 1',
			customerPhone: '910200300',
			date: new Date(),
			email: 'client1@example.com',
			notes: 'This is a note.',
			serviceId: 's-1',
		})

		it('should return the created booking', async () => {
			mockBookings.create.mockReturnValue(
				of({ booking, message: 'Booking created successfully' }),
			)

			const result = await firstValueFrom(service.create(payload))

			expect(result).toEqual(booking)
			expect(mockBookings.create).toHaveBeenCalledOnce()
		})
		it('should call the API with the correct payload', async () => {
			mockBookings.create.mockReturnValue(
				of({ booking, message: 'Booking created successfully' }),
			)

			await firstValueFrom(service.create(payload))

			expect(mockBookings.create).toHaveBeenCalledWith(payload)
		})
		it('should set error signal and reset loading when API fails', async () => {
			mockBookings.create.mockReturnValue(
				throwError(() => new Error('Create failed')),
			)

			await expect(firstValueFrom(service.create(payload))).rejects.toThrow(
				'Create failed',
			)

			// tap({ error }) resets loading and sets the error signal
			expect(service.loading()).toBe(false)
			expect(service.error()).toBe('Create failed')
		})
	})
})
