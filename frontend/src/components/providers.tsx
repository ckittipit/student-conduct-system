'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
	//create QueryClient in state to let each user get their own instance
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60, //cache 1 minute
						retry: 1, //retry for 1 time if error
					},
				},
			}),
	)

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</SessionProvider>
	)
}
