import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard'
import { BookingService } from './booking.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { QueryBookingDto } from './dto/query-booking.dto'

@ApiTags('Bookings')
@Controller('')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post('bookings')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Creates a new booking' })
	async create(@Body() dto: CreateBookingDto) {
		const booking = await this.bookingService.create(dto)

		return {
			booking,
			message: 'Booking created successfull',
		}
	}

	@UseGuards(SupabaseAuthGuard)
	@Get('bookings')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Return all bookings' })
	async findAll(@Query() query: QueryBookingDto) {
		return this.bookingService.findAll(query)
	}
}
