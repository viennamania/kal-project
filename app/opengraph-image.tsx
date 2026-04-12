import { ImageResponse } from "next/og";

import { SiteCardImage } from "@/lib/site-image";

export const alt = "Oasis Token Arcade";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200
};

export default function OpenGraphImage() {
  return new ImageResponse(
    <SiteCardImage subtitle="Create playful community tokens and manage phone-first wallets in one bright studio." />,
    size
  );
}
