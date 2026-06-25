import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api'
import type { ConductType, ConductRecord, PaginatedResponse } from '@/types'

const testToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXFveDZiNzYwMDAwMTM2bXNveGlpajRvIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzgyMzYwMjk1fQ.GzqYUwCsYJsdb1i6kffOdgSoOXTenPL_KtZujLY7rOs'

// ดึง conduct types ทั้งหมดพร้อม items (ใช้สร้าง dropdown)
export function useConductTypes() {
	const { data: session } = useSession()
	return useQuery({
		queryKey: ['conduct-types'],
		queryFn: () =>
			apiClient<ConductType[]>('/conduct-types', {
				token: session?.accessToken ?? testToken,
			}),
		// enabled: !!session?.accessToken,
		enabled: true,
	})
}

// ดึงประวัติความผิดของนักเรียน
export function useConductRecords(
	studentId: string,
	query: { month?: number; year?: number; page?: number } = {},
) {
	const { data: session } = useSession()
	const params = new URLSearchParams()
	if (query.month) params.set('month', String(query.month))
	if (query.year) params.set('year', String(query.year))
	if (query.page) params.set('page', String(query.page))

	return useQuery({
		queryKey: ['conduct-records', studentId, query],
		queryFn: () =>
			apiClient<PaginatedResponse<ConductRecord>>(
				`/conduct-records/student/${studentId}?${params}`,
				{ token: session?.accessToken ?? testToken },
			),
		// enabled: !!session?.accessToken && !!studentId,
		enabled: !!testToken && !!studentId,
	})
}

// บันทึกความผิด
export function useCreateConductRecord() {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: {
			studentId: string
			conductItemId: string
			remarkCategory?: string
			note?: string
			evidenceUrl?: string
		}) =>
			apiClient<ConductRecord>('/conduct-records', {
				method: 'POST',
				body: JSON.stringify(data),
				token: session?.accessToken ?? testToken,
			}),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['conduct-records', variables.studentId],
			})
			queryClient.invalidateQueries({
				queryKey: ['students', variables.studentId],
			})
		},
	})
}

// ลบบันทึกความผิด
export function useDeleteConductRecord(studentId: string) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) =>
			apiClient(`/conduct-records/${id}`, {
				method: 'DELETE',
				token: session?.accessToken ?? testToken,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['conduct-records', studentId],
			})
			queryClient.invalidateQueries({ queryKey: ['students', studentId] })
		},
	})
}
