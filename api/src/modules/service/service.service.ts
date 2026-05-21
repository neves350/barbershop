import { Injectable } from '@nestjs/common'
import { ServiceCategory } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateServiceDto } from './dtos/create-service.dto'

@Injectable()
export class ServiceService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateServiceDto, supabaseId: string) {
		const worker = await this.prisma.worker.findUniqueOrThrow({
			where: { supabaseId },
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
}
