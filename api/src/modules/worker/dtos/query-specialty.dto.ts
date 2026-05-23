import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { WorkerSpecialty } from 'src/generated/prisma/enums'

export class QuerySpecialtyDto {
	@IsOptional()
	@IsEnum(WorkerSpecialty)
	@ApiPropertyOptional({ enum: WorkerSpecialty })
	specialty?: WorkerSpecialty
}
