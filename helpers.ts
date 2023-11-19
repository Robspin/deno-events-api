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

export type EventLogs = string[]

export const logEvent = async (db: Deno.Kv, eventKey: string, eventMessage: string) => {
    const kvResponse = await db.get(['events', eventKey])
    const eventLogs: EventLogs = kvResponse.value as EventLogs ?? []

    eventLogs.push(eventMessage)
    if (eventLogs.length > 50) eventLogs.shift()

    await db.set(['events', eventKey], eventLogs)
}

export const getLogsByKey = async (db: Deno.Kv, eventKey: string): Promise<EventLogs> => {
    const kvResponse = await db.get(['events', eventKey])
    return kvResponse.value as EventLogs ?? []
}

export type EventLogsIndex = { [index: string]: EventLogs }
export const getAllEventLogs = async (db: Deno.Kv): Promise<EventLogsIndex> => {
    const kvResponse = await db.list({ prefix: ['events'] })

    const formattedResponse: EventLogsIndex = {}

    for await (const entry of kvResponse) {
        formattedResponse[String(entry.key[1])] = entry.value as EventLogs
    }

    return formattedResponse
}

export const errorResponse = (ctx: any, e: any) => {
    console.error(e)
    ctx.response.status = 500
    ctx.response.body = 'something went wrong'
}