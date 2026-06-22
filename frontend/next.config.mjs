import withPWA from 'next-pwa'

const pwa = withPWA({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: 'res.cloudinary.com' },
			{ hostname: 'lh3.googleusercontent.com' },
		],
	},
}

export default pwa(nextConfig)
