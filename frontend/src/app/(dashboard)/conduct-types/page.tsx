'use client'

import { useState } from 'react'
import { useConductTypes } from '@/hooks/use-conduct'
import { ConductTypeCard } from '@/components/conduct/conduct-type-card'
import { AddConductTypeDialog } from '@/components/conduct/add-conduct-type-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

export default function ConductTypePage() {
	const { data: types, isLoading } = useConductTypes()
	const [showAdd, setShowAdd] = useState(false)

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
				<div>
					<h1 className='text-2xl font-bold'>ประเภทความผิด</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						จัดการ dropdown 2 ระดับสำหรับบันทึกความผิด
					</p>
				</div>
				<Button
					onClick={() => setShowAdd(true)}
					className='w-full sm:w-auto'
				>
					<Plus className='mr-2 h-4 w-4' />
					เพิ่มประเภท
				</Button>
			</div>
			{isLoading ? (
				<div className='space-y-4'>
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton
							key={i}
							className='h-40 rounded-xl'
						/>
					))}
				</div>
			) : (
				<div className='space-y-4'>
					{types?.map((type) => (
						<ConductTypeCard
							key={type.id}
							type={type}
						/>
					))}
					{types?.length === 0 && (
						<p className='text-center text-muted-foreground py-12'>
							ยังไม่มีประเภทความผิด — กด "เพิ่มประเภท"
							เพื่อเริ่มต้น
						</p>
					)}
				</div>
			)}
			<AddConductTypeDialog
				open={showAdd}
				onClose={() => setShowAdd(false)}
			/>
		</div>
	)
}
