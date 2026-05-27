import { vi } from 'vitest'

export const mockWorkers = {
	findAll: vi.fn(),
}

export const mockBookings = {
	create: vi.fn(),
}

export const mockServices = {
	findAll: vi.fn(),
	findFeatured: vi.fn(),
}
