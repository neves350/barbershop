export interface CreateBookingDto {
	serviceId: string
	date: string
	customerName: string
	customerPhone: string
}

export interface Booking extends CreateBookingDto {
	id: string
}
