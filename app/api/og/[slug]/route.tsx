import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Vault OG image generation by slug
// Example: /api/og/hisyam → generates OG for vault "hisyam"
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch vault data from the database via API
  // Note: Edge runtime can't use Prisma directly, so we fetch from a lightweight endpoint
  const baseUrl = request.nextUrl.origin;
  let title = slug;
  let description = "A curated collection of bookmarks";

  try {
    const res = await fetch(`${baseUrl}/api/og/data/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      title = data.name || slug;
      description = data.description || description;
    }
  } catch {
    // Fallback to slug as title
  }

  // Helper to load font from Google Fonts
  async function loadGoogleFont(weight: number) {
    const url = `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&display=swap`;
    const css = await fetch(url, { cache: "force-cache" }).then((res) => res.text());
    const resource = css.match(
      /src: url\(["']?(.+?)["']?\) format\(['"]?(opentype|truetype|woff)['"]?\)/,
    );

    if (resource?.[1]) {
      return fetch(resource[1], { cache: "force-cache" }).then((res) => res.arrayBuffer());
    }
    throw new Error("Failed to load font");
  }

  // Load Geist fonts with aggressive caching
  const [geistBold, geistRegular] = await Promise.all([loadGoogleFont(800), loadGoogleFont(400)]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b", // zinc-950
        backgroundImage: "radial-gradient(circle at 50% 0%, #27272a 0%, #09090b 70%)", // subtle spotlight
        fontFamily: '"Geist", sans-serif',
      }}
    >
      {/* Subtle Grid Background (simulated with CSS) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#18181b 1px, transparent 1px), linear-gradient(90deg, #18181b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.2,
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      />

      {/* Main content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        {/* Vault Icon / Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "100px",
            marginBottom: "40px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            gap: "12px",
          }}
        >
          <div
            style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1" }}
          />
          <span
            style={{ fontSize: "20px", color: "#a1a1aa", fontWeight: 500, letterSpacing: "0.05em" }}
          >
            DEVAULT
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "84px",
            fontWeight: 800,
            margin: 0,
            marginBottom: "24px",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "32px",
            fontWeight: 400,
            color: "#71717a", // zinc-500
            margin: 0,
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </p>
      </div>

      {/* Bottom branding footer */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          opacity: 0.6,
        }}
      >
        <svg
          role="img"
          aria-label="Devault Logo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#71717a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        </svg>
        <span style={{ fontSize: "20px", color: "#71717a", fontWeight: 500 }}>devault.app</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: geistBold,
          style: "normal",
          weight: 800,
        },
        {
          name: "Geist",
          data: geistRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
