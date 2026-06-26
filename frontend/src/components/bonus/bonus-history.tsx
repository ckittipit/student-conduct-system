'use client'

import { useState } from 'react'
import { useDeleteBonusRecord, useUpdateBonusRecord } from '@/hooks/use-bonus'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonthYearFilter } from '@/components/shared/month-year-filter'
import type { BonusRecord } from '@/types'
import { Trash2, Pencil } from 'lucide-react'
import { EditBonusDialog } from './edit-bonus-dialog'

interface Props {
	records: BonusRecord[]
	studentId: string
	month?: number
	year?: number
	onMonthChange: (v: number | undefined) => void
	onYearChange: (v: number | undefined) => void
}

export function BonusHistory({
	records,
	studentId,
	month,
	year,
	onMonthChange,
	onYearChange,
}: Props) {
	const deleteRecord = useDeleteBonusRecord(studentId)
	const [editing, setEditing] = useState<BonusRecord | null>(null)

	return (
		<div className='space-y-4 my-4'>
			<MonthYearFilter
				month={month}
				year={year}
				onMonthChange={onMonthChange}
				onYearChange={onYearChange}
			/>

			{records.length === 0 ? (
				<p className='text-center text-muted-foreground py-8'>
					ไม่มีประวัติเพิ่มคะแนน
				</p>
			) : (
				records.map((record) => (
					<Card key={record.id}>
						<CardContent className='p-4 flex flex-col sm:flex-row items-start justify-between gap-4'>
							<div className='space-y-1 flex-1 min-w-0'>
								<p className='font-medium'>{record.title}</p>
								<Badge className='bg-green-500'>
									+{record.pointsAdded} คะแนน
								</Badge>
								{record.note && (
									<p className='text-sm text-muted-foreground'>
										{record.note}
									</p>
								)}
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
							<div className='flex gap-1 self-end sm:self-auto'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => setEditing(record)}
								>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='icon'
									className='text-destructive hover:text-destructive'
									onClick={() =>
										deleteRecord.mutate(record.id)
									}
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>
				))
			)}
			{editing && (
				<EditBonusDialog
					record={editing}
					studentId={studentId}
					open={!!editing}
					onClose={() => setEditing(null)}
				/>
			)}
		</div>
	)
}
