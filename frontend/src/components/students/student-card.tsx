import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Student } from '@/types'
// import { cn } from '@/lib/utils'

const gradeLabel: Record<string, string> = {
	M1: 'ม.1',
	M2: 'ม.2',
	M3: 'ม.3',
	M4: 'ม.4',
	M5: 'ม.5',
	M6: 'ม.6',
}

function PointsBadge({ points }: { points: number }) {
	if (points >= 80)
		return <Badge className='bg-green-500'>{points} คะแนน</Badge>
	if (points >= 60)
		return <Badge className='bg-yellow-500'>{points} คะแนน</Badge>
	return <Badge className='bg-red-500'>{points} คะแนน</Badge>
}

export function StudentCard({ student }: { student: Student }) {
	return (
		<Link href={`/students/${student.id}`}>
			<Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
				<CardContent className='p-4 flex flex-col items-center text-center gap-3'>
					{student.imageUrl && student.imageUrl.startsWith('http') ? (
						<Image
							src={student.imageUrl}
							alt={student.firstName}
							width={72}
							height={72}
							className='rounded-full object-cover'
						/>
					) : (
						<div className='w-[72px] h-[72px] rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500'>
							{student.firstName.charAt(0)}
						</div>
					)}
					<div>
						<p className='font-semibold text-sm'>
							{student.firstName} {student.lastName}
						</p>
						<p className='text-xs text-muted-foreground'>
							{student.studentCode}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<Badge variant='outline'>
							{gradeLabel[student.currentGrade]}
						</Badge>
						<PointsBadge points={student.totalPoints} />
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
