'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

import { useStudent } from '@/hooks/use-students'
import { useConductRecords } from '@/hooks/use-conduct'
import { useBonusRecords } from '@/hooks/use-bonus'

import { StudentProfile } from '@/components/students/student-profile'
import { ConductHistory } from '@/components/conduct/conduct-history'
import { BonusHistory } from '@/components/bonus/bonus-history'
import { AddConductDialog } from '@/components/conduct/add-conduct-dialog'
import { AddBonusDialog } from '@/components/bonus/add-bonus-dialog'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import Link from 'next/link'

export default function StudentDetailPage() {
	const { id } = useParams<{ id: string }>()
	const [month, setMonth] = useState<number | undefined>()
	const [year, setYear] = useState<number | undefined>()
	const [showConduct, setShowConduct] = useState(false)
	const [showBonus, setShowBonus] = useState(false)

	const { data: student, isLoading } = useStudent(id)
	const { data: conductData } = useConductRecords(id, { month, year })
	const { data: bonusData } = useBonusRecords(id, { month, year })

	if (isLoading) return <Skeleton className='h-96 w-full rounded-xl' />
	if (!student) return <p>ไม่พบนักเรียน</p>

	return (
		<div className='space-y-6'>
			{/* { Back Button} */}
			<Link
				href='/'
				className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground'
			>
				<ArrowLeft className='mr-1 h-4 w-4' />
				กลับหน้าหลัก
			</Link>

			{/* Profile Card */}
			<StudentProfile student={student} />

			{/* Action Button */}
			<div className='flex flex-col sm:flex-row gap-3'>
				<Button
					variant='destructive'
					onClick={() => setShowConduct(true)}
					className='w-full sm:w-auto'
				>
					<Minus className='mr-2 h-4 w-4' />
					บันทึกความผิด
				</Button>
				<Button
					className='bg-green-600 hover:bg-green-700 w-full sm:w-auto'
					onClick={() => setShowBonus(true)}
				>
					<Plus className='mr-2 h-4 w-4' />
					เพิ่มคะแนน
				</Button>
			</div>

			{/* History Tab */}
			<Tabs defaultValue='conduct'>
				<TabsList className='w-full sm:w-auto flex-wrap h-auto'>
					<TabsTrigger value='conduct'>
						ประวัตืความผิด ({conductData?.meta.total ?? 0})
					</TabsTrigger>
					<TabsTrigger value='bonus'>
						ประวัติเพิ่มคะแนน ({bonusData?.meta.total ?? 0})
					</TabsTrigger>
				</TabsList>
				<TabsContent value='conduct'>
					<ConductHistory
						records={conductData?.data ?? []}
						studentId={id}
						month={month}
						year={year}
						onMonthChange={setMonth}
						onYearChange={setYear}
					/>
				</TabsContent>
				<TabsContent value='bonus'>
					<BonusHistory
						records={bonusData?.data ?? []}
						studentId={id}
						month={month}
						year={year}
						onMonthChange={setMonth}
						onYearChange={setYear}
					/>
				</TabsContent>
			</Tabs>

			<AddConductDialog
				open={showConduct}
				onClose={() => setShowConduct(false)}
				studentId={id}
			/>
			<AddBonusDialog
				open={showBonus}
				onClose={() => setShowBonus(false)}
				studentId={id}
			/>
		</div>
	)
}
