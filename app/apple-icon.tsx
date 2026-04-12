import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  height: 180,
  width: 180
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 20%, rgba(88,195,255,0.22), transparent 32%), radial-gradient(circle at 82% 18%, rgba(255,111,168,0.18), transparent 28%), linear-gradient(180deg, #FDFEFF 0%, #FFF7F2 100%)",
          borderRadius: 42,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(180deg, #FFE19E 0%, #FFF8E4 100%)",
            border: "10px solid rgba(255,255,255,0.78)",
            borderRadius: 999,
            display: "flex",
            height: 112,
            justifyContent: "center",
            position: "relative",
            width: 112
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#1E2451",
              borderRadius: 999,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              height: 48,
              justifyContent: "center",
              width: 48
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 999,
                  display: "flex",
                  height: 8,
                  width: 8
                }}
              />
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 999,
                  display: "flex",
                  height: 8,
                  width: 8
                }}
              />
            </div>

            <div
              style={{
                background: "#61E9C6",
                borderRadius: 999,
                display: "flex",
                height: 6,
                width: 26
              }}
            />
          </div>

          <div
            style={{
              background: "#58C3FF",
              borderRadius: 999,
              display: "flex",
              height: 18,
              left: 14,
              position: "absolute",
              top: 26,
              width: 18
            }}
          />
          <div
            style={{
              background: "#FF6FA8",
              borderRadius: 999,
              bottom: 14,
              display: "flex",
              height: 24,
              position: "absolute",
              right: 14,
              width: 24
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
