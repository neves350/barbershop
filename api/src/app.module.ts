import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { SupabaseStrategy } from './common/strategies/supabase.strategy'
import { ServiceModule } from './modules/service/service.module'
import { WorkerModule } from './modules/worker/worker.module'
import { PrismaModule } from './prisma/prisma.module'
import { SupabaseModule } from './common/supabase/supabase.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PassportModule,
		PrismaModule,
		SupabaseModule,
		ServiceModule,
		WorkerModule,
	],
	controllers: [],
	providers: [SupabaseStrategy],
})
export class AppModule {}
