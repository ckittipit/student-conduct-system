'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Users, BookOpen, Star, Settings } from 'lucide-react'

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

export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside className='w-64 bg-white border-r flex flex-col'>
			<div className='p-6 border-b'>
				<h1 className='font-bold text-lg text-primary'>
					คะแนนความประพฤติ
				</h1>
				<p className='text-xs text-muted-foreground mt-1'>
					ระบบบันทึกพฤติกรรมนักเรียน
				</p>
			</div>
			<nav className='flex-1 p-4 space-y-1'>
				{navItems.map((item) => {
					const Icon = item.icon
					const isActive = pathname === item.href
					return (
						<Link
							key={item.href}
							href={item.href}
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
	)
}
