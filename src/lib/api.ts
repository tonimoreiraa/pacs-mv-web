import axios from 'axios'

const api = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL
})

export function catchApiErrorMessage(error: any) {
    console.error(error)
    if (!error.response) return error.message
    const res = error.response.data
    if (!res) {
        return 'Falha ao se conectar.'
    }
    if (res.message) {
        return res.message
    }
    if (res.errors) {
        return res.errors
            .map((e: any) => (e.field ? e.field + ': ' : '') + e.message)
            .reduce((x: string, y: string) => x + ' ' + y, [])
    }
    return res
}

export default api;
