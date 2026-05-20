import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
	ApiFindAllResponses,
	ApiFindFeaturedResponses,
} from 'src/common/decorators/service.decorator'
import { QueryServiceDto } from './dtos/query-service.dto'
import { ServiceService } from './service.service'

@ApiTags('Services')
@Controller('')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Get('services')
	@ApiOperation({ summary: 'Return all services' })
	@ApiFindAllResponses()
	async findAll(@Query() query: QueryServiceDto) {
		return this.serviceService.findAll(query.category)
	}

	@Get('services/featured')
	@ApiOperation({ summary: 'Return up to 4 featured services' })
	@ApiFindFeaturedResponses()
	async findFeatured() {
		return this.serviceService.findFeatured()
	}
}
