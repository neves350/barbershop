import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator'
import { WorkerSpecialty } from 'src/generated/prisma/client'

export class UpdateWorkerDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name?: string

	@IsEnum(WorkerSpecialty)
	@IsNotEmpty()
	@ApiProperty({ enum: WorkerSpecialty })
	specialty?: WorkerSpecialty

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	avatarUrl?: string

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional({ default: true })
	active?: boolean

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	supabaseId?: string
}
