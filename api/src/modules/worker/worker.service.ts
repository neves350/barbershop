import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { WorkerSpecialty } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateWorkerDto } from './dtos/create-worker.dto'
import { UpdateWorkerDto } from './dtos/update-worker.dto'

@Injectable()
export class WorkerService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly supabase: SupabaseService,
	) {}

	async create(dto: CreateWorkerDto) {
		const user = await this.supabase.getUserById(dto.supabaseId)
		if (!user) throw new NotFoundException('Supabase user not found')

		const existing = await this.prisma.worker.findUnique({
			where: {
				supabaseId: dto.supabaseId,
			},
		})

		if (existing)
			throw new ConflictException(
				'A worker for this Supabase user already exists',
			)

		return this.prisma.worker.create({
			data: dto,
		})
	}

	async findAll(specialty?: WorkerSpecialty) {
		return this.prisma.worker.findMany({
			where: {
				...(specialty && { specialty }),
			},
		})
	}

	async findOne(workerId: string) {
		const worker = await this.prisma.worker.findFirst({
			where: {
				id: workerId,
			},
		})

		if (!worker) throw new NotFoundException('Worker not found')

		return worker
	}

	async update(dto: UpdateWorkerDto, workerId: string) {
		const { name, specialty, avatarUrl, active } = dto

		const worker = await this.prisma.worker.findFirst({
			where: {
				id: workerId,
			},
		})

		if (!worker) throw new NotFoundException('Worker not found')

		const updatedWorker = await this.prisma.worker.update({
			where: {
				id: workerId,
			},
			data: {
				name,
				specialty,
				avatarUrl,
				active,
			},
		})

		return updatedWorker
	}

	async delete(workerId: string) {
		const worker = await this.prisma.worker.findFirst({
			where: {
				id: workerId,
			},
		})

		if (!worker) throw new NotFoundException('Worker not found')

		await this.prisma.worker.delete({
			where: {
				id: workerId,
			},
		})

		return {
			message: 'Worker deleted successfully',
			success: true,
		}
	}
}
