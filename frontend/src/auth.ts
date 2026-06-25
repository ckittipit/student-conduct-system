import Google from 'next-auth/providers/google'
import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		// work after successful google login - send google token to swap JWT with backend
		// async signIn({ account }) {
		// 	if (account?.provider !== 'google') return false
		// 	return true
		// },

		async jwt({ token, account }) {
			if (account?.access_token) {
				try {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}/auth/google/token`,
						{
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								accessToken: account.access_token,
							}),
						},
					)
					const data = await res.json()
					token.accessToken = data.accessToken
					token.user = data.user
				} catch (e) {
					console.error('token exchange failed:', e)
				}
			}
			return token
		},

		//let session have accessToken and user from backend
		async session({ session, token }) {
			session.accessToken = token.accessToken as string
			session.user = {
				...session.user,
				id: token.user?.id ?? '',
				role: token.user?.role ?? 'TEACHER',
			}
			return session
		},
	},
	pages: {
		signIn: '/login', //redirect to this page when not logged in
	},
})
