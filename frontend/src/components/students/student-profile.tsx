import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Student } from '@/types'

const gradeLabel: Record<string, string> = {
	M1: 'ม.1',
	M2: 'ม.2',
	M3: 'ม.3',
	M4: 'ม.4',
	M5: 'ม.5',
	M6: 'ม.6',
}

function PointsDisplay({ points }: { points: number }) {
	const color =
		points >= 80
			? 'text-green-600'
			: points >= 60
				? 'text-yellow-600'
				: 'text-red-600'

	return (
		<div className='text-center'>
			<p className={`text-5xl font-bold ${color}`}>{points}</p>
			<p className='text-sm text-muted-foreground mt-1'>คะแนนสะสม</p>
		</div>
	)
}

export function StudentProfile({ student }: { student: Student }) {
	return (
		<Card>
			<CardContent className='p-6 flex flex-col sm:flex-row items-center gap-6'>
				{student.imageUrl && student.imageUrl.startsWith('http') ? (
					<Image
						src={student.imageUrl}
						alt={student.firstName}
						width={100}
						height={100}
						className='rounded-full object-cover'
					/>
				) : (
					<div className='w-[100px] h-[100px] rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-500'>
						{student.firstName.charAt(0)}
					</div>
				)}

				<div className='flex-1 text-center sm:text-left space-y-2'>
					<h2 className='text-2xl font-bold'>
						{student.firstName} {student.lastName}
					</h2>
					<div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
						<Badge variant='outline'>
							รหัส: {student.studentCode}
						</Badge>
						<Badge variant='outline'>
							{gradeLabel[student.currentGrade]}
						</Badge>
					</div>
				</div>

				<PointsDisplay points={student.totalPoints} />
			</CardContent>
		</Card>
	)
}
