'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateStudent } from '@/hooks/use-students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
	studentCode: z.string().min(1, 'กรุณากรอกรหัสนักเรียน'),
	name: z.string().min(1, 'กรุณากรอกชื่อ'),
	gradeLevel: z.string().min(1, 'กรุณาเลือกระดับชั้น'),
	classroom: z.string().min(1, 'กรุณากรอกห้อง'),
})

type FormData = z.infer<typeof schema>

const GRADE_OPTIONS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']

export default function CreateStudentPage() {
	const router = useRouter()
	const createStudent = useCreateStudent()

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			studentCode: '',
			name: '',
			gradeLevel: '',
			classroom: '',
		},
	})

	const onSubmit = async (data: FormData) => {
		try {
			await createStudent.mutateAsync(data)
			router.push('/students')
		} catch {
			// error handled by mutation
		}
	}

	return (
		<div className='max-w-lg mx-auto'>
			<Card>
				<CardHeader>
					<CardTitle>เพิ่มนักเรียน</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'
						>
							<FormField
								control={form.control}
								name='studentCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel>รหัสนักเรียน</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ชื่อ-นามสกุล</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='gradeLevel'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ระดับชั้น</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='เลือกระดับชั้น' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{GRADE_OPTIONS.map((g) => (
													<SelectItem
														key={g}
														value={g}
													>
														{g}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='classroom'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ห้อง</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='เช่น 1/1'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex gap-2 pt-2'>
								<Button
									type='button'
									variant='outline'
									className='flex-1'
									onClick={() => router.back()}
								>
									ยกเลิก
								</Button>
								<Button
									type='submit'
									className='flex-1'
									disabled={createStudent.isPending}
								>
									{createStudent.isPending
										? 'กำลังบันทึก...'
										: 'บันทึก'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
