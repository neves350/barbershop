import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { BookingStatus } from 'src/generated/prisma/enums'

export class UpdateBookingDto {
	@IsEnum(BookingStatus)
	@IsOptional()
	@ApiPropertyOptional({ enum: BookingStatus })
	status?: BookingStatus

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	workerId?: string

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	@ApiPropertyOptional({ example: '2026-01-30T10:00:00.000Z' })
	date?: Date

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	notes?: string
}
