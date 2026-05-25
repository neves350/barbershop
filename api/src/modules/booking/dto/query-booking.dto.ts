import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsUUID } from 'class-validator'

export class QueryBookingDto {
	@IsUUID('4')
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by worker ID' })
	workerId?: string

	@IsUUID('4')
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by service ID' })
	serviceId?: string

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	@ApiPropertyOptional({ example: '2026-05-30', description: 'Filter by day (all bookings on this date)' })
	date?: Date
}
