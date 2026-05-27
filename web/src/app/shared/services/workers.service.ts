import { computed, Injectable, inject, signal } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { WorkersApi } from '../../core/api/workers.api'
import { Worker } from '../../core/models/worker.model'

@Injectable({
	providedIn: 'root',
})
export class WorkersService {
	private readonly workersApi = inject(WorkersApi)

	readonly workers = signal<Worker[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	readonly hasWorkers = computed(() => this.workers().length > 0)

	loadWorkers(): Observable<Worker[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.workersApi.findAll().pipe(
			tap({
				next: (response) => {
					this.workers.set(response)
					this.loading.set(false)
				},
				error: (error) => {
					this.error.set(error.message || 'Failed to load workers')
					this.loading.set(false)
				},
			}),
		)
	}
}
