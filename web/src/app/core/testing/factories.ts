import { Booking } from '@core/models/booking.model'
import { Service } from '@core/models/service.model'
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

export function makeService(overrides: Partial<Service>): Service {
	return {
		id: 'service-1',
		name: 'Service 1',
		description: 'Description of service 1.',
		duration: 30,
		price: 90,
		...overrides,
	}
}
