import { TestBed } from '@angular/core/testing'
import { ServicesApi } from '@core/api/services.api'
import { ServiceCategory } from '@core/models/service.model'
import { makeService } from '@core/testing/factories'
import { mockServices } from '@core/testing/mocks'
import { firstValueFrom, of, throwError } from 'rxjs'
import { beforeEach, describe, it, vi } from 'vitest'
import { ServicesService } from './services.service'

describe('ServicesService', () => {
	let service: ServicesService

	beforeEach(() => {
		vi.clearAllMocks() // clear all mocks before tests

		TestBed.configureTestingModule({
			providers: [{ provide: ServicesApi, useValue: mockServices }],
		})
		service = TestBed.inject(ServicesService)
	})

	describe('loadServices()', () => {
		it('should return all services and update signals', async () => {
			const service1 = makeService({
				id: 's-1',
				name: 'Service 1',
			})
			const service2 = makeService({
				id: 's-2',
				name: 'Service 2',
			})

			mockServices.findAll.mockReturnValue(of([service1, service2]))

			const result = await firstValueFrom(service.loadServices())

			expect(result).toEqual([service1, service2])
			expect(mockServices.findAll).toHaveBeenCalledOnce()

			expect(service.services()).toEqual([service1, service2])
			expect(service.loading()).toBe(false)
			expect(service.error()).toBeNull()

			expect(service.hasServices()).toBe(true)
		})
		it('should pass params to the API', async () => {
			const params = { category: ServiceCategory.HAIR }

			mockServices.findAll.mockReturnValue(of([]))

			await firstValueFrom(service.loadServices(params))

			expect(mockServices.findAll).toHaveBeenCalledWith(params)
		})
		it('should call the API without params when none provided', async () => {
			mockServices.findAll.mockReturnValue(of([]))

			await firstValueFrom(service.loadServices())

			expect(mockServices.findAll).toHaveBeenCalledWith(undefined)
		})
		it('should clear previous error before a new request', async () => {
			service.error.set('Previous error')
			mockServices.findAll.mockReturnValue(of([]))

			await firstValueFrom(service.loadServices())

			expect(service.error()).toBeNull()
		})
		it('should set error signal and reset loading when API fails', async () => {
			const apiError = new Error('Network error')

			mockServices.findAll.mockReturnValue(throwError(() => apiError))

			await expect(firstValueFrom(service.loadServices())).rejects.toThrow(
				'Network error',
			)

			expect(service.loading()).toBe(false)
			expect(service.error()).toBe('Network error')
			expect(service.services()).toEqual([])
		})
		it('should fall back to default error message when err.message is missing', async () => {
			mockServices.findAll.mockReturnValue(
				throwError(() => ({ message: undefined })),
			)

			await expect(firstValueFrom(service.loadServices())).rejects.toBeDefined()

			expect(service.error()).toBe('Failed to load services')
		})
	})

	describe('loadFeatured()', () => {
		it('should return featured services and update signals', async () => {
			const featured1 = makeService({
				id: 's-1',
				name: 'Service 1',
			})
			const featured2 = makeService({
				id: 's-2',
				name: 'Service 2',
			})

			mockServices.findFeatured.mockReturnValue(of([featured1, featured2]))

			const result = await firstValueFrom(service.loadFeatured())

			expect(result).toEqual([featured1, featured2])
			expect(mockServices.findFeatured).toHaveBeenCalledOnce()

			expect(service.services()).toEqual([featured1, featured2])
			expect(service.loading()).toBe(false)
			expect(service.error()).toBeNull()

			expect(service.hasServices()).toBe(true)
		})
		it('should clear previous error before a new request', async () => {
			service.error.set('Previous error')
			mockServices.findFeatured.mockReturnValue(of([]))

			await firstValueFrom(service.loadFeatured())

			expect(service.error()).toBeNull()
		})
		it('should set error signal and reset loading when API fails', async () => {
			const apiError = new Error('Network error')

			mockServices.findFeatured.mockReturnValue(throwError(() => apiError))

			await expect(firstValueFrom(service.loadFeatured())).rejects.toThrow(
				'Network error',
			)

			expect(service.loading()).toBe(false)
			expect(service.error()).toBe('Network error')
			expect(service.services()).toEqual([])
		})
		it('should fall back to default error message when err.message is missing', async () => {
			mockServices.findFeatured.mockReturnValue(
				throwError(() => ({ message: undefined })),
			)

			await expect(firstValueFrom(service.loadFeatured())).rejects.toBeDefined()

			expect(service.error()).toBe('Failed to load featured services')
		})
	})
})
