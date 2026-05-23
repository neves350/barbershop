import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { WorkerSpecialty } from 'src/generated/prisma/client'

export class UpdateWorkerDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	name?: string

	@IsEnum(WorkerSpecialty)
	@IsOptional()
	@ApiPropertyOptional({ enum: WorkerSpecialty })
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
	@IsOptional()
	@ApiPropertyOptional()
	supabaseId?: string
}
