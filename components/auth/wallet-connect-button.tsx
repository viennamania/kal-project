"use client";

import { ConnectButton, lightTheme } from "thirdweb/react";

import { useLocale } from "@/components/providers/locale-provider";
import { getThirdwebLocale } from "@/lib/i18n";
import { publicEnv } from "@/lib/public-env";
import { appChain, phoneWallet, thirdwebClient } from "@/lib/thirdweb";

export function WalletConnectButton() {
  const { dictionary, locale } = useLocale();
  const connect = dictionary.connect;

  return (
    <ConnectButton
      appMetadata={{
        description: connect.appDescription,
        logoUrl: "/mascot-orbit.svg",
        name: dictionary.common.brand,
        url: publicEnv.NEXT_PUBLIC_APP_URL
      }}
      autoConnect={{ timeout: 15000 }}
      chain={appChain}
      client={thirdwebClient}
      connectButton={{
        className:
          "!rounded-full !bg-[#1E2451] !px-5 !py-3 !text-sm !font-semibold !text-white !shadow-[0_18px_32px_rgba(30,36,81,0.22)]"
      }}
      connectModal={{
        showThirdwebBranding: false,
        size: "wide",
        title: connect.modalTitle,
        welcomeScreen: {
          subtitle: connect.welcomeSubtitle,
          title: connect.welcomeTitle,
          img: {
            src: "/mascot-orbit.svg",
            width: 200,
            height: 200
          }
        }
      }}
      detailsButton={{
        className:
          "!rounded-full !border !border-white/70 !bg-white/85 !px-4 !py-2 !text-sm !font-semibold !text-[#1E2451] !shadow-[0_12px_22px_rgba(30,36,81,0.08)]"
      }}
      detailsModal={{
        hideSendFunds: true
      }}
      locale={getThirdwebLocale(locale)}
      theme={lightTheme({
        colors: {
          accentButtonBg: "#1E2451",
          accentButtonText: "#ffffff",
          borderColor: "#d9e7ff",
          connectedButtonBg: "#ffffff",
          connectedButtonBgHover: "#f8fbff",
          modalBg: "#fdfcff",
          primaryButtonBg: "#FF6FA8",
          primaryButtonText: "#ffffff",
          secondaryButtonBg: "#eef7ff",
          secondaryButtonText: "#1E2451",
          separatorLine: "#e4efff",
          skeletonBg: "#eef7ff",
          success: "#0ea969",
          tertiaryBg: "#ffffff",
          tooltipBg: "#1E2451",
          tooltipText: "#ffffff"
        }
      })}
      wallets={[phoneWallet]}
    />
  );
}
