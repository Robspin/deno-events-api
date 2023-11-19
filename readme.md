## deno-events-api

This is a simple api for event logging on top of Deno KV database.

### Quickstart
* Create `.env` from `.env.example`
* Run `deno task dev`

### Endpoints
* `/events - GET` - Get all events
* `/events - POST - { source: string, message: string }` - Create a event

The above routes are protected by an Authorization header with your value found in .env