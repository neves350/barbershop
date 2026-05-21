export const mockPrisma = {
	service: {
		create: jest.fn(),
		findMany: jest.fn(),
		findFirst: jest.fn(),
		findUnique: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
	worker: {
		findUniqueOrThrow: jest.fn(),
		create: jest.fn(),
		findUnique: jest.fn(),
		findFirst: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
}
