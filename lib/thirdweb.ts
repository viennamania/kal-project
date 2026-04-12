import { createThirdwebClient } from "thirdweb";
import { bsc } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";

import { publicEnv } from "@/lib/public-env";

export const appChain = bsc;

export const thirdwebClient = createThirdwebClient({
  clientId: publicEnv.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
});

export const appMetadata = {
  description: "Phone-first BSC token studio for playful product launches.",
  logoUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/mascot-orbit.svg`,
  name: "Kal Token Arcade",
  url: publicEnv.NEXT_PUBLIC_APP_URL
};

export const phoneWallet = inAppWallet({
  auth: {
    allowedSmsCountryCodes: ["KR", "US", "JP", "SG"],
    defaultSmsCountryCode: "KR",
    options: ["phone"]
  },
  executionMode: {
    mode: "EIP4337",
    smartAccount: {
      chain: appChain,
      sponsorGas: true
    }
  },
  hidePrivateKeyExport: true,
  metadata: {
    image: {
      alt: "Kal mascot",
      height: 220,
      src: "/mascot-orbit.svg",
      width: 220
    },
    name: "Kal Token Arcade"
  }
});
