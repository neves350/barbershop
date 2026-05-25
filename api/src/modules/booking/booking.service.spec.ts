import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockPrisma } from 'src/__mocks__/prisma.mock'
import { BookingStatus } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { BookingService } from './booking.service'

describe('BookingService', () => {
	let service: BookingService

	beforeEach(async () => {
		jest.clearAllMocks()

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{ provide: PrismaService, useValue: mockPrisma },
			],
		}).compile()

		service = module.get<BookingService>(BookingService)
	})

	describe('create', () => {
		const dto = {
			clientName: 'Client 1',
			phone: '123456789',
			date: new Date('2026-01-30T10:00:00.000Z'),
			serviceIds: ['service-1', 'service-2'],
		}

		it('should create a booking and return it', async () => {
			const mockResult = {
				id: 'booking-id',
				...dto,
				status: BookingStatus.PENDING,
				services: [],
				worker: null,
			}
			mockPrisma.booking.create.mockResolvedValue(mockResult)

			const result = await service.create(dto)

			expect(result).toEqual(mockResult)
		})
		it('should call prisma with PENDING status', async () => {
			mockPrisma.booking.create.mockResolvedValue({})

			await service.create(dto)

			expect(mockPrisma.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({ status: BookingStatus.PENDING }),
				}),
			)
		})
		it('should map serviceIds to services.create entries', async () => {
			mockPrisma.booking.create.mockResolvedValue({})

			await service.create(dto)

			expect(mockPrisma.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						services: {
							create: [{ serviceId: 'service-1' }, { serviceId: 'service-2' }],
						},
					}),
				}),
			)
		})
		it('should not pass serviceIds directly into booking data', async () => {
			mockPrisma.booking.create.mockResolvedValue({})

			await service.create(dto)

			expect(mockPrisma.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.not.objectContaining({ serviceIds: expect.anything() }),
				}),
			)
		})
		it('should include services and worker in the query', async () => {
			mockPrisma.booking.create.mockResolvedValue({})

			await service.create(dto)

			expect(mockPrisma.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					include: {
						services: { include: { service: true } },
						worker: true,
					},
				}),
			)
		})
	})

	describe('findAll', () => {
		const mockBookings = [{ id: 'booking-1' }, { id: 'booking-2' }]

		it('should return all bookings when no filters provided', async () => {
			mockPrisma.booking.findMany.mockResolvedValue(mockBookings)

			const result = await service.findAll({})

			expect(result).toEqual(mockBookings)
		})
		it('should call prisma with correct include and orderBy', async () => {
			mockPrisma.booking.findMany.mockResolvedValue(mockBookings)

			await service.findAll({})

			expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					include: { services: { include: { service: true } }, worker: true },
					orderBy: { date: 'asc' },
				}),
			)
		})
		it('should filter by workerId when provided', async () => {
			mockPrisma.booking.findMany.mockResolvedValue(mockBookings)

			await service.findAll({ workerId: 'worker-1' })

			expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({ workerId: 'worker-1' }),
				}),
			)
		})
		it('should filter by serviceId when provided', async () => {
			mockPrisma.booking.findMany.mockResolvedValue(mockBookings)

			await service.findAll({ serviceId: 'service-1' })

			expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						services: { some: { serviceId: 'service-1' } },
					}),
				}),
			)
		})
		it('should filter by date range when date provided', async () => {
			mockPrisma.booking.findMany.mockResolvedValue(mockBookings)
			const date = new Date('2026-01-30')

			await service.findAll({ date })

			expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						date: expect.objectContaining({
							gte: expect.any(Date),
							lte: expect.any(Date),
						}),
					}),
				}),
			)
		})
		it('should throw NotFoundException when no bookings found with no filters', async () => {
			mockPrisma.booking.findMany.mockResolvedValue([])

			await expect(service.findAll({})).rejects.toThrow('No bookings found')
		})
		it('should throw NotFoundException with worker message when no bookings found by workerId', async () => {
			mockPrisma.booking.findMany.mockResolvedValue([])

			await expect(service.findAll({ workerId: 'worker-1' })).rejects.toThrow(
				'This worker does not have any bookings',
			)
		})
		it('should throw NotFoundException with service message when no bookings found by serviceId', async () => {
			mockPrisma.booking.findMany.mockResolvedValue([])

			await expect(service.findAll({ serviceId: 'service-1' })).rejects.toThrow(
				'This service does not have any bookings',
			)
		})
		it('should throw NotFoundException with date message when no bookings found by date', async () => {
			mockPrisma.booking.findMany.mockResolvedValue([])

			await expect(
				service.findAll({ date: new Date('2026-01-30') }),
			).rejects.toThrow('No bookings found on this date')
		})
	})

	describe('findOne', () => {
		it('should return a booking', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue({ id: 'booking-id' })

			const result = await service.findOne('id')

			expect(result).toHaveProperty('id')
		})
		it('should call prisma with correct include', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue({ id: 'booking-id' })

			await service.findOne('id')

			expect(mockPrisma.booking.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					include: { services: { include: { service: true } }, worker: true },
				}),
			)
		})
		it('should throw if booking not found', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue(null)

			await expect(service.findOne('invalid-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})

	describe('update', () => {
		it('should update a booking', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue({
				id: 'booking-id',
			})

			mockPrisma.booking.update.mockResolvedValue({
				id: 'booking-id',
				workerId: 'w2-id',
			})

			const result = await service.update('id', {
				workerId: 'w2-id',
			})

			expect(result).toHaveProperty('workerId')
			expect(result.workerId).toBe('w2-id')
		})
		it('should call prisma.update with correct include', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue({ id: 'booking-id' })
			mockPrisma.booking.update.mockResolvedValue({})

			await service.update('id', { workerId: 'w2-id' })

			expect(mockPrisma.booking.update).toHaveBeenCalledWith(
				expect.objectContaining({
					include: { services: { include: { service: true } }, worker: true },
				}),
			)
		})
		it('should throw if booking not found', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue(null)

			await expect(
				service.update('invalid-id', { workerId: 'w2-id' }),
			).rejects.toThrow(NotFoundException)
		})
	})

	describe('delete', () => {
		it('should delete a booking', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue({
				id: 'booking-id',
			})

			mockPrisma.booking.delete.mockResolvedValue({
				id: 'booking-id',
			})

			const result = await service.delete('booking-id')

			expect(result).toHaveProperty('message')
			expect(result).toHaveProperty('success', true)
		})
		it('should throw if booking not found', async () => {
			mockPrisma.booking.findFirst.mockResolvedValue(null)

			await expect(service.delete('invalid-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})
})
