export function parseQueryParams<T>(queryString: string): T {
    const params: T = {} as T
    const urlObj = new URL('http://localhost:8787' + queryString)

    urlObj.searchParams.forEach((value, key) => {
        params[key] = value
    })

    return params
}