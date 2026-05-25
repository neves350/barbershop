import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreateBookingDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	clientName!: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	phone!: string

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	email?: string

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	notes?: string

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	source?: string

	@Type(() => Date)
	@IsDate()
	@ApiProperty({ example: '2026-01-30T10:00:00.000Z' })
	date!: Date

	@IsArray()
	@ArrayMinSize(1)
	@IsUUID('4', { each: true })
	@ApiProperty({ type: [String], description: 'Service IDs to book' })
	serviceIds!: string[]

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	workerId?: string
}
