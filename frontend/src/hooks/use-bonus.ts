import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api'
import type { BonusRecord, PaginatedResponse } from '@/types'

// const testToken =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXFveDZiNzYwMDAwMTM2bXNveGlpajRvIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzgyMzYwMjk1fQ.GzqYUwCsYJsdb1i6kffOdgSoOXTenPL_KtZujLY7rOs'

export function useBonusRecords(
	studentId: string,
	query: { month?: number; year?: number } = {},
) {
	const { data: session } = useSession()
	const params = new URLSearchParams()
	if (query.month) params.set('month', String(query.month))
	if (query.year) params.set('year', String(query.year))

	return useQuery({
		queryKey: ['bonus-records', studentId, query],
		queryFn: () =>
			apiClient<PaginatedResponse<BonusRecord>>(
				`/bonus-records/student/${studentId}?${params}`,
				{ token: session?.accessToken },
			),
		enabled: !!session?.accessToken && !!studentId,
		// enabled: !!studentId,
	})
}

export function useCreateBonusRecord() {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: {
			studentId: string
			title: string
			pointsAdded: 5 | 10 | 20
			note?: string
		}) =>
			apiClient<BonusRecord>('/bonus-records', {
				method: 'POST',
				body: JSON.stringify(data),
				token: session?.accessToken,
			}),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['bonus-records', variables.studentId],
			})
			queryClient.invalidateQueries({
				queryKey: ['students', variables.studentId],
			})
		},
	})
}

export function useUpdateBonusRecord(studentId: string) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: string
			title?: string
			pointsAdded?: 5 | 10 | 20
		}) =>
			apiClient<BonusRecord>(`/bonus-records/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
				token: session?.accessToken,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['bonus-records', studentId],
			})
			queryClient.invalidateQueries({ queryKey: ['students', studentId] })
		},
	})
}

export function useDeleteBonusRecord(studentId: string) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) =>
			apiClient(`/bonus-records/${id}`, {
				method: 'DELETE',
				token: session?.accessToken,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['bonus-records', studentId],
			})
			queryClient.invalidateQueries({ queryKey: ['students', studentId] })
		},
	})
}
