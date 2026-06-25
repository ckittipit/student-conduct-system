'use client'

import { useState } from 'react'
import { useCreateConductRecord } from '@/hooks/use-conduct'
import { useConductTypes } from '@/hooks/use-conduct'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
	open: boolean
	onClose: () => void
	studentId: string
}

const remarkOptions = [
	{ value: 'CONFESSION', label: 'สารภาพพฤติกรรม' },
	{ value: 'PROBATION', label: 'ทัณฑ์บน' },
	{ value: 'WITHDRAWN', label: 'ลาออก' },
]

export function AddConductDialog({ open, onClose, studentId }: Props) {
	const { data: conductTypes } = useConductTypes()
	const createRecord = useCreateConductRecord()

	const [typeId, setTypeId] = useState('')
	const [itemId, setItemId] = useState('')
	const [remark, setRemark] = useState('')
	const [note, setNote] = useState('')

	const selectedType = conductTypes?.find((t) => t.id === typeId)

	const handleSubmit = () => {
		if (!itemId) return
		createRecord.mutate(
			{
				studentId,
				conductItemId: itemId,
				remarkCategory: (remark as any) || undefined,
				note: note || undefined,
			},
			{
				onSuccess: () => {
					setTypeId('')
					setItemId('')
					setRemark('')
					setNote('')
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
					<DialogTitle>บันทึกความผิด</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>ประเภทความผิด</Label>
						<Select
							value={typeId}
							onValueChange={(v: string) => {
								setTypeId(v)
								setItemId('')
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder='เลือกประเภท' />
							</SelectTrigger>
							<SelectContent>
								{conductTypes?.map((t) => (
									<SelectItem
										key={t.id}
										value={t.id}
									>
										{t.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label>รายการความผิด</Label>
						<Select
							value={itemId}
							onValueChange={setItemId}
							disabled={!typeId}
						>
							<SelectTrigger>
								<SelectValue placeholder='เลือกรายการ' />
							</SelectTrigger>
							<SelectContent>
								{selectedType?.items.map((item) => (
									<SelectItem
										key={item.id}
										value={item.id}
									>
										{item.name} (-{item.pointDeduction}{' '}
										คะแนน)
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label>หมายเหตุ (ไม่บังคับ)</Label>
						<Select
							value={remark}
							onValueChange={setRemark}
						>
							<SelectTrigger>
								<SelectValue placeholder='เลือกหมายเหตุ' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value=''>ไม่มี</SelectItem>
								{remarkOptions.map((r) => (
									<SelectItem
										key={r.value}
										value={r.value}
									>
										{r.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label>บันทึกเพิ่มเติม</Label>
						<Textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder='รายละเอียดเพิ่มเติม...'
							rows={3}
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
							variant='destructive'
							disabled={!itemId || createRecord.isPending}
							onClick={handleSubmit}
						>
							{createRecord.isPending
								? 'กำลังบันทึก...'
								: 'บันทึกความผิด'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
