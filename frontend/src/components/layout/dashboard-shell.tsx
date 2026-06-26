'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

interface DashboardShellProps {
	user: {
		name?: string | null
		email?: string | null
		image?: string | null
		role: string
	}
	children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className='flex h-screen bg-slate-50'>
			<Sidebar
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className='flex flex-col flex-1 overflow-hidden'>
				<Header
					user={user}
					onMenuClick={() => setSidebarOpen(true)}
				/>
				<main className='flex-1 overflow-y-auto p-4 sm:p-6'>
					{children}
				</main>
			</div>
		</div>
	)
}
