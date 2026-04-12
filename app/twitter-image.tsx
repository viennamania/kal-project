import { ImageResponse } from "next/og";

import { SiteCardImage } from "@/lib/site-image";

export const alt = "Oasis Token Arcade";
export const contentType = "image/png";
export const size = {
  height: 675,
  width: 1200
};

export default function TwitterImage() {
  return new ImageResponse(
    <SiteCardImage compact subtitle="Phone-first token studio for launching and sending community tokens." />,
    size
  );
}
