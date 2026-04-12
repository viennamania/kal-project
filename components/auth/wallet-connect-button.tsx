"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import {
  ConnectButton,
  lightTheme,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
  useDisconnect
} from "thirdweb/react";

import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { getThirdwebLocale } from "@/lib/i18n";
import { publicEnv } from "@/lib/public-env";
import { appChain, phoneWallet, thirdwebClient } from "@/lib/thirdweb";
import { shortenAddress } from "@/lib/utils";

export function WalletConnectButton() {
  const { dictionary, locale } = useLocale();
  const { member, status: memberStatus } = useWalletMember();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const { disconnect } = useDisconnect();
  const connect = dictionary.connect;
  const [disconnectError, setDisconnectError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    if (connectionStatus !== "connected") {
      setIsConfirmOpen(false);
      setDisconnectError(null);
      setIsDisconnecting(false);
    }
  }, [connectionStatus]);

  async function handleDisconnect() {
    if (!activeWallet) {
      setIsConfirmOpen(false);
      return;
    }

    setDisconnectError(null);
    setIsDisconnecting(true);

    try {
      await disconnect(activeWallet);
      setIsConfirmOpen(false);
    } catch (error) {
      setDisconnectError(
        error instanceof Error && error.message ? error.message : connect.disconnectDescription
      );
    } finally {
      setIsDisconnecting(false);
    }
  }

  if (connectionStatus === "connected" && account) {
    const primaryLabel = member?.displayName ?? connect.connectedStatus;
    const secondaryLabel =
      memberStatus === "loading"
        ? connect.connectingStatus
        : [member?.maskedPhone, shortenAddress(account.address, 7, 5)].filter(Boolean).join(" · ");

    return (
      <>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:items-center">
          <div className="min-w-0 rounded-[28px] border border-white/75 bg-white/85 px-4 py-3 shadow-[0_14px_28px_rgba(30,36,81,0.08)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">
              <span className="h-2.5 w-2.5 rounded-full bg-mint" />
              {connect.connectedStatus}
            </div>
            <div className="mt-2 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-mint text-ink">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{primaryLabel}</p>
                <p className="mt-0.5 break-all text-xs text-ink/55 sm:break-normal">
                  {secondaryLabel}
                </p>
                <p className="mt-1 text-xs text-ink/45">{connect.connectedHint}</p>
              </div>
            </div>
          </div>

          <Button
            className="min-h-12 sm:min-h-0"
            onClick={() => setIsConfirmOpen(true)}
            type="button"
            variant="ghost"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {connect.disconnectButton}
          </Button>
        </div>

        <ConfirmDialog
          eyebrow={connect.connectedStatus}
          cancelLabel={connect.disconnectCancel}
          confirmLabel={isDisconnecting ? connect.disconnectingStatus : connect.disconnectConfirm}
          description={disconnectError ?? connect.disconnectDescription}
          isPending={isDisconnecting}
          onClose={() => {
            if (!isDisconnecting) {
              setDisconnectError(null);
              setIsConfirmOpen(false);
            }
          }}
          onConfirm={handleDisconnect}
          open={isConfirmOpen}
          title={connect.disconnectTitle}
        />
      </>
    );
  }

  if (connectionStatus === "connecting") {
    return (
      <div className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-ink/70 shadow-[0_12px_22px_rgba(30,36,81,0.08)]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {connect.connectingStatus}
      </div>
    );
  }

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
          "!min-h-12 !rounded-full !bg-[#1E2451] !px-5 !py-3 !text-base !font-semibold !text-white !shadow-[0_18px_32px_rgba(30,36,81,0.22)] sm:!text-sm"
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
