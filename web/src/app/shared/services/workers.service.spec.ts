import { TestBed } from '@angular/core/testing'
import { WorkersApi } from '@core/api/workers.api'
import { WorkerSpecialty } from '@core/models/worker.model'
import { makeWorker } from '@core/testing/factories'
import { mockWorkers } from '@core/testing/mocks'
import { firstValueFrom, of, throwError } from 'rxjs'
import { beforeEach, describe, it, vi } from 'vitest'
import { WorkersService } from './workers.service'

describe('Workers', () => {
	let service: WorkersService

	beforeEach(() => {
		vi.clearAllMocks() // clear all mocks before tests

		TestBed.configureTestingModule({
			providers: [{ provide: WorkersApi, useValue: mockWorkers }],
		})

		service = TestBed.inject(WorkersService)
	})

	describe('loadWorkers()', () => {
		it('should return all workers and update signals', async () => {
			// Two workers with different types to specialties computed signals
			const worker1 = makeWorker({
				id: 'w-1',
				specialty: WorkerSpecialty.BEAUTICIAN,
			})
			const worker2 = makeWorker({
				id: 'w-2',
				specialty: WorkerSpecialty.ESTHETICS,
			})

			// findAll returns Worker[] directly
			mockWorkers.findAll.mockReturnValue(of([worker1, worker2]))

			const result = await firstValueFrom(service.loadWorkers())

			// return value
			expect(result).toEqual([worker1, worker2])
			expect(mockWorkers.findAll).toHaveBeenCalledOnce()

			// signals updated by tap() inside loadWorkers()
			expect(service.workers()).toEqual([worker1, worker2])
			expect(service.loading()).toBe(false)
			expect(service.error()).toBeNull()

			// computed signals derived from workers() — filter by type
			expect(service.hasWorkers()).toBe(true)
		})
		it('should clear previous error before a new request', async () => {
			// simulate a previous error already set on the signal
			service.error.set('Previous error')
			mockWorkers.findAll.mockReturnValue(of([]))

			await firstValueFrom(service.loadWorkers())

			// loadWorkers() calls this.error.set(null) before the request
			expect(service.error()).toBeNull()
		})
		it('should set error signal and reset loading when API fails', async () => {
			const apiError = new Error('Network error')

			// throwError() creates an Observable that immediately errors instead of emitting
			mockWorkers.findAll.mockReturnValue(throwError(() => apiError))

			// firstValueFrom rejects because the observable errored
			await expect(firstValueFrom(service.loadWorkers())).rejects.toThrow(
				'Network error',
			)

			// tap({ error }) inside loadWorkers() handles this and updates signals
			expect(service.loading()).toBe(false)
			expect(service.error()).toBe('Network error')
			expect(service.workers()).toEqual([])
		})
		it('should fall back to default error message when err.message is missing', async () => {
			// error object without a message property
			mockWorkers.findAll.mockReturnValue(
				throwError(() => ({ message: undefined })),
			)

			await expect(firstValueFrom(service.loadWorkers())).rejects.toBeDefined()

			// service falls back to a hardcoded string when err.message is falsy
			expect(service.error()).toBe('Failed to load workers')
		})
	})
})
