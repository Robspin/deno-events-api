import { Application, Router } from "https://deno.land/x/oak/mod.ts"

const port = 8000
// const db = await Deno.openKv()
const app = new Application()
const router = new Router()

const setHeaders = (ctx: any) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*")
    ctx.response.headers.set("Cache-Control", "no-cache")
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
}

router.get('/', async (ctx) => {
    ctx.response.body = 'deno views api running... 🦕'
})

router.get('/events', async (ctx) => {
    ctx.response.body = 'events'
    setHeaders(ctx)

})

router.get('/events/:id', async (ctx) => {
    ctx.response.body = 'events'
    setHeaders(ctx)
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
