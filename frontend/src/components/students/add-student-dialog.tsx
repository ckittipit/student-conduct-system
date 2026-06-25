'use client'

import {
	useForm,
	type ControllerRenderProps,
	type FieldValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateStudent } from '@/hooks/use-students'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
	studentCode: z.string().min(1, 'กรุณาใส่รหัสนักเรียน'),
	firstName: z.string().min(1, 'กรุณาใส่ชื่อ'),
	lastName: z.string().min(1, 'กรุณาใส่นามสกุล'),
	currentGrade: z.enum(['M1', 'M2', 'M3', 'M4', 'M5', 'M6']),
})

type FormValues = z.infer<typeof schema>

interface Props {
	open: boolean
	onClose: () => void
}

export function AddStudentDialog({ open, onClose }: Props) {
	const createStudent = useCreateStudent()
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			studentCode: '',
			firstName: '',
			lastName: '',
			currentGrade: 'M1',
		},
	})

	const onSubmit = (values: FormValues) => {
		createStudent.mutate(values, {
			onSuccess: () => {
				form.reset()
				onClose()
			},
		})
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>เพิ่มนักเรียนใหม่</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='studentCode'
							render={({
								field,
							}: {
								field: ControllerRenderProps<FormValues, any>
							}) => (
								<FormItem>
									<FormLabel>รหัสนักเรียน</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='grid grid-cols-2 gap-3'>
							<FormField
								control={form.control}
								name='firstName'
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										FormValues,
										any
									>
								}) => (
									<FormItem>
										<FormLabel>ชื่อ</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='lastName'
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										FormValues,
										any
									>
								}) => (
									<FormItem>
										<FormLabel>นามสกุล</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name='currentGrade'
							render={({
								field,
							}: {
								field: ControllerRenderProps<FormValues, any>
							}) => (
								<FormItem>
									<FormLabel>ชั้น</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{[
												'M1',
												'M2',
												'M3',
												'M4',
												'M5',
												'M6',
											].map((g) => (
												<SelectItem
													key={g}
													value={g}
												>
													ม.{g.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={onClose}
							>
								ยกเลิก
							</Button>
							<Button
								type='submit'
								disabled={createStudent.isPending}
							>
								{createStudent.isPending
									? 'กำลังบันทึก...'
									: 'บันทึก'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
