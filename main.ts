import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import {
    errorResponse,
    getAllEventLogs,
    getLogsByKey,
    isAuthorized,
    logEvent,
    setHeaders
} from './helpers.ts'


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
        errorResponse(ctx, e)
    }

    setHeaders(ctx)
    ctx.response.body = 'event logged'
})


router.get('/events', async (ctx) => {
    if (!isAuthorized(ctx)) return
    try {
        ctx.response.body = await getAllEventLogs(db)
    } catch (e) {
        errorResponse(ctx, e)
    }
})

router.get('/events/:eventKey', async (ctx) => {
    if (!isAuthorized(ctx)) return
    const eventKey = ctx.params.eventKey

    try {
        setHeaders(ctx)
        ctx.response.body = await getLogsByKey(db, eventKey)
    } catch (e) {
        errorResponse(ctx, e)
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
