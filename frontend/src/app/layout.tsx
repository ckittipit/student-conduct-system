import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import React from 'react'

const notoSansThai = Noto_Sans_Thai({
	subsets: ['thai', 'latin'],
	weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
	title: 'ระบบคะแนนความประพฤติ',
	description: 'ระบบบันทึกคะแนนความประพฤตินักเรียน',
	manifest: '/manifest.json',
}

export const viewport: Viewport = {
	themeColor: '#1e40af',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='th'>
			<body className={notoSansThai.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
