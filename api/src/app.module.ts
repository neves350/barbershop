import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { ServiceModule } from './modules/service/service.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ServiceModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
