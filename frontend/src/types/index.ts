export type GradeLevel = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6'
export type Role = 'ADMIN' | 'TEACHER' | 'VIEWER'
export type RemarkCategory = 'CONFESSION' | 'PROBATION' | 'WITHDRAWN'

export interface Student {
	id: string
	studentCode: string
	firstName: string
	lastName: string
	imageUrl: string | null
	currentGrade: GradeLevel
	totalPoints: number
	isActive: boolean
}

export interface ConductType {
	id: string
	name: string
	order: number
	items: ConductItem[]
}

export interface ConductItem {
	id: string
	conductTypeId: string
	name: string
	pointDeduction: number
	order: number
}

export interface ConductRecord {
	id: string
	studentId: string
	conductItemId: string
	pointsDeducted: number
	remarkCategory: RemarkCategory | null
	note: string | null
	evidenceUrl: string | null
	recordedAt: string
	conductItem: ConductItem & { conductType: ConductType }
	recordedBy: { id: string; name: string }
}

export interface BonusRecord {
	id: string
	studentId: string
	title: string
	pointsAdded: number
	note: string | null
	recordedAt: string
	recordedBy: { id: string; name: string }
}

export interface PaginatedResponse<T> {
	data: T[]
	meta: {
		total: number
		page: number
		limit: number
		totalPages: number
	}
}
