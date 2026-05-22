import { Injectable, NotFoundException } from '@nestjs/common'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateWorkerDto } from './dtos/create-worker.dto'

@Injectable()
export class WorkerService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly supabase: SupabaseService,
	) {}

	async create(dto: CreateWorkerDto) {
		const user = await this.supabase.getUserById(dto.supabaseId)
		if (!user) throw new NotFoundException('Supabase user not found')

		return this.prisma.worker.create({
			data: dto,
		})
	}
}
