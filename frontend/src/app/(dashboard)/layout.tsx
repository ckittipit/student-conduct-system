import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import React from 'react'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	if (!session) redirect('/login')

	return <DashboardShell user={session.user}>{children}</DashboardShell>
}
