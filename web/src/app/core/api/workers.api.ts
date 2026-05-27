import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '../../../environments/environment.development'
import { Worker } from '../models/worker.model'

@Injectable({
	providedIn: 'root',
})
export class WorkersApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/workers`

	findAll() {
		return this.http.get<Worker[]>(`${this.baseUrl}`)
	}
}
