import { env } from './constants.ts'

const authorization = env.DENO_EVENTS_API_AUTHORIZATION

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

export type EventLogs = string[]

export const logEvent = async (db: Deno.Kv, eventKey: string, eventMessage: string) => {
    const kvResponse = await db.get([eventKey])
    const eventLogs: EventLogs = kvResponse.value as EventLogs ?? []

    eventLogs.push(eventMessage)
    if (eventLogs.length > 50) eventLogs.shift()

    await db.set([eventKey], eventLogs)
}