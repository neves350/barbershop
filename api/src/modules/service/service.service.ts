import { Injectable, NotFoundException } from '@nestjs/common'
import { ServiceCategory } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateServiceDto } from './dtos/create-service.dto'
import { UpdateServiceDto } from './dtos/update-service.dto'

@Injectable()
export class ServiceService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateServiceDto, supabaseId: string) {
		const worker = await this.prisma.worker
			.findUniqueOrThrow({
				where: { supabaseId },
			})
			.catch(() => {
				throw new NotFoundException('Worker not found')
			})

		return this.prisma.service.create({
			data: { ...dto, workerId: worker.id },
		})
	}

	async findAll(category?: ServiceCategory) {
		return this.prisma.service.findMany({
			where: {
				...(category && { category }),
			},
		})
	}

	async findFeatured() {
		return this.prisma.service.findMany({
			where: { featured: true, active: true },
			take: 4,
		})
	}

	async findOne(serviceId: string, supabaseId: string) {
		const worker = await this.prisma.worker
			.findUniqueOrThrow({
				where: { supabaseId },
			})
			.catch(() => {
				throw new NotFoundException('Worker not found')
			})

		const service = await this.prisma.service.findFirst({
			where: {
				id: serviceId,
				workerId: worker.id,
			},
		})

		if (!service) throw new NotFoundException('Service not found')

		return service
	}

	async update(dto: UpdateServiceDto, serviceId: string, supabaseId: string) {
		const worker = await this.prisma.worker
			.findUniqueOrThrow({
				where: { supabaseId },
			})
			.catch(() => {
				throw new NotFoundException('Worker not found')
			})

		const service = await this.prisma.service.findFirst({
			where: {
				id: serviceId,
				workerId: worker.id,
			},
		})

		if (!service) throw new NotFoundException('Service not found')

		const updatedService = await this.prisma.service.update({
			where: {
				id: serviceId,
			},
			data: dto,
		})

		return updatedService
	}

	async delete(serviceId: string, supabaseId: string) {
		const worker = await this.prisma.worker
			.findUniqueOrThrow({
				where: { supabaseId },
			})
			.catch(() => {
				throw new NotFoundException('Worker not found')
			})

		const service = await this.prisma.service.findFirst({
			where: {
				id: serviceId,
				workerId: worker.id,
			},
		})

		if (!service) throw new NotFoundException('Service not found')

		await this.prisma.service.delete({
			where: {
				id: serviceId,
				workerId: worker.id,
			},
		})

		return {
			message: 'Service deleted successfully',
			success: true,
		}
	}
}
