import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { EventLogs, isAuthorized, logEvent, setHeaders } from './helpers.ts'


const port = 8000
const db = await Deno.openKv()
const app = new Application()
const router = new Router()

router.get('/', async (ctx) => {
    ctx.response.body = 'deno events api running... 🦕'
})

router.post('/events', async (ctx) => {
    if (!isAuthorized(ctx)) return

    try {
        const body = ctx.request.body({ type: 'json' });
        const { key, event } = await body.value

        await logEvent(db, key, event)
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = 'something went wrong'
    }

    setHeaders(ctx)
    ctx.response.body = 'event logged'
})

export const getLogs = async (db: Deno.Kv, eventKey: string): Promise<EventLogs> => {
    const kvResponse = await db.get([eventKey])
    const eventLogs: EventLogs = kvResponse.value as EventLogs ?? []

    return eventLogs
}

router.get('/events/:eventKey', async (ctx) => {
    const eventKey = ctx.params.eventKey

    try {
        setHeaders(ctx)
        ctx.response.body = await getLogs(db, eventKey)
    } catch (e) {
        console.error(e)
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
