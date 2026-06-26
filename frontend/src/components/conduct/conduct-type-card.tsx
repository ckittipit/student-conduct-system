'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	useDeleteConductType,
	useUpdateConductType,
	useCreateConductItem,
	useUpdateConductItem,
	useDeleteConductItem,
} from '@/hooks/use-conduct'
import type { ConductType, ConductItem } from '@/types'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

interface Props {
	type: ConductType
}

function InlineEdit({
	value,
	onSave,
	onCancel,
}: {
	value: string
	onSave: (v: string) => void
	onCancel: () => void
}) {
	const [val, setVal] = useState(value)
	return (
		<div className='flex items-center gap-2'>
			<Input
				value={val}
				onChange={(e) => setVal(e.target.value)}
				className='h-8 text-sm'
				autoFocus
			/>
			<Button
				size='icon'
				variant='ghost'
				className='h-8 w-8'
				onClick={() => onSave(val)}
			>
				<Check className='h-4 w-4 text-green-600' />
			</Button>
			<Button
				size='icon'
				variant='ghost'
				className='h-8 w-8'
				onClick={onCancel}
			>
				<X className='h-4 w-4 text-destructive' />
			</Button>
		</div>
	)
}

function ConductItemRow({
	item,
	typeId,
}: {
	item: ConductItem
	typeId: string
}) {
	const [editing, setEditing] = useState(false)
	const [editPoints, setEditPoints] = useState(false)
	const updateItem = useUpdateConductItem(typeId)
	const deleteItem = useDeleteConductItem(typeId)

	return (
		<div className='flex flex-wrap items-center gap-3 py-2 border-b last:border-0'>
			<div className='flex-1 min-w-[120px]'>
				{editing ? (
					<InlineEdit
						value={item.name}
						onSave={(name) => {
							updateItem.mutate(
								{ id: item.id, name },
								{ onSuccess: () => setEditing(false) },
							)
						}}
						onCancel={() => setEditing(false)}
					/>
				) : (
					<span className='text-sm'>{item.name}</span>
				)}
			</div>

			<div className='shrink-0'>
				{editPoints ? (
					<Input
						type='number'
						defaultValue={item.pointDeduction}
						className='h-7 text-xs w-20'
						autoFocus
						onBlur={(e) => {
							updateItem.mutate(
								{
									id: item.id,
									pointDeduction: Number(e.target.value),
								},
								{ onSuccess: () => setEditPoints(false) },
							)
						}}
					/>
				) : (
					<Badge
						variant='destructive'
						className='cursor-pointer'
						onClick={() => setEditPoints(true)}
					>
						-{item.pointDeduction} คะแนน
					</Badge>
				)}
			</div>

			<div className='flex gap-1 shrink-0'>
				<Button
					size='icon'
					variant='ghost'
					className='h-7 w-7'
					onClick={() => setEditing(true)}
				>
					<Pencil className='h-3 w-3' />
				</Button>
				<Button
					size='icon'
					variant='ghost'
					className='h-7 w-7 text-destructive hover:text-destructive'
					onClick={() => deleteItem.mutate(item.id)}
				>
					<Trash2 className='h-3 w-3' />
				</Button>
			</div>
		</div>
	)
}

function AddItemRow({ typeId }: { typeId: string }) {
	const [show, setShow] = useState(false)
	const [name, setName] = useState('')
	const [points, setPoints] = useState(5)
	const createItem = useCreateConductItem(typeId)

	if (!show) {
		return (
			<Button
				variant='ghost'
				size='sm'
				className='mt-2 text-muted-foreground'
				onClick={() => setShow(true)}
			>
				<Plus className='mr-1 h-3 w-3' />
				เพิ่มรายการความผิด
			</Button>
		)
	}

	return (
		<div className='flex flex-wrap items-center gap-2 mt-2'>
			<Input
				placeholder='ชื่อความผิด'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='h-8 text-sm flex-1 min-w-[120px]'
				autoFocus
			/>
			<Input
				type='number'
				placeholder='คะแนน'
				value={points}
				onChange={(e) => setPoints(Number(e.target.value))}
				className='h-8 text-sm w-20'
			/>
			<Button
				size='icon'
				variant='ghost'
				className='h-8 w-8'
				onClick={() => {
					if (!name.trim()) return
					createItem.mutate(
						{ name, pointDeduction: points },
						{
							onSuccess: () => {
								setName('')
								setPoints(5)
								setShow(false)
							},
						},
					)
				}}
			>
				<Check className='h-4 w-4 text-green-600' />
			</Button>
			<Button
				size='icon'
				variant='ghost'
				className='h-8 w-8'
				onClick={() => setShow(false)}
			>
				<X className='h-4 w-4 text-destructive' />
			</Button>
		</div>
	)
}

export function ConductTypeCard({ type }: Props) {
	const [editingName, setEditingName] = useState(false)
	const updateType = useUpdateConductType()
	const deleteType = useDeleteConductType()

	return (
		<Card>
			<CardHeader className='pb-3 flex flex-row items-center justify-between gap-2'>
				<div className='flex-1 min-w-0'>
					{editingName ? (
						<InlineEdit
							value={type.name}
							onSave={(name) => {
								updateType.mutate(
									{ id: type.id, name },
									{ onSuccess: () => setEditingName(false) },
								)
							}}
							onCancel={() => setEditingName(false)}
						/>
					) : (
						<h3 className='font-semibold text-lg'>{type.name}</h3>
					)}
				</div>
				<div className='flex gap-1'>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => setEditingName(true)}
					>
						<Pencil className='h-4 w-4' />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						className='text-destructive hover:text-destructive'
						onClick={() => deleteType.mutate(type.id)}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{type.items.map((item) => (
					<ConductItemRow
						key={item.id}
						item={item}
						typeId={type.id}
					/>
				))}
				<AddItemRow typeId={type.id} />
			</CardContent>
		</Card>
	)
}
