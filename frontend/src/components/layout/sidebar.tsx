'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Users, BookOpen, Star, Settings, X } from 'lucide-react'

const navItems = [
	{
		href: '/',
		label: 'นักเรียนทั้งหมด',
		icon: Users,
	},
	{
		href: '/conduct-types',
		label: 'ประเภทความผิด',
		icon: BookOpen,
	},
	{
		href: '/bonus',
		label: 'เพิ่มคะแนน',
		icon: Star,
	},
	{
		href: '/settings',
		label: 'ตั้งค่า',
		icon: Settings,
	},
]

interface SidebarProps {
	open?: boolean
	onClose?: () => void
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
	const pathname = usePathname()

	return (
		<>
			{/* Backdrop, mobile/tablet only */}
			{open && (
				<div
					className='fixed inset-0 z-40 bg-black/50 md:hidden'
					onClick={onClose}
				/>
			)}

			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transition-transform duration-200 md:static md:z-auto md:translate-x-0',
					open ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<div className='p-6 border-b flex items-center justify-between'>
					<div>
						<h1 className='font-bold text-lg text-primary'>
							คะแนนความประพฤติ
						</h1>
						<p className='text-xs text-muted-foreground mt-1'>
							ระบบบันทึกพฤติกรรมนักเรียน
						</p>
					</div>
					<button
						onClick={onClose}
						className='md:hidden text-muted-foreground hover:text-foreground'
						aria-label='ปิดเมนู'
					>
						<X className='h-5 w-5' />
					</button>
				</div>
				<nav className='flex-1 p-4 space-y-1'>
					{navItems.map((item) => {
						const Icon = item.icon
						const isActive = pathname === item.href
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onClose}
								className={cn(
									'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
									isActive
										? 'bg-primary text-primary-foreground font-medium'
										: 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
								)}
							>
								<Icon className='h4 w4' />
								{item.label}
							</Link>
						)
					})}
				</nav>
			</aside>
		</>
	)
}
