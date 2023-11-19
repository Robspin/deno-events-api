## deno-events-api

This is a simple api for event logging on top of Deno KV database.

### Quickstart
* Create `.env` from `.env.example`
* Run `deno task dev`

### Endpoints
* `/events - GET` - Get all logs from all events
* `/events - POST - { key: string, event: string }` - Create a event
* `/events/:eventKey - GET` - Get all logs from specific event

The above routes are protected by an Authorization header with your value found in .env