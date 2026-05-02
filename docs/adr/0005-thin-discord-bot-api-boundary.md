# Keep Discord bot as a thin API adapter

The Discord bot will remain a thin adapter that turns Discord interactions into authenticated API requests. It should not write to the database directly or own resource publishing rules, curator checks, channel policies, or schema logic.

The current bot already follows this direction by calling the web-hosted `/api/discord/save` endpoint. Future monorepo work should share request schemas and contracts with the bot, and a future Hono API can replace the web-hosted endpoint without changing the bot's role.
