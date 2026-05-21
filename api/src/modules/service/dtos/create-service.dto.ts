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

export class CreateServiceDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name!: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description!: string

	@IsInt()
	@Min(0)
	@IsNotEmpty()
	@ApiProperty()
	price!: number

	@IsInt()
	@Min(1)
	@IsNotEmpty()
	@ApiProperty()
	duration!: number

	@IsEnum(ServiceCategory)
	@IsNotEmpty()
	@ApiProperty({ enum: ServiceCategory })
	category!: ServiceCategory

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	featured?: boolean
}
