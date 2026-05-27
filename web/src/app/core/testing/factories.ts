import { Booking } from '@core/models/booking.model'
import { Worker, WorkerSpecialty } from '@core/models/worker.model'

export function makeWorker(overrides: Partial<Worker>): Worker {
	return {
		id: 'worker-1',
		name: 'Worker 1',
		specialty: WorkerSpecialty.BEAUTICIAN,
		avatarUrl: 'https://github.com/neves350',
		...overrides,
	}
}

export function makeBooking(overrides: Partial<Booking>): Booking {
	return {
		id: 'booking-1',
		customerName: 'Client 1',
		customerPhone: '910200300',
		date: new Date(),
		serviceId: 's-1',
		...overrides,
	}
}
