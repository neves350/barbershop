import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard'
import { CreateWorkerDto } from './dtos/create-worker.dto'
import { QuerySpecialtyDto } from './dtos/query-specialty.dto'
import { WorkerService } from './worker.service'

@ApiTags('Workers')
@Controller('')
export class WorkerController {
	constructor(private readonly workerService: WorkerService) {}

	@UseGuards(SupabaseAuthGuard)
	@Post('workers')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Creates a new worker' })
	async create(@Body() dto: CreateWorkerDto) {
		const worker = await this.workerService.create(dto)

		return {
			worker,
			message: 'Worker created successfull',
		}
	}

	@Get('workers')
	@ApiOperation({ summary: 'Return all workers' })
	async findAll(@Query() query: QuerySpecialtyDto) {
		return this.workerService.findAll(query.specialty)
	}
}
