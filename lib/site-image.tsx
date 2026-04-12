const palette = {
  bubble: "#F5FAFF",
  candy: "#FF6FA8",
  ink: "#1E2451",
  mint: "#61E9C6",
  peach: "#FFD787",
  sky: "#58C3FF"
} as const;

type SiteCardImageProps = {
  compact?: boolean;
  subtitle?: string;
  title?: string;
};

function MascotFace({ compact = false }: { compact?: boolean }) {
  const orbSize = compact ? 220 : 280;
  const faceSize = compact ? 92 : 116;
  const eyeSize = compact ? 16 : 20;
  const mouthWidth = compact ? 50 : 62;

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: orbSize,
        justifyContent: "center",
        position: "relative",
        width: orbSize
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(88,195,255,0.2) 0%, rgba(255,111,168,0.16) 100%)",
          borderRadius: 48,
          display: "flex",
          filter: "blur(10px)",
          height: orbSize,
          position: "absolute",
          width: orbSize
        }}
      />

      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(180deg, #FFE19E 0%, #FFF9E7 100%)",
          border: "10px solid rgba(255,255,255,0.72)",
          borderRadius: 999,
          display: "flex",
          height: compact ? 180 : 228,
          justifyContent: "center",
          position: "relative",
          width: compact ? 180 : 228
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: palette.ink,
            borderRadius: 999,
            display: "flex",
            flexDirection: "column",
            gap: compact ? 14 : 18,
            height: faceSize,
            justifyContent: "center",
            width: faceSize
          }}
        >
          <div
            style={{
              display: "flex",
              gap: compact ? 14 : 18
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 999,
                display: "flex",
                height: eyeSize,
                width: eyeSize
              }}
            />
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 999,
                display: "flex",
                height: eyeSize,
                width: eyeSize
              }}
            />
          </div>

          <div
            style={{
              background: palette.mint,
              borderRadius: 999,
              display: "flex",
              height: compact ? 10 : 12,
              width: mouthWidth
            }}
          />
        </div>

        <div
          style={{
            background: palette.sky,
            borderRadius: 999,
            display: "flex",
            height: compact ? 28 : 34,
            left: compact ? 16 : 20,
            position: "absolute",
            top: compact ? 34 : 42,
            width: compact ? 28 : 34
          }}
        />
        <div
          style={{
            background: palette.candy,
            borderRadius: 999,
            bottom: compact ? 18 : 22,
            display: "flex",
            height: compact ? 36 : 48,
            position: "absolute",
            right: compact ? 16 : 22,
            width: compact ? 36 : 48
          }}
        />
        <div
          style={{
            background: palette.mint,
            borderRadius: 999,
            display: "flex",
            height: compact ? 18 : 24,
            position: "absolute",
            right: compact ? 36 : 46,
            top: compact ? 28 : 36,
            width: compact ? 18 : 24
          }}
        />
      </div>
    </div>
  );
}

export function SiteCardImage({
  compact = false,
  subtitle = "Phone-first token studio and wallet service",
  title = "Oasis Token Arcade"
}: SiteCardImageProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        background:
          "radial-gradient(circle at 12% 18%, rgba(88,195,255,0.22), transparent 28%), radial-gradient(circle at 84% 16%, rgba(255,111,168,0.18), transparent 24%), radial-gradient(circle at 82% 82%, rgba(97,233,198,0.18), transparent 20%), linear-gradient(180deg, #FDFEFF 0%, #FFF7F2 100%)",
        color: palette.ink,
        display: "flex",
        fontFamily:
          'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        height: "100%",
        padding: compact ? "52px" : "64px",
        width: "100%"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(255,255,255,0.86)",
          borderRadius: compact ? 34 : 42,
          boxShadow: "0 20px 60px rgba(39,84,153,0.12)",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: compact ? "38px 40px" : "46px 48px",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: compact ? "68%" : "62%"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: compact ? 18 : 24
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12
              }}
            >
              {[
                { bg: "rgba(97,233,198,0.28)", label: "Studio Open" },
                { bg: "rgba(88,195,255,0.24)", label: "Phone Login" },
                { bg: "rgba(255,215,135,0.5)", label: "Gas Support" }
              ].map((badge) => (
                <div
                  key={badge.label}
                  style={{
                    alignItems: "center",
                    background: badge.bg,
                    borderRadius: 999,
                    color: palette.ink,
                    display: "flex",
                    fontSize: compact ? 18 : 20,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    padding: compact ? "10px 16px" : "12px 18px"
                  }}
                >
                  {badge.label}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: compact ? 16 : 18
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: compact ? 78 : 92,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.94
                }}
              >
                <span>{title}</span>
              </div>

              <div
                style={{
                  color: "rgba(30,36,81,0.7)",
                  display: "flex",
                  fontSize: compact ? 26 : 31,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.34,
                  maxWidth: compact ? "92%" : "84%"
                }}
              >
                {subtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex"
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: palette.bubble,
                borderRadius: 999,
                display: "flex",
                gap: 14,
                padding: "16px 22px"
              }}
            >
              <div
                style={{
                  background: palette.mint,
                  borderRadius: 999,
                  display: "flex",
                  height: 12,
                  width: 12
                }}
              />
              <div
                style={{
                  color: "rgba(30,36,81,0.72)",
                  display: "flex",
                  fontSize: compact ? 20 : 22,
                  fontWeight: 700
                }}
              >
                Playful token launching for communities
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minWidth: compact ? 260 : 320
          }}
        >
          <MascotFace compact={compact} />
        </div>
      </div>
    </div>
  );
}
