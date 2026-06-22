const API_URL = process.env.NEXT_PUBLIC_API_URL

//Wrapper รอบ fetch - ใส่ Authorization header อัตโนมัติ
export async function apiClient<T>(
	endpoint: string,
	options: RequestInit & { token?: string } = {},
): Promise<T> {
	const { token, ...fetchOptions } = options
	const res = await fetch(`${API_URL}${endpoint}`, {
		...fetchOptions,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...fetchOptions.headers,
		},
	})

	if (!res.ok) {
		const error = await res.json().catch(() => ({}))
		throw new Error(error.message || `HTTP ${res.status}`)
	}

	return res.json()
}
