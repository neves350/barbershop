import { Worker, WorkerSpecialty } from '@core/models/worker.model'

export function makeWorker(overrides: Partial<Worker>): Worker {
	return {
		id: 'worker-1',
		name: 'Worker 1',
		specialty: WorkerSpecialty.BEAUTICIAN,
		avatarUrl: 'https://github.com/neves350',
		...overrides,
	}
}
