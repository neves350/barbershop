import { Injectable, NotFoundException } from '@nestjs/common'
import { BookingStatus } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { QueryBookingDto } from './dto/query-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'

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

	async findAll(query: QueryBookingDto) {
		const { workerId, serviceId, date } = query

		const dayStart = date ? new Date(date.setHours(0, 0, 0, 0)) : undefined
		const dayEnd = date ? new Date(date.setHours(23, 59, 59, 999)) : undefined

		const bookings = await this.prisma.booking.findMany({
			where: {
				...(workerId && { workerId }),
				...(serviceId && { services: { some: { serviceId } } }),
				...(date && { date: { gte: dayStart, lte: dayEnd } }),
			},
			include: bookingInclude,
			orderBy: { date: 'asc' },
		})

		if (!bookings.length) {
			if (workerId)
				throw new NotFoundException('This worker does not have any bookings')
			if (serviceId)
				throw new NotFoundException('This service does not have any bookings')
			if (date) throw new NotFoundException('No bookings found on this date')
			throw new NotFoundException('No bookings found')
		}

		return bookings
	}

	async findOne(id: string) {
		const booking = await this.prisma.booking.findFirst({
			where: {
				id,
			},
			include: bookingInclude,
		})

		if (!booking) throw new NotFoundException('Booking not found')

		return booking
	}

	async update(id: string, dto: UpdateBookingDto) {
		const booking = await this.prisma.booking.findFirst({
			where: {
				id,
			},
		})

		if (!booking) throw new NotFoundException('Booking not found')

		return this.prisma.booking.update({
			where: {
				id,
			},
			data: dto,
			include: bookingInclude,
		})
	}

	async delete(id: string) {
		const booking = await this.prisma.booking.findFirst({
			where: {
				id,
			},
		})

		if (!booking) throw new NotFoundException('Booking not found')

		await this.prisma.booking.delete({
			where: {
				id,
			},
		})

		return {
			message: 'Booking deleted successfully',
			success: true,
		}
	}
}
