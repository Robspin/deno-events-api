import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts"

const localEnv = await load()

export const env = {
    API_AUTHORIZATION_KEY: localEnv.API_AUTHORIZATION_KEY || Deno.env.get('API_AUTHORIZATION_KEY'),
    NTFY_CHANNEL: localEnv.NTFY_CHANNEL || Deno.env.get('NTFY_CHANNEL')
}
