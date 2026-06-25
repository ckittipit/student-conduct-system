'use client'

import { useState } from 'react'
import { useUpdateBonusRecord } from '@/hooks/use-bonus'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { BonusRecord } from '@/types'

interface Props {
	open: boolean
	onClose: () => void
	studentId: string
	record: BonusRecord
}

const pointOptions = [5, 10, 20] as const

export function EditBonusDialog({ open, onClose, studentId, record }: Props) {
	const updateBonus = useUpdateBonusRecord(studentId)
	const [title, setTitle] = useState(record.title)
	const [points, setPoints] = useState<5 | 10 | 20>(
		record.pointsAdded as 5 | 10 | 20,
	)

	const handleSubmit = () => {
		updateBonus.mutate(
			{ id: record.id, title, pointsAdded: points },
			{ onSuccess: onClose },
		)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>แก้ไขรายการเพิ่มคะแนน</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>หัวข้อ</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div className='space-y-2'>
						<Label>คะแนนที่เพิ่ม</Label>
						<div className='flex gap-3'>
							{pointOptions.map((p) => (
								<button
									key={p}
									type='button'
									onClick={() => setPoints(p)}
									className={cn(
										'flex-1 py-3 rounded-lg border-2 font-bold text-lg transition-colors',
										points === p
											? 'border-green-600 bg-green-50 text-green-600'
											: 'border-slate-200 hover:border-slate-300',
									)}
								>
									+{p}
								</button>
							))}
						</div>
					</div>

					<div className='flex justify-end gap-2'>
						<Button
							variant='outline'
							onClick={onClose}
						>
							ยกเลิก
						</Button>
						<Button
							className='bg-green-600 hover:bg-green-700'
							disabled={updateBonus.isPending}
							onClick={handleSubmit}
						>
							{updateBonus.isPending
								? 'กำลังบันทึก...'
								: 'บันทึก'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
