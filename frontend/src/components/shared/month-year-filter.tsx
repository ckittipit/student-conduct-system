'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const months = [
	'มกราคม',
	'กุมภาพันธ์',
	'มีนาคม',
	'เมษายน',
	'พฤษภาคม',
	'มิถุนายน',
	'กรกฎาคม',
	'สิงหาคม',
	'กันยายน',
	'ตุลาคม',
	'พฤศจิกายน',
	'ธันวาคม',
]

const currentYear = new Date().getFullYear() + 543
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

interface Props {
	month?: number
	year?: number
	onMonthChange: (v: number | undefined) => void
	onYearChange: (v: number | undefined) => void
}

export function MonthYearFilter({
	month,
	year,
	onMonthChange,
	onYearChange,
}: Props) {
	return (
		<div className='flex flex-col sm:flex-row gap-3'>
			<Select
				value={month ? String(month) : ''}
				onValueChange={(v: string) =>
					onMonthChange(v ? Number(v) : undefined)
				}
			>
				<SelectTrigger className='w-full sm:w-40'>
					<SelectValue placeholder='ทุกเดือน'></SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value=''>ทุกเดือน</SelectItem>
					{months.map((m, i) => (
						<SelectItem
							key={i + 1}
							value={String(i + 1)}
						>
							{m}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={year ? String(year) : ''}
				onValueChange={(v: string) =>
					onYearChange(v ? Number(v) : undefined)
				}
			>
				<SelectTrigger className='w-full sm:w-32'>
					<SelectValue placeholder='ทุกปี' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value=''>ทุกปี</SelectItem>
					{years.map((y) => (
						<SelectItem
							key={y}
							value={String(y)}
						>
							พ.ศ. {y}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
