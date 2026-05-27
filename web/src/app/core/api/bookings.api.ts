import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '../../../environments/environment.development'
import {
	CreateBookingRequest,
	CreateBookingResponse,
} from '../models/booking.model'

@Injectable({
	providedIn: 'root',
})
export class BookingsApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/bookings`

	create(data: CreateBookingRequest) {
		return this.http.post<CreateBookingResponse>(`${this.baseUrl}`, data)
	}
}
