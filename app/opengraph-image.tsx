import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "88px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#a3a3a3",
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          Full-Stack Developer
        </div>
        <div style={{ display: "flex", fontSize: 80, fontWeight: 700 }}>
          Axel Villanueva
        </div>
        <div
          style={{
            color: "#d4d4d4",
            display: "flex",
            fontSize: 32,
            marginTop: 28,
          }}
        >
          React, Node &amp; Cloud
        </div>
      </div>
    ),
    size,
  );
}
