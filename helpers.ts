import { env } from './constants.ts'

const authorization = env.API_AUTHORIZATION_KEY

export const isAuthorized = (ctx: any) => {
    const requestToken = ctx.request.headers.get('Authorization')
    if (requestToken === authorization) return true
    ctx.response.status = 401
    ctx.response.body = 'unauthorized'
    return false
}

export const setHeaders = (ctx: any) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*")
    ctx.response.headers.set("Cache-Control", "no-cache")
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
}

export type Event = { source: string, message: string, createdAt: string }

export const logEvent = async (db: Deno.Kv, event: Event) => {
    const kvResponse = await db.get(['events'])
    const events: Event[] = kvResponse.value as Event[] ?? []

    events.push(event)

    if (events.length > 50) events.shift()

    await db.set(['events'], events)
}

export const getEvents = async (db: Deno.Kv): Promise<Event[]> => {
    const kvResponse = await db.get(['events'])
    return (kvResponse.value as unknown) as Event[] ?? []
}

export const errorResponse = (ctx: any, e: any) => {
    console.error(e)
    ctx.response.status = 500
    ctx.response.body = 'something went wrong'
}