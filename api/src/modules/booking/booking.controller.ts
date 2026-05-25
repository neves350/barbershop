import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard'
import { BookingService } from './booking.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { QueryBookingDto } from './dto/query-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'

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

	@UseGuards(SupabaseAuthGuard)
	@Get('bookings/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Return a specific booking' })
	async findOne(@Param('id') id: string) {
		return this.bookingService.findOne(id)
	}

	@UseGuards(SupabaseAuthGuard)
	@Patch('bookings/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a booking' })
	async update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
		const booking = await this.bookingService.update(id, dto)

		return {
			booking,
			message: 'Booking updated successfully',
		}
	}

	@UseGuards(SupabaseAuthGuard)
	@Delete('bookings/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a booking' })
	async delete(@Param('id') id: string) {
		return this.bookingService.delete(id)
	}
}
