'use client'

import { useState } from 'react'
import { useCreateBonusRecord } from '@/hooks/use-bonus'
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

interface Props {
	open: boolean
	onClose: () => void
	studentId: string
}

const pointOptions = [5, 10, 20] as const

export function AddBonusDialog({ open, onClose, studentId }: Props) {
	const createBonus = useCreateBonusRecord()
	const [title, setTitle] = useState('')
	const [points, setPoints] = useState<5 | 10 | 20>(5)

	const handleSubmit = () => {
		if (!title.trim()) return
		createBonus.mutate(
			{ studentId, title, pointsAdded: points },
			{
				onSuccess: () => {
					setTitle('')
					setPoints(5)
					onClose()
				},
			},
		)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>เพิ่มคะแนน</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>หัวข้อ</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='เช่น ชนะการแข่งขันกีฬา'
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
							disabled={!title.trim() || createBonus.isPending}
							onClick={handleSubmit}
						>
							{createBonus.isPending
								? 'กำลังบันทึก...'
								: 'เพิ่มคะแนน'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
