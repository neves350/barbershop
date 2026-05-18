import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from 'src/generated/prisma/client'
import { Services } from './services'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query'] })

async function seed() {
	// Create services list to the table
	for (const service of Services) {
		const { ...services } = service

		await prisma.service.create({
			data: {
				name: services.name,
				description: services.description,
				price: services.price,
				category: services.category,
				duration: services.duration,
			},
		})
	}
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
