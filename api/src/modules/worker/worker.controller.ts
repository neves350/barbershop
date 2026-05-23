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
import {
	ApiCreateWorkerResponses,
	ApiDeleteWorkerResponses,
	ApiFindAllWorkerResponses,
	ApiFindOneWorkerResponses,
	ApiUpdateWorkerResponses,
} from 'src/common/decorators/worker.decorator'
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard'
import { CreateWorkerDto } from './dtos/create-worker.dto'
import { QuerySpecialtyDto } from './dtos/query-specialty.dto'
import { UpdateWorkerDto } from './dtos/update-worker.dto'
import { WorkerService } from './worker.service'

@ApiTags('Workers')
@Controller('')
export class WorkerController {
	constructor(private readonly workerService: WorkerService) {}

	@UseGuards(SupabaseAuthGuard)
	@Post('workers')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Creates a new worker' })
	@ApiCreateWorkerResponses()
	async create(@Body() dto: CreateWorkerDto) {
		const worker = await this.workerService.create(dto)

		return {
			worker,
			message: 'Worker created successfull',
		}
	}

	@Get('workers')
	@ApiOperation({ summary: 'Return all workers' })
	@ApiFindAllWorkerResponses()
	async findAll(@Query() query: QuerySpecialtyDto) {
		return this.workerService.findAll(query.specialty)
	}

	@UseGuards(SupabaseAuthGuard)
	@Get('workers/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Return a specific worker' })
	@ApiFindOneWorkerResponses()
	async findOne(@Param('id') id: string) {
		return this.workerService.findOne(id)
	}

	@UseGuards(SupabaseAuthGuard)
	@Patch('workers/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a worker by id' })
	@ApiUpdateWorkerResponses()
	async update(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
		const worker = await this.workerService.update(dto, id)

		return {
			worker,
			message: 'Worker updated successfully',
		}
	}

	@UseGuards(SupabaseAuthGuard)
	@Delete('workers/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a worker by id' })
	@ApiDeleteWorkerResponses()
	async delete(@Param('id') id: string) {
		return this.workerService.delete(id)
	}
}
