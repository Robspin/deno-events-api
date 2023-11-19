import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts"

const localEnv = await load()

export const env = {
    DENO_EVENTS_API_AUTHORIZATION: localEnv.DENO_EVENTS_API_AUTHORIZATION || Deno.env.get('DENO_EVENTS_API_AUTHORIZATION')
}
