import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'
import { ServiceCategory } from 'src/generated/prisma/enums'

export class UpdateServiceDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	name?: string

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	description?: string

	@IsInt()
	@Min(0)
	@IsOptional()
	@ApiProperty()
	price?: number

	@IsInt()
	@Min(1)
	@IsOptional()
	@ApiProperty()
	duration?: number

	@IsEnum(ServiceCategory)
	@IsOptional()
	@ApiProperty({ enum: ServiceCategory })
	category?: ServiceCategory

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	featured?: boolean
}
