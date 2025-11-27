import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("No user found. Please sign up first.");
        return;
    }

    const vault = await prisma.vault.create({
        data: {
            name: "Demo Vault",
            slug: "demo-vault",
            ownerId: user.id,
            accessType: "PUBLIC",
            categories: {
                create: {
                    name: "Resources",
                    bookmarks: {
                        create: [
                            {
                                url: "https://nextjs.org",
                                title: "Next.js",
                                description: "The React Framework for the Web",
                                image: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
                            },
                            {
                                url: "https://ui.shadcn.com",
                                title: "Shadcn UI",
                                description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
                                image: "https://ui.shadcn.com/og.jpg",
                            },
                        ],
                    },
                },
            },
        },
    });

    console.log("Created vault:", vault);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
