import { signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Service } from '@core/models/service.model'
import { makeService } from '@core/testing/factories'
import { ServicesService } from '@shared/services/services.service'
import { of } from 'rxjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Services } from './services'

const mockServicesService = {
	services: signal<Service[]>([]),
	loading: signal<boolean>(false),
	loadFeatured: vi.fn(),
}

describe('HomeServices', () => {
	let component: Services
	let fixture: ComponentFixture<Services>

	beforeEach(async () => {
		vi.clearAllMocks()
		mockServicesService.services.set([])
		mockServicesService.loading.set(false)
		mockServicesService.loadFeatured.mockReturnValue(of([]))

		await TestBed.configureTestingModule({
			imports: [Services],
			providers: [{ provide: ServicesService, useValue: mockServicesService }],
		}).compileComponents()

		fixture = TestBed.createComponent(Services)
		component = fixture.componentInstance
		fixture.detectChanges()
		await fixture.whenStable()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('should call loadFeatured on init', () => {
		expect(mockServicesService.loadFeatured).toHaveBeenCalledOnce()
	})

	describe('loading state', () => {
		it('should show 4 skeleton cards while loading', () => {
			mockServicesService.loading.set(true)
			fixture.detectChanges()

			const skeletons = fixture.nativeElement.querySelectorAll('.animate-pulse')
			expect(skeletons).toHaveLength(4)
		})
		it('should hide skeletons when not loading', () => {
			mockServicesService.loading.set(false)
			fixture.detectChanges()

			const skeletons = fixture.nativeElement.querySelectorAll('.animate-pulse')
			expect(skeletons).toHaveLength(0)
		})
	})

	describe('service cards', () => {
		it('should render one card per service', () => {
			mockServicesService.services.set([
				makeService({ id: 's-1' }),
				makeService({ id: 's-2' }),
				makeService({ id: 's-3' }),
			])
			fixture.detectChanges()

			const cards = fixture.nativeElement.querySelectorAll('article')
			expect(cards).toHaveLength(3)
		})
		it('should display the service name', () => {
			mockServicesService.services.set([makeService({ id: 's-1', name: 'Corte Clássico' })])
			fixture.detectChanges()

			expect(fixture.nativeElement.querySelector('article').textContent).toContain('Corte Clássico')
		})
		it('should display the service price with euro sign', () => {
			mockServicesService.services.set([makeService({ id: 's-1', price: 25 })])
			fixture.detectChanges()

			expect(fixture.nativeElement.querySelector('article').textContent).toContain('€25')
		})
		it('should display the service duration in minutes', () => {
			mockServicesService.services.set([makeService({ id: 's-1', duration: 45 })])
			fixture.detectChanges()

			expect(fixture.nativeElement.querySelector('article').textContent).toContain('45 min')
		})
		it('should display the service description', () => {
			mockServicesService.services.set([makeService({ id: 's-1', description: 'A great haircut service' })])
			fixture.detectChanges()

			expect(fixture.nativeElement.querySelector('article').textContent).toContain('A great haircut service')
		})
	})
})
