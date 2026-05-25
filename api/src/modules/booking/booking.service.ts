import { Injectable } from '@nestjs/common'
import { BookingStatus } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'

const bookingInclude = {
	services: { include: { service: true } },
	worker: true,
}

@Injectable()
export class BookingService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateBookingDto) {
		const { serviceIds, ...bookingData } = dto

		return this.prisma.booking.create({
			data: {
				...bookingData,
				status: BookingStatus.PENDING,
				services: {
					create: serviceIds.map((serviceId) => ({ serviceId })),
				},
			},
			include: bookingInclude,
		})
	}
}
