import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockPrisma } from 'src/__mocks__/prisma.mock'
import { ServiceCategory } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { ServiceService } from './service.service'

describe('ServiceService', () => {
	let service: ServiceService

	beforeEach(async () => {
		jest.clearAllMocks() // clear all the history

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ServiceService,
				{ provide: PrismaService, useValue: mockPrisma },
			],
		}).compile()

		service = module.get<ServiceService>(ServiceService)
	})

	describe('create', () => {
		it('should throw NotFoundException if worker not found', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockRejectedValue(new Error())

			await expect(
				service.create(
					{
						name: 'Service 1',
						description: 'Description 1',
						price: 10,
						duration: 30,
						category: ServiceCategory.HAIR,
					},
					'invalid-worker-id',
				),
			).rejects.toThrow(NotFoundException)
		})
		it('should create a service', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockResolvedValue({
				supabaseId: 'worker-id',
			})

			mockPrisma.service.create.mockResolvedValue({
				id: 'service-id',
				name: 'Service 1',
				description: 'Description 1',
				price: 10,
				duration: 30,
				category: 'HAIR',
				workerId: 'worker-id',
			})

			const result = await service.create(
				{
					name: 'Service 1',
					description: 'Description 1',
					price: 10,
					duration: 30,
					category: ServiceCategory.HAIR,
				},
				'worker-id',
			)

			expect(result).toHaveProperty('id')
		})
	})

	describe('findAll', () => {
		it('should find all categories', async () => {
			mockPrisma.service.findMany.mockResolvedValue([
				{
					id: 'service-id',
					name: 'Service 1',
					description: 'Description 1',
					price: 10,
					duration: 30,
					category: 'HAIR',
					workerId: 'worker-id',
				},
			])

			const result = await service.findAll()

			expect(result).toHaveLength(1)
			expect(result[0]).toHaveProperty('category', 'HAIR')
		})
	})

	describe('findFeatured', () => {
		it('should return featured services', async () => {
			mockPrisma.service.findMany.mockResolvedValue([
				{ id: '1', name: 'Service 1', featured: true, active: true },
				{ id: '2', name: 'Service 2', featured: true, active: true },
			])

			const result = await service.findFeatured()

			expect(result).toHaveLength(2)
			expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
				where: { featured: true, active: true },
				take: 4,
			})
		})
		it('should return empty array if no featured services', async () => {
			mockPrisma.service.findMany.mockResolvedValue([])

			const result = await service.findFeatured()

			expect(result).toHaveLength(0)
		})
	})

	describe('findOne', () => {
		it('should throw NotFoundException if worker not found', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockRejectedValue(new Error())

			await expect(service.findOne('id', 'invalid-worker-id')).rejects.toThrow(
				NotFoundException,
			)
		})
		it('should return a service', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockResolvedValue({
				supabaseId: 'worker-id',
			})

			mockPrisma.service.findFirst.mockResolvedValue({
				id: 'service-id',
				workerId: 'worker-id',
			})

			const result = await service.findOne('id', 'worker-id')

			expect(result).toHaveProperty('id')
		})
		it('should throw if service not found', async () => {
			mockPrisma.service.findFirst.mockResolvedValue(null)

			await expect(service.findOne('invalid-id', 'worker-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})

	describe('update', () => {
		it('should throw NotFoundException if worker not found', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockRejectedValue(new Error())

			await expect(
				service.update(
					{
						name: 'Updated Service',
					},
					'service-id',
					'invalid-worker-id',
				),
			).rejects.toThrow(NotFoundException)
		})
		it('should update a service', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockResolvedValue({
				supabaseId: 'worker-id',
			})

			mockPrisma.service.findFirst.mockResolvedValue({
				id: 'service-id',
				name: 'Service 1',
				workerId: 'worker-id',
			})

			mockPrisma.service.update.mockResolvedValue({
				id: 'service-id',
				name: 'Updated Service',
				workerId: 'worker-id',
			})

			const result = await service.update(
				{
					name: 'Updated Service',
				},
				'service-id',
				'worker-id',
			)

			expect(result).toHaveProperty('name')
			expect(result.name).toBe('Updated Service')
		})
		it('should throw if service not found', async () => {
			mockPrisma.service.findFirst.mockResolvedValue(null)

			await expect(
				service.update({ name: 'Updated Service' }, 'invalid-id', 'worker-id'),
			).rejects.toThrow(NotFoundException)
		})
	})

	describe('delete', () => {
		it('should throw NotFoundException if worker not found', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockRejectedValue(new Error())

			await expect(
				service.delete('service-id', 'invalid-worker-id'),
			).rejects.toThrow(NotFoundException)
		})
		it('should delete a service', async () => {
			mockPrisma.worker.findUniqueOrThrow.mockResolvedValue({
				supabaseId: 'worker-id',
			})

			mockPrisma.service.findFirst.mockResolvedValue({
				id: 'service-id',
				name: 'Service 1',
				workerId: 'worker-id',
			})

			mockPrisma.service.delete.mockResolvedValue({
				id: 'service-id',
				workerId: 'worker-id',
			})

			const result = await service.delete('service-id', 'worker-id')

			expect(result).toHaveProperty('message')
			expect(result).toHaveProperty('success', true)
		})
		it('should throw if service not found', async () => {
			mockPrisma.service.findFirst.mockResolvedValue(null)

			await expect(service.delete('invalid-id', 'worker-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})
})
