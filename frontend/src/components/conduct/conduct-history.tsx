'use client'

import { useState, useRef } from 'react'
import { useDeleteConductRecord, useUploadEvidence } from '@/hooks/use-conduct'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonthYearFilter } from '@/components/shared/month-year-filter'
import type { ConductRecord } from '@/types'
import { Trash2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Paperclip, ExternalLink } from 'lucide-react'

const remarkLabel: Record<string, string> = {
	CONFESSION: 'สารภาพ',
	PROBATION: 'ทัณฑ์บน',
	WITHDRAWN: 'ลาออก',
}

interface Props {
	records: ConductRecord[]
	studentId: string
	month?: number
	year?: number
	onMonthChange: (v: number | undefined) => void
	onYearChange: (v: number | undefined) => void
}

// เพิ่ม component EvidenceButton:
function EvidenceButton({
	record,
	studentId,
}: {
	record: ConductRecord
	studentId: string
}) {
	const fileRef = useRef<HTMLInputElement>(null)
	const upload = useUploadEvidence(record.id, studentId)
	const [preview, setPreview] = useState(false)

	const isPdf =
		record.evidenceUrl?.endsWith('.pdf') ||
		record.evidenceUrl?.includes('/raw/upload/')

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				className={
					record.evidenceUrl
						? 'text-blue-500'
						: 'text-muted-foreground'
				}
				onClick={() =>
					record.evidenceUrl
						? setPreview(true)
						: fileRef.current?.click()
				}
				title={record.evidenceUrl ? 'ดูหลักฐาน' : 'แนบหลักฐาน'}
			>
				{upload.isPending ? (
					<span className='text-xs'>...</span>
				) : (
					<Paperclip className='h-4 w-4' />
				)}
			</Button>

			<input
				ref={fileRef}
				type='file'
				accept='image/*,application/pdf'
				className='hidden'
				onChange={(e) => {
					const file = e.target.files?.[0]
					if (file) upload.mutate(file)
				}}
			/>

			{/* Preview Dialog */}
			<Dialog
				open={preview}
				onOpenChange={setPreview}
			>
				<DialogContent className='max-w-2xl'>
					<DialogHeader>
						<DialogTitle>หลักฐานใบความประพฤติ</DialogTitle>
					</DialogHeader>

					<a
						href={record.evidenceUrl!}
						target='_blank'
						rel='noopener noreferrer'
						className='text-sm text-blue-500 flex items-center gap-1 hover:underline w-fit'
					>
						เปิดในแท็บใหม่
						<ExternalLink className='h-3 w-3' />
					</a>

					<div className='mt-2'>
						{isPdf ? (
							<iframe
								src={record.evidenceUrl!}
								className='w-full h-[500px] rounded border'
							/>
						) : (
							<img
								src={record.evidenceUrl!}
								alt='หลักฐาน'
								className='w-full rounded object-contain max-h-[500px]'
							/>
						)}
					</div>

					<p className='text-xs text-muted-foreground'>
						บันทึกโดย {record.recordedBy?.name} ·{' '}
						{new Date(record.recordedAt).toLocaleDateString(
							'th-TH',
							{
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							},
						)}
					</p>
				</DialogContent>
			</Dialog>
		</>
	)
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

							<EvidenceButton
								record={record}
								studentId={studentId}
							/>
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
