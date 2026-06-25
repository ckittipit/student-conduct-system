'use client'

import { useDeleteConductRecord } from '@/hooks/use-conduct'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonthYearFilter } from '@/components/shared/month-year-filter'
import type { ConductRecord } from '@/types'
import { Trash2 } from 'lucide-react'

const remarkLabel: Record<string, string> = {
	CONFESSION: 'สารภาพ',
	PROBATION: 'ทัณฑ์บน',
	WITHDRAWN: 'ลาออก',
}

interface Props {
	records: ConductRecord[]
	studentId: string
	month?: string
	year?: string
	onMonthChange: (v: number | undefined) => void
	onYearChange: (v: number | undefined) => void
}

export function ConductHistory({
	records,
	studentId,
	month,
	year,
	onMonthChange,
	onYearChange,
}: Props) {
	const deleteRecord = useDeleteConductRecord(studentId)

	return (
		<div className='space-y-4 mt-4'>
			<MonthYearFilter
				month={month}
				year={year}
				onMonthChange={onMonthChange}
				onYearChange={onYearChange}
			/>

			{records.length === 0 ? (
				<p className='text-center text-muted-foreground py-8'>
					ไม่มีประวัติความผิด
				</p>
			) : (
				records.map((record) => (
					<Card key={record.id}>
						<CardContent className='p-4 flex items-start justify-between gap-4'>
							<div className='space-y-1 flex-1'>
								<p className='font-medium'>
									{record.conductItem?.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									{record.conductItem?.conductType.name}
								</p>
								<div className='flex- flew-wrap gap-2 mt-2'>
									<Badge variant='destructive'>
										-{record.pointsDeducted} คะแนน
									</Badge>
									{record.note && (
										<p className='text-sm text-muted-foreground mt-1'>
											{record.note}
										</p>
									)}
								</div>
								<p className='text-xs text-muted-foreground'>
									{new Date(
										record.recordedAt,
									).toLocaleDateString('th-TH', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
									{' . '}บันทึกโดย {record.recordedBy.name}
								</p>
							</div>
							<Button
								variant='ghost'
								size='icon'
								className='text-destructive hover:text-destructive'
								onClick={() => deleteRecord.mutate(record.id)}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</CardContent>
					</Card>
				))
			)}
		</div>
	)
}
