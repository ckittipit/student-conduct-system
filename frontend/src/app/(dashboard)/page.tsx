'use client'

import { useState } from 'react'
import { useStudents } from '@/hooks/use-students'
import { StudentCard } from '@/components/students/student-card'
import { StudentSearch } from '@/components/students/student-search'
import { AddStudentDialog } from '@/components/students/add-student-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserPlus } from 'lucide-react'
import { useSession } from 'next-auth/react'
// import { redirect } from 'next/navigation'

export default function HomePage() {
	// redirect('/students')
	const { data: session } = useSession()
	const [search, setSearch] = useState('')
	const [grade, setGrade] = useState('')
	const [page, setPage] = useState(1)
	const [showAdd, setShowAdd] = useState(false)

	const { data, isLoading } = useStudents({ search, grade, page })

	const isAdmin = session?.user?.role === 'ADMIN'
	const isTeacher = session?.user?.role === 'TEACHER'

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold'>นักเรียนทั้งหมด</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						{data?.meta.total ?? 0} คน
					</p>
				</div>
				{(isAdmin || isTeacher) && (
					<Button
						onClick={() => setShowAdd(true)}
						className='w-full sm:w-auto'
					>
						<UserPlus className='mr-2 h-4 w-4' />
						เพิ่มนักเรียน
					</Button>
				)}
			</div>

			<StudentSearch
				search={search}
				grade={grade}
				onSearchChange={(v: string) => {
					setSearch(v)
					setPage(1)
				}}
				onGradeChange={(v: string) => {
					setGrade(v)
					setPage(1)
				}}
			/>

			{isLoading ? (
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton
							key={i}
							className='h-40 rounded-xl'
						/>
					))}
				</div>
			) : (
				<>
					<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
						{data?.data.map((student) => (
							<StudentCard
								key={student.id}
								student={student}
							/>
						))}
					</div>

					{/* Pagination */}
					{data && data.meta.totalPages > 1 && (
						<div className='flex justify-center gap-2'>
							<Button
								variant='outline'
								disabled={page === 1}
								onClick={() => setPage(page - 1)}
							>
								ก่อนหน้า
							</Button>
							<span className='flex items-center text-sm text-muted-foreground'>
								หน้า {page} / {data.meta.totalPages}
							</span>
							<Button
								variant='outline'
								disabled={page === data.meta.totalPages}
								onClick={() => setPage(page + 1)}
							>
								ถัดไป
							</Button>
						</div>
					)}
				</>
			)}

			<AddStudentDialog
				open={showAdd}
				onClose={() => setShowAdd(false)}
			/>
		</div>
	)
}
