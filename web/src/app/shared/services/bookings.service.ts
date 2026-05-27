import { Injectable, inject, signal } from '@angular/core'
import { BookingsApi } from '@core/api/bookings.api'
import { Booking, CreateBookingRequest } from '@core/models/booking.model'
import { map, Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class BookingsService {
	private readonly bookingsApi = inject(BookingsApi)

	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	create(data: CreateBookingRequest): Observable<Booking> {
		this.loading.set(true)

		return this.bookingsApi.create(data).pipe(
			map((response) => response.booking),
			tap({
				next: () => this.loading.set(false),
				error: (error) => {
					this.error.set(error.message || 'Failed to create booking')
					this.loading.set(false)
				},
			}),
		)
	}
}
