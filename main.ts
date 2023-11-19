import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { isAuthorized, setHeaders } from './helpers.ts'


const port = 8000
const db = await Deno.openKv()
const app = new Application()
const router = new Router()


type EventLog = string[]

const logEvent = async (eventKey: string, eventMessage: string) => {
    const kvResponse = await db.get([eventKey])
    const eventLog: EventLog = kvResponse.value as EventLog ?? []

    eventLog.push(eventMessage)
    if (eventLog.length > 50) eventLog.shift()

    await db.set([eventKey], eventLog)
}

router.get('/', async (ctx) => {
    ctx.response.body = 'deno events api running... 🦕'
})

router.post('/events', async (ctx) => {
    if (!isAuthorized(ctx)) return

    try {
        const body = ctx.request.body({ type: 'json' });
        const { key, event } = await body.value

        await logEvent(key, event)
    } catch (e) {
        console.error(e)
        ctx.response.status = 500
        ctx.response.body = 'something went wrong'
    }

    setHeaders(ctx)
    ctx.response.body = 'event logged'
})

router.get('/events/:id', async (ctx) => {
    ctx.response.body = 'events'
    setHeaders(ctx)
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
