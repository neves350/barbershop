export interface CreateBookingRequest {
	customerName: string
	customerPhone: string
	date: Date
	email?: string
	notes?: string
	serviceId: string
}

export interface Booking extends CreateBookingRequest {
	id: string
}

export interface CreateBookingResponse {
	booking: Booking
	message: string
}
