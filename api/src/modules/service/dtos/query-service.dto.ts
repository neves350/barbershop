import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { ServiceCategory } from 'src/generated/prisma/enums'

export class QueryServiceDto {
	@IsOptional()
	@IsEnum(ServiceCategory)
	@ApiPropertyOptional({ enum: ServiceCategory })
	category?: ServiceCategory
}
