import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { SupabaseAuthGuard } from '../src/common/guards/supabase-auth.guard'
import { PrismaService } from '../src/prisma/prisma.service'

const TEST_BOOKING_ID = `e2e-booking-${Date.now()}`

describe('BookingController (e2e)', () => {
	let app: INestApplication<App>
	let prisma: PrismaService
	let bookingId: string // set by POST test, used by update/delete tests
	let seededBookingId: string // seeded in beforeAll, stable across all tests
	let serviceId: string // seeded service for POST payload

	// boot the app, mocks auth, seeds required data in the real database
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(SupabaseAuthGuard)
			.useValue({
				canActivate: (ctx) => {
					const req = ctx.switchToHttp().getRequest()
					req.user = { supabaseId: TEST_BOOKING_ID }
					return true
				},
			})
			.compile()

		app = moduleFixture.createNestApplication()
		app.useGlobalPipes(new ValidationPipe({ transform: true }))
		await app.init()

		prisma = moduleFixture.get<PrismaService>(PrismaService)

		// seed a service so POST /bookings has a valid UUID to reference
		const service = await prisma.service.create({
			data: {
				name: 'E2E Service',
				description: 'Seeded for e2e tests',
				price: 20,
				duration: 30,
				category: 'HAIR',
			},
		})
		serviceId = service.id

		// seed an existing booking for read/update/delete tests
		const booking = await prisma.booking.create({
			data: {
				clientName: 'E2E Cliente',
				phone: '910200300',
				date: new Date('2026-05-30'),
			},
		})
		bookingId = booking.id
		seededBookingId = booking.id
	}, 30000) // 30s timeout (app boot + db is slower than the default 5s)

	// runs once after all tests finish
	afterAll(async () => {
		await prisma.booking.deleteMany({
			where: { id: { in: [bookingId, seededBookingId] } },
		})
		await prisma.service.delete({ where: { id: serviceId } })
		await app.close()
	}, 30000)

	describe('POST /bookings', () => {
		it('creates a booking', async () => {
			const res = await request(app.getHttpServer())
				.post('/bookings')
				.send({
					clientName: 'Client 1',
					phone: '910200300',
					date: new Date(),
					serviceIds: [serviceId],
				})
				.expect(201)

			expect(res.body).toHaveProperty('booking')
			expect(res.body.booking).toHaveProperty('id')
			bookingId = res.body.booking.id // capture the id so the tests below can use it
		})
		it('returns 400 when required fields are missing', async () => {
			await request(app.getHttpServer()).post('/bookings').send({}).expect(400)
		})
		it('returns 400 when serviceIds is empty', async () => {
			await request(app.getHttpServer())
				.post('/bookings')
				.send({
					clientName: 'Client 1',
					phone: '910200300',
					date: new Date(),
					serviceIds: [],
				})
				.expect(400)
		})
		it('returns 400 when serviceIds contains invalid UUIDs', async () => {
			await request(app.getHttpServer())
				.post('/bookings')
				.send({
					clientName: 'Client 1',
					phone: '910200300',
					date: new Date(),
					serviceIds: ['not-a-uuid'],
				})
				.expect(400)
		})
	})

	describe('GET /bookings', () => {
		it('returns an array of bookings', async () => {
			const res = await request(app.getHttpServer())
				.get('/bookings')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
		})
		it('includes the seeded booking', async () => {
			const res = await request(app.getHttpServer())
				.get('/bookings')
				.expect(200)

			const ids = res.body.map((b: { id: string }) => b.id)
			expect(ids).toContain(bookingId)
		})
		it('filters by date', async () => {
			const res = await request(app.getHttpServer())
				.get('/bookings?date=2026-05-30')
				.expect(200)

			expect(Array.isArray(res.body)).toBe(true)
			expect(
				res.body.some((b: { id: string }) => b.id === seededBookingId),
			).toBe(true)
		})
		it('returns 400 when workerId is not a valid UUID', async () => {
			await request(app.getHttpServer())
				.get('/bookings?workerId=not-a-uuid')
				.expect(400)
		})
		it('returns 400 when serviceId is not a valid UUID', async () => {
			await request(app.getHttpServer())
				.get('/bookings?serviceId=not-a-uuid')
				.expect(400)
		})
	})

	describe('GET /bookings/:id', () => {
		it('returns a booking', async () => {
			const res = await request(app.getHttpServer())
				.get(`/bookings/${bookingId}`)
				.expect(200)

			expect(res.body).toHaveProperty('id', bookingId)
		})
		it('returns 404 if booking not found', async () => {
			await request(app.getHttpServer())
				.get('/bookings/non-existent-id')
				.expect(404)
		})
	})

	describe('PATCH /bookings/:id', () => {
		it('updates a booking', async () => {
			const res = await request(app.getHttpServer())
				.patch(`/bookings/${bookingId}`)
				.send({ status: 'CONFIRMED' })
				.expect(200)

			expect(res.body).toHaveProperty('booking.status', 'CONFIRMED')
		})
		it('returns 404 if booking not found', async () => {
			await request(app.getHttpServer())
				.patch('/bookings/non-existent-id')
				.send({ status: 'CONFIRMED' })
				.expect(404)
		})
	})

	describe('DELETE /bookings/:id', () => {
		it('deletes a booking', async () => {
			const res = await request(app.getHttpServer())
				.delete(`/bookings/${bookingId}`)
				.expect(200)

			expect(res.body).toHaveProperty('success', true)
		})
		it('returns 404 if booking not found', async () => {
			await request(app.getHttpServer())
				.delete('/bookings/non-existent-id')
				.expect(404)
		})
	})
})
