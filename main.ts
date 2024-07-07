import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import {
    errorResponse,
    getEvents,
    isAuthorized,
    logEvent,
    setHeaders
} from './helpers.ts'
import { Event } from './helpers.ts'

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
        const { source, message, sendNotification } = await body.value
        const event: Event = {
            source,
            message,
            sendNotification: sendNotification ?? false,
            createdAt: new Date().toISOString()
        }

        await logEvent(db, event)
    } catch (e) {
        errorResponse(ctx, e)
    }

    setHeaders(ctx)
    ctx.response.body = 'event logged'
})


router.get('/events', async (ctx) => {
    if (!isAuthorized(ctx)) return
    try {
        ctx.response.body = await getEvents(db)
    } catch (e) {
        errorResponse(ctx, e)
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
