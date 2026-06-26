// import { DefaultSession, DefaultUser } from 'next-auth'
// import { JWT, DefaultJWT } from 'next-auth/jwt'
import type { DefaultSession } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session {
		accessToken: string
		user: {
			id: string
			role: 'ADMIN' | 'TEACHER' | 'VIEWER'
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		accessToken?: string
		user?: {
			id: string
			role: 'ADMIN' | 'TEACHER' | 'VIEWER'
		}
	}
}
