import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** "YS" monogram favicon, generated at build so there's no binary asset to keep in sync. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090c",
          border: "1px solid #4ade80",
          borderRadius: 7,
          color: "#4ade80",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.5,
        }}
      >
        YS
      </div>
    ),
    size,
  );
}
