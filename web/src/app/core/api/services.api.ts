import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '../../../environments/environment.development'
import { Service, ServiceQueryParams } from '../models/service.model'

@Injectable({
	providedIn: 'root',
})
export class ServicesApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/services`

	findAll(params?: ServiceQueryParams) {
		return this.http.get<Service[]>(`${this.baseUrl}`, {
			params: params as Record<string, string> | undefined,
		})
	}

	findFeatured() {
		return this.http.get<Service[]>(`${this.baseUrl}/featured`)
	}
}
