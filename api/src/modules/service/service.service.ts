import { Injectable } from '@nestjs/common'
import { ServiceCategory } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ServiceService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(category?: ServiceCategory) {
		return this.prisma.service.findMany({
			where: {
				...(category && { category }),
			},
		})
	}
}
