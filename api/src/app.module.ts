import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { SupabaseStrategy } from './common/strategies/supabase.strategy'
import { ServiceModule } from './modules/service/service.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PassportModule,
		PrismaModule,
		ServiceModule,
	],
	controllers: [],
	providers: [SupabaseStrategy],
})
export class AppModule {}
