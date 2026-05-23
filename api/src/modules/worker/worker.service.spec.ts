import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockPrisma } from 'src/__mocks__/prisma.mock'
import { mockSupabase } from 'src/__mocks__/supabase.mock'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { WorkerSpecialty } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { WorkerService } from './worker.service'

describe('WorkerService', () => {
	let service: WorkerService

	beforeEach(async () => {
		jest.clearAllMocks() // clear all the history

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WorkerService,
				{ provide: PrismaService, useValue: mockPrisma },
				{ provide: SupabaseService, useValue: mockSupabase },
			],
		}).compile()

		service = module.get<WorkerService>(WorkerService)
	})

	describe('create', () => {
		it('should throw NotFoundException if supabase user not found', async () => {
			mockSupabase.getUserById.mockResolvedValue(null)

			await expect(
				service.create({
					name: 'Worker 1',
					specialty: WorkerSpecialty.BEAUTICIAN,
					avatarUrl: 'image.png',
					active: true,
					supabaseId: 'invalid-supabase-id',
				}),
			).rejects.toThrow(NotFoundException)
		})
		it('should throw ConflictException if worker already exists', async () => {
			mockSupabase.getUserById.mockResolvedValue({ id: 'supabase-id' })
			mockPrisma.worker.findUnique.mockResolvedValue({ id: 'worker-id' })

			await expect(
				service.create({
					name: 'Worker 1',
					specialty: WorkerSpecialty.BEAUTICIAN,
					avatarUrl: 'image.png',
					active: true,
					supabaseId: 'supabase-id',
				}),
			).rejects.toThrow(ConflictException)
		})
		it('should create a worker', async () => {
			mockSupabase.getUserById.mockResolvedValue({ id: 'supabase-id' })
			mockPrisma.worker.findUnique.mockResolvedValue(null)
			mockPrisma.worker.create.mockResolvedValue({
				id: 'worker-id',
				name: 'Worker 1',
				specialty: 'BEAUTICIAN',
				avatarUrl: 'image.png',
				active: true,
				supabaseId: 'supabase-id',
			})

			const result = await service.create({
				name: 'Worker 1',
				specialty: WorkerSpecialty.BEAUTICIAN,
				avatarUrl: 'image.png',
				active: true,
				supabaseId: 'supabase-id',
			})

			expect(result).toHaveProperty('id')
		})
	})

	describe('findAll', () => {
		it('should return all workers', async () => {
			mockPrisma.worker.findMany.mockResolvedValue([
				{
					id: 'worker-id',
					name: 'Worker 1',
					specialty: 'BEAUTICIAN',
					avatarUrl: 'image.png',
					active: true,
					supabaseId: 'supabase-id',
				},
			])

			const result = await service.findAll()

			expect(result).toHaveLength(1)
			expect(mockPrisma.worker.findMany).toHaveBeenCalledWith({ where: {} })
		})
		it('should return workers filtered by specialty', async () => {
			mockPrisma.worker.findMany.mockResolvedValue([
				{
					id: 'worker-id',
					name: 'Worker 1',
					specialty: 'BEAUTICIAN',
					avatarUrl: 'image.png',
					active: true,
					supabaseId: 'supabase-id',
				},
			])

			const result = await service.findAll(WorkerSpecialty.BEAUTICIAN)

			expect(result).toHaveLength(1)
			expect(mockPrisma.worker.findMany).toHaveBeenCalledWith({
				where: { specialty: WorkerSpecialty.BEAUTICIAN },
			})
		})
		it('should return empty array if no workers found', async () => {
			mockPrisma.worker.findMany.mockResolvedValue([])

			const result = await service.findAll()

			expect(result).toHaveLength(0)
		})
	})

	describe('findOne', () => {
		it('should return a worker', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue({
				id: 'worker-id',
			})

			const result = await service.findOne('id')

			expect(result).toHaveProperty('id')
		})
		it('should throw if worker not found', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue(null)

			await expect(service.findOne('invalid-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})

	describe('update', () => {
		it('should update a worker', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue({
				id: 'worker-id',
				name: 'Worker 1',
			})

			mockPrisma.worker.update.mockResolvedValue({
				id: 'worker-id',
				name: 'Updated Worker',
			})

			const result = await service.update(
				{
					name: 'Updated Worker',
				},
				'worker-id',
			)

			expect(result).toHaveProperty('name')
			expect(result.name).toBe('Updated Worker')
		})
		it('should throw if worker not found', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue(null)

			await expect(
				service.update({ name: 'Updated Worker' }, 'invalid-id'),
			).rejects.toThrow(NotFoundException)
		})
	})

	describe('delete', () => {
		it('should delete a worker', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue({
				id: 'worker-id',
				name: 'Worker 1',
			})

			mockPrisma.worker.delete.mockResolvedValue({
				id: 'worker-id',
			})

			const result = await service.delete('worker-id')

			expect(result).toHaveProperty('message')
			expect(result).toHaveProperty('success', true)
		})
		it('should throw if worker not found', async () => {
			mockPrisma.worker.findFirst.mockResolvedValue(null)

			await expect(service.delete('invalid-id')).rejects.toThrow(
				NotFoundException,
			)
		})
	})
})
