import { computed, Injectable, inject, signal } from '@angular/core'
import { ServicesApi } from '@core/api/services.api'
import { Service, ServiceQueryParams } from '@core/models/service.model'
import { Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class ServicesService {
	private readonly servicesApi = inject(ServicesApi)

	readonly services = signal<Service[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	readonly hasServices = computed(() => this.services().length > 0)

	loadServices(params?: ServiceQueryParams): Observable<Service[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.servicesApi.findAll(params).pipe(
			tap({
				next: (response) => {
					this.services.set(response)
					this.loading.set(false)
				},
				error: (error) => {
					this.error.set(error.message || 'Failed to load services')
					this.loading.set(false)
				},
			}),
		)
	}

	loadFeatured(): Observable<Service[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.servicesApi.findFeatured().pipe(
			tap({
				next: (response) => {
					this.services.set(response)
					this.loading.set(false)
				},
				error: (error) => {
					this.error.set(error.message || 'Failed to load featured services')
					this.loading.set(false)
				},
			}),
		)
	}
}
