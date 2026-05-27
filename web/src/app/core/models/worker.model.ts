export enum WorkerSpecialty {
	BEAUTICIAN = 'BEAUTICIAN',
	ESTHETICS = 'ESTHETICS',
}

export interface Worker {
	id: string
	name: string
	specialty: WorkerSpecialty
	avatarUrl: string
}
