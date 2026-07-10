import { ImageResponse } from "next/og";
import { ACADEMY_NAME } from "@/config/branding";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 64,
          background: "linear-gradient(135deg, #060814 0%, #120f2f 45%, #0d2740 100%)",
          color: "white",
          fontFamily: "Orbitron",
        }}
      >
        <div style={{ fontSize: 24, color: "#67e8f9", marginBottom: 20, letterSpacing: 4, textTransform: "uppercase" }}>
          Nexus Orbit Academy
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          Learn Aerospace, AI & Space Technology
        </div>
        <div style={{ fontSize: 28, color: "#d1d5db" }}>
          Future-ready STEM education for ambitious explorers.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
