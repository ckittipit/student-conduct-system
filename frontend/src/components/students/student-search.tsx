'use client'

import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

const grades = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
const gradeLabel: Record<string, string> = {
	M1: 'ม.1',
	M2: 'ม.2',
	M3: 'ม.3',
	M4: 'ม.4',
	M5: 'ม.5',
	M6: 'ม.6',
}

interface Props {
	search: string
	grade: string
	onSearchChange: (v: string) => void
	onGradeChange: (v: string) => void
}

export function StudentSearch({
	search,
	grade,
	onSearchChange,
	onGradeChange,
}: Props) {
	return (
		<div className='flex gap-3'>
			<div className='relative flex-1'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					placeholder='ค้นหาชื่อหรือรหัสนักเรียน...'
					className='pl-9'
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>
			<Select
				value={grade}
				onValueChange={onGradeChange}
			>
				<SelectTrigger className='w-36'>
					<SelectValue placeholder='ทุกชั้น' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value=''>ทุกชั้น</SelectItem>
					{grades.map((g) => (
						<SelectItem
							key={g}
							value={g}
						>
							{gradeLabel[g]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
