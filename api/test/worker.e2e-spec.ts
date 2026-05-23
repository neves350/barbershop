import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { SupabaseAuthGuard } from '../src/common/guards/supabase-auth.guard'
import { SupabaseService } from '../src/common/supabase/supabase.service'
import { PrismaService } from '../src/prisma/prisma.service'

const TEST_SUPABASE_ID = `e2e-worker-${Date.now()}`

describe('WorkerController (e2e)', () => {
	let app: INestApplication<App>
	let prisma: PrismaService
	let workerId: string // captured after POST /workers

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			// bypass JWT verification
			.overrideGuard(SupabaseAuthGuard)
			.useValue({
				canActivate: (ctx) => {
					const req = ctx.switchToHttp().getRequest()
					req.user = { supabaseId: TEST_SUPABASE_ID }
					return true
				},
			})
			// stub Supabase admin API so create() doesn't call real Supabase
			.overrideProvider(SupabaseService)
			.useValue({
				getUserById: (id: string) =>
					id === TEST_SUPABASE_ID ? { id: TEST_SUPABASE_ID } : null,
			})
			.compile()

		app = moduleFixture.createNestApplication()
		app.useGlobalPipes(new ValidationPipe({ transform: true }))
		await app.init()

		prisma = moduleFixture.get<PrismaService>(PrismaService)
	}, 30000)

	afterAll(async () => {
		if (workerId) {
			await prisma.worker.delete({ where: { id: workerId } }).catch(() => {})
		}
		await app.close()
	}, 30000)

	describe('POST /workers', () => {
		it('creates a worker', async () => {
			const res = await request(app.getHttpServer())
				.post('/workers')
				.send({
					name: 'E2E Worker',
					specialty: 'BEAUTICIAN',
					supabaseId: TEST_SUPABASE_ID,
				})
				.expect(201)

			expect(res.body).toHaveProperty('worker')
			expect(res.body.worker).toHaveProperty('id')
			workerId = res.body.worker.id
		})
	})

	describe('GET /workers', () => {
		it('returns all workers', async () => {
			const res = await request(app.getHttpServer()).get('/workers').expect(200)

			expect(Array.isArray(res.body)).toBe(true)
		})
		it('filters by specialty', async () => {
			const res = await request(app.getHttpServer())
				.get('/workers?specialty=BEAUTICIAN')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
			expect(
				res.body.every(
					(w: { specialty: string }) => w.specialty === 'BEAUTICIAN',
				),
			).toBe(true)
		})
	})

	describe('GET /workers/:id', () => {
		it('returns a worker', async () => {
			const res = await request(app.getHttpServer())
				.get(`/workers/${workerId}`)
				.expect(200)

			expect(res.body).toHaveProperty('id', workerId)
		})
		it('returns 404 if worker not found', async () => {
			await request(app.getHttpServer())
				.get('/workers/non-existent-id')
				.expect(404)
		})
	})

	describe('PATCH /workers/:id', () => {
		it('updates a worker', async () => {
			const res = await request(app.getHttpServer())
				.patch(`/workers/${workerId}`)
				.send({ name: 'Updated Worker' })
				.expect(200)

			expect(res.body).toHaveProperty('worker')
			expect(res.body.worker).toHaveProperty('name', 'Updated Worker')
		})
	})

	describe('DELETE /workers/:id', () => {
		it('deletes a worker', async () => {
			const res = await request(app.getHttpServer())
				.delete(`/workers/${workerId}`)
				.expect(200)

			expect(res.body).toHaveProperty('success', true)
			workerId = '' // already deleted, skip afterAll cleanup
		})
	})
})
