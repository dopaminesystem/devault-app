# Community Bookmark Manager

A powerful, community-focused bookmark manager app where users can create spaces, organize links, and manage access via password or Discord roles.

## Features

- **Spaces**: Create dedicated spaces for your community or personal use.
- **Access Control**:
    - **Public**: Accessible by anyone with the link.
    - **Password Protected**: Secure your space with a password.
    - **Discord Gated**: Restrict access to members of specific Discord servers or roles.
- **Smart Bookmarking**:
    - **Metadata Fetching**: Automatically fetches titles, descriptions, and images from URLs.
    - **AI Summaries**: (Coming Soon) AI-powered summaries and auto-categorization.
- **Modern UI**: Built with Shadcn UI and Tailwind CSS for a premium look and feel.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Neon](https://neon.tech/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better-Auth](https://better-auth.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database (Neon recommended)
- Discord Application (for Auth & Gating)
- pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/devault-app.git
    cd devault-app
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="postgresql://..."
    BETTER_AUTH_SECRET="..."
    DISCORD_CLIENT_ID="..."
    DISCORD_CLIENT_SECRET="..."
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  Run database migrations:
    ```bash
    pnpm dlx prisma migrate dev
    ```

5.  Start the development server:
    ```bash
    pnpm dev
    ```

## Roadmap

- [x] Project Initialization
- [ ] Authentication (Better-Auth)
- [ ] Space Management
- [ ] Bookmark Capture & Metadata
- [ ] AI Integration (Future)
