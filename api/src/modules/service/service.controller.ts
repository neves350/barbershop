import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentWorker } from 'src/common/decorators/current-worker.decorator'
import {
	ApiCreateServiceResponses,
	ApiDeleteServiceResponses,
	ApiFindAllResponses,
	ApiFindFeaturedResponses,
	ApiFindOneResponses,
	ApiUpdateServiceResponses,
} from 'src/common/decorators/service.decorator'
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard'
import { CreateServiceDto } from './dtos/create-service.dto'
import { QueryServiceDto } from './dtos/query-service.dto'
import { UpdateServiceDto } from './dtos/update-service.dto'
import { ServiceService } from './service.service'

@ApiTags('Services')
@Controller('')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@UseGuards(SupabaseAuthGuard)
	@Post('services')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Creates a new service' })
	@ApiCreateServiceResponses()
	async create(@Body() dto: CreateServiceDto, @CurrentWorker() worker) {
		const service = await this.serviceService.create(dto, worker.supabaseId)

		return {
			service,
			message: 'Service created successfull',
		}
	}

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

	@UseGuards(SupabaseAuthGuard)
	@Get('services/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Return a specific service' })
	@ApiFindOneResponses()
	async findOne(@Param('id') id: string, @CurrentWorker() worker) {
		return this.serviceService.findOne(id, worker.supabaseId)
	}

	@UseGuards(SupabaseAuthGuard)
	@Patch('services/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a service by id' })
	@ApiUpdateServiceResponses()
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateServiceDto,
		@CurrentWorker() worker,
	) {
		return this.serviceService.update(dto, id, worker.supabaseId)
	}

	@UseGuards(SupabaseAuthGuard)
	@Delete('services/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a service by id' })
	@ApiDeleteServiceResponses()
	async delete(@Param('id') id: string, @CurrentWorker() worker) {
		return this.serviceService.delete(id, worker.supabaseId)
	}
}
