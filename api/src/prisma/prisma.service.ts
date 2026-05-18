import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL as string,
		})
		super({ adapter })
	}

	async onModuleInit() {
		try {
			await this.$connect()
			console.log('✅ Connected to Neon database')
		} catch (error) {
			console.error('❌ Failed to connect to database:', error)
			throw error
		}
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
