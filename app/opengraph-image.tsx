import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FACTS = [
  ["React · TypeScript", "frontend"],
  ["Java · Node · REST", "backend"],
  ["MySQL · MongoDB", "data"],
];

/**
 * Link-preview card. The old site rendered nothing server-side, so shared links
 * had no image and no text — this fixes that at the source.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090c",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Grid + accent wash, matching the site's backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(74,222,128,0.22), rgba(74,222,128,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -180,
            width: 780,
            height: 780,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.18), rgba(34,211,238,0) 68%)",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                borderRadius: 10,
                border: "1px solid rgba(74,222,128,0.5)",
                color: "#4ade80",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              YS
            </div>
            <div
              style={{
                color: "#8b909e",
                fontSize: 20,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(74,222,128,0.35)",
              background: "rgba(74,222,128,0.1)",
              borderRadius: 999,
              padding: "10px 20px",
              color: "#4ade80",
              fontSize: 19,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: "#4ade80",
              }}
            />
            {profile.availableLabel}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#e7e9ee",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              color: "#4ade80",
              fontSize: 34,
              letterSpacing: 1,
            }}
          >
            {profile.role}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              color: "#8b909e",
              fontSize: 25,
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            B.Tech CSE (AI &amp; ML) · building web apps end to end
          </div>
        </div>

        {/* Fact rail */}
        <div
          style={{
            display: "flex",
            gap: 18,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 30,
          }}
        >
          {FACTS.map(([value, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                background: "#0e1015",
                padding: "18px 22px",
              }}
            >
              <div
                style={{
                  color: "#5b606d",
                  fontSize: 16,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              <div style={{ color: "#e7e9ee", fontSize: 24 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
