# Keep web on managed hosting and run small services on limited VPS

Devault will keep the web application as a full-stack Next.js app on managed hosting while product-market fit and monetization are still early. The repository should still be structured so the web app, shared contracts, Discord bot, and future workers can be separated later.

Because the available VPS has limited resources, it should run small long-lived services such as the Discord bot and future background workers, not the whole web application yet. This keeps product iteration fast while allowing Dockerized bot or worker deployment when needed.
