export enum ServiceCategory {
	HAIR = 'HAIR',
	COLORING = 'COLORING',
	TREATMENTS = 'TREATMENTS',
	AESTHETICS = 'AESTHETICS',
}

export interface Service {
	id: string
	name: string
	description: string
	price: number
	duration: number // minutes
}

export interface ServiceQueryParams {
	category?: ServiceCategory
}
