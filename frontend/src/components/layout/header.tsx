'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Menu } from 'lucide-react'

interface HeaderProps {
	user: {
		name?: string | null
		email?: string | null
		image?: string | null
		role: string
	}
	onMenuClick?: () => void
}

const roleLabel: Record<string, string> = {
	ADMIN: 'ผู้ดูแลระบบ',
	TEACHER: 'ครู',
	VIEWER: 'ผู้ชม',
}

export function Header({ user, onMenuClick }: HeaderProps) {
	return (
		<header className='h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6'>
			<button
				onClick={onMenuClick}
				className='md:hidden text-muted-foreground hover:text-foreground'
				aria-label='เปิดเมนู'
			>
				<Menu className='h-6 w-6' />
			</button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='flex items-center gap-2'
					>
						{user.image && (
							<Image
								src={user.image}
								alt={user.name ?? ''}
								width={32}
								height={32}
								className='rounded-full'
							/>
						)}
						<div className='text-left hidden sm:block'>
							<p className='text-sm font-medium'>{user.name}</p>
							<p className='text-xs text-muted-foreground'>
								{roleLabel[user.role]}
							</p>
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className='text-destructive cursor-pointer'
						onClick={() => signOut({ callbackUrl: '/login' })}
					>
						<LogOut className='mr-2 h-4 w-4' />
						ออกจากระบบ
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}
