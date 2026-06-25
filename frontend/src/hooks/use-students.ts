import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api'
import type { Student, PaginatedResponse } from '@/types'

interface StudentQuery {
	search?: string
	grade?: string
	page?: number
}

// const testToken =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXFveDZiNzYwMDAwMTM2bXNveGlpajRvIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzgyMzYwMjk1fQ.GzqYUwCsYJsdb1i6kffOdgSoOXTenPL_KtZujLY7rOs'
// call all students list
export function useStudents(query: StudentQuery = {}) {
	const { data: session } = useSession()
	const params = new URLSearchParams()

	if (query.search) params.set('search', query.search)
	if (query.grade) params.set('grade', query.grade)
	if (query.page) params.set('page', String(query.page))

	console.log('useStudents called', {
		token: session?.accessToken,
	})

	return useQuery({
		queryKey: ['students', query],
		queryFn: async () =>
			apiClient<PaginatedResponse<Student>>(`/students?${params}`, {
				token: session?.accessToken,
			}),
		enabled: !!session?.accessToken,
		// enabled: true,
	})
}

// call 1 student data
export function useStudent(id: string) {
	const { data: session } = useSession()
	return useQuery({
		queryKey: ['students', id],
		queryFn: () =>
			apiClient<Student & { conductRecords: any[]; bonusRecords: any[] }>(
				`/students/${id}`,
				{ token: session?.accessToken },
			),
		enabled: !!session?.accessToken && !!id,
		// enabled: !!id,
	})
}

// create new student
export function useCreateStudent() {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: Partial<Student>) =>
			apiClient<Student>('/students', {
				method: 'POST',
				body: JSON.stringify(data),
				token: session?.accessToken,
			}),
		onSuccess: () => {
			// invalidate cache to let list reload
			queryClient.invalidateQueries({ queryKey: ['students'] })
		},
	})
}

//Edit student
export function useUpdateStudent(id: string) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: Partial<Student>) =>
			apiClient<Student>(`'students/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
				token: session?.accessToken,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['students'] })
			queryClient.invalidateQueries({ queryKey: ['students', id] })
		},
	})
}

//Delete student
export function useDeleteStudent() {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) =>
			apiClient(`/students/${id}`, {
				method: 'DELETE',
				token: session?.accessToken,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['students'] })
		},
	})
}
