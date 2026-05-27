import { HttpInterceptorFn } from '@angular/common/http'
import { environment } from '../../../environments/environment.development'

const API_URL = `${environment.apiUrl}`

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) =>
	next(req.clone({ url: `${API_URL}${req.url}` }))
