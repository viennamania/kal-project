import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  height: 64,
  width: 64
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(180deg, rgba(88,195,255,0.22) 0%, rgba(255,111,168,0.16) 100%)",
          borderRadius: 18,
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
            border: "4px solid rgba(255,255,255,0.82)",
            borderRadius: 999,
            display: "flex",
            height: 40,
            justifyContent: "center",
            position: "relative",
            width: 40
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#1E2451",
              borderRadius: 999,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              height: 18,
              justifyContent: "center",
              width: 18
            }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 999,
                  display: "flex",
                  height: 4,
                  width: 4
                }}
              />
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 999,
                  display: "flex",
                  height: 4,
                  width: 4
                }}
              />
            </div>
            <div
              style={{
                background: "#61E9C6",
                borderRadius: 999,
                display: "flex",
                height: 3,
                width: 10
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
