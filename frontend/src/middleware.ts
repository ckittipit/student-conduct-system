export { auth as middleware } from '@/auth'

export const config = {
	//protect every route except this
	matcher: [
		'/((?!api|_next/static|_next/image|icons|manifest.json|login).*)',
	],
}
