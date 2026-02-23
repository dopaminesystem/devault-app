import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Devault";
  const description = searchParams.get("description") || "Vault for everyone";
  const type = searchParams.get("type") || "default"; // 'vault' | 'default'

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-100px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          maxWidth: "1000px",
          textAlign: "center",
        }}
      >
        {/* Logo / Brand */}
        {type === "vault" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: "20px",
              marginBottom: "30px",
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Vault Icon"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: type === "vault" ? "64px" : "80px",
            fontWeight: 700,
            color: "#fafafa",
            margin: 0,
            marginBottom: "20px",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#a1a1aa",
            margin: 0,
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {description.length > 120 ? `${description.slice(0, 120)}...` : description}
        </p>

        {/* Footer branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "50px",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "16px", fontWeight: 700 }}>D</span>
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#71717a",
            }}
          >
            devault.app
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
