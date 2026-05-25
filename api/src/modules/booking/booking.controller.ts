import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BookingService } from './booking.service'
import { CreateBookingDto } from './dto/create-booking.dto'

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
}
