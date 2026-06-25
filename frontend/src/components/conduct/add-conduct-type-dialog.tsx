'use client'

import { useState } from 'react'
import { useCreateConductType } from '@/hooks/use-conduct'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
	open: boolean
	onClose: () => void
}

export function AddConductTypeDialog({ open, onClose }: Props) {
	const createType = useCreateConductType()
	const [name, setName] = useState('')

	const handleSubmit = () => {
		if (!name.trim()) return
		createType.mutate(
			{ name },
			{
				onSuccess: () => {
					setName('')
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
					<DialogTitle>เพิ่มประเภทความผิด</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>ชื่อประเภท</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='เช่น ทรงผม, เครื่องแต่งกาย'
							onKeyDown={(e) =>
								e.key === 'Enter' && handleSubmit()
							}
							autoFocus
						/>
					</div>
					<div className='flex justify-end gap-2'>
						<Button
							variant='outline'
							onClick={onClose}
						>
							ยกเลิก
						</Button>
						<Button
							disabled={!name.trim() || createType.isPending}
							onClick={handleSubmit}
						>
							{createType.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
