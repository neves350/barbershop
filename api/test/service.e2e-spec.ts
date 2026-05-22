import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { SupabaseAuthGuard } from '../src/common/guards/supabase-auth.guard'
import { PrismaService } from '../src/prisma/prisma.service'

const TEST_SUPABASE_ID = `e2e-worker-${Date.now()}`

describe('ServiceController (e2e)', () => {
	let app: INestApplication<App>
	let prisma: PrismaService
	let workerId: string
	let serviceId: string // shared across tests

	// boot the app, mocks auth, seeds a worker in the real database
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			// replace the real Supabase guard with a fake that always passes
			// and injects a worker identity into req.user
			.overrideGuard(SupabaseAuthGuard)
			.useValue({
				canActivate: (ctx) => {
					const req = ctx.switchToHttp().getRequest()
					req.user = { supabaseId: TEST_SUPABASE_ID }
					return true
				},
			})
			.compile()

		app = moduleFixture.createNestApplication()
		app.useGlobalPipes(new ValidationPipe({ transform: true }))
		await app.init()

		// grab Prisma from the module so we can seed/cleanup directly
		prisma = moduleFixture.get<PrismaService>(PrismaService)

		// seed a real worker so service operations have a valid workerId to link to supabase
		const worker = await prisma.worker.create({
			data: {
				supabaseId: TEST_SUPABASE_ID,
				name: 'E2E Worker',
				initials: 'EW',
			},
		})
		workerId = worker.id
	}, 30000) // 30s timeout (app boot + db is slower that the default 5s)

	// runs once after all tests finish
	afterAll(async () => {
		await prisma.service.deleteMany({ where: { workerId } })
		await prisma.worker.delete({ where: { id: workerId } })
		await app.close()
	}, 30000)

	describe('POST /services', () => {
		it('creates a service', async () => {
			const res = await request(app.getHttpServer())
				.post('/services')
				.send({
					name: 'Haircut',
					description: 'Classic haircut',
					price: 25,
					duration: 30,
					category: 'HAIR',
				})
				.expect(201)

			expect(res.body).toHaveProperty('service')
			expect(res.body.service).toHaveProperty('id')
			serviceId = res.body.service.id // capture the id so the tests below can use it
		})
	})

	describe('GET /services', () => {
		it('returns all services', async () => {
			const res = await request(app.getHttpServer())
				.get('/services')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
		})
		it('filters by category', async () => {
			const res = await request(app.getHttpServer())
				.get('/services?category=HAIR')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
			expect(
				res.body.every((s: { category: string }) => s.category === 'HAIR'),
			).toBe(true)
		})
	})

	describe('GET /services/featured', () => {
		it('returns up to 4 featured services', async () => {
			const res = await request(app.getHttpServer())
				.get('/services/featured')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
			expect(res.body.length).toBeLessThanOrEqual(4)
		})
	})

	describe('GET /services/:id', () => {
		it('returns a service', async () => {
			const res = await request(app.getHttpServer())
				.get(`/services/${serviceId}`)
				.expect(200)

			expect(res.body).toHaveProperty('id', serviceId)
		})
		it('returns 404 if service not found', async () => {
			await request(app.getHttpServer())
				.get('/services/non-existent-id')
				.expect(404)
		})
	})

	describe('PATCH /services/:id', () => {
		it('updates a service', async () => {
			const res = await request(app.getHttpServer())
				.patch(`/services/${serviceId}`)
				.send({ name: 'Updated Haircut' })
				.expect(200)

			expect(res.body).toHaveProperty('name', 'Updated Haircut')
		})
	})

	describe('DELETE /services/:id', () => {
		it('deletes a service', async () => {
			const res = await request(app.getHttpServer())
				.delete(`/services/${serviceId}`)
				.expect(200)

			expect(res.body).toHaveProperty('success', true)
		})
	})
})
