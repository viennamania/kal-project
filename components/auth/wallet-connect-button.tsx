"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut, Phone, ShieldCheck } from "lucide-react";
import {
  AutoConnect,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
  useDisconnect
} from "thirdweb/react";

import { PhoneConnectModal } from "@/components/auth/phone-connect-modal";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useLocale } from "@/components/providers/locale-provider";
import { publicEnv } from "@/lib/public-env";
import { appChain, phoneWallet, thirdwebClient } from "@/lib/thirdweb";
import { shortenAddress } from "@/lib/utils";

export function WalletConnectButton() {
  const { dictionary } = useLocale();
  const { member, status: memberStatus } = useWalletMember();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const { disconnect } = useDisconnect();
  const connect = dictionary.connect;
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const appMetadata = {
    description: connect.appDescription,
    logoUrl: "/mascot-orbit.svg",
    name: dictionary.common.brand,
    url: publicEnv.NEXT_PUBLIC_APP_URL
  };

  useEffect(() => {
    if (connectionStatus !== "connected") {
      setIsConfirmOpen(false);
      setDisconnectError(null);
      setIsDisconnecting(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      setIsConnectOpen(false);
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
      await fetch("/api/auth/logout", {
        method: "POST"
      }).catch(() => undefined);
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
        <AutoConnect
          appMetadata={appMetadata}
          chain={appChain}
          client={thirdwebClient}
          timeout={15000}
          wallets={[phoneWallet]}
        />
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
      <>
        <AutoConnect
          appMetadata={appMetadata}
          chain={appChain}
          client={thirdwebClient}
          timeout={15000}
          wallets={[phoneWallet]}
        />
        <div className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-ink/70 shadow-[0_12px_22px_rgba(30,36,81,0.08)]">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {connect.connectingStatus}
        </div>
      </>
    );
  }

  return (
    <>
      <AutoConnect
        appMetadata={appMetadata}
        chain={appChain}
        client={thirdwebClient}
        timeout={15000}
        wallets={[phoneWallet]}
      />
      <Button className="min-h-12 sm:min-h-0" onClick={() => setIsConnectOpen(true)} type="button">
        <Phone className="mr-2 h-4 w-4" />
        {connect.connectButtonLabel}
      </Button>
      <PhoneConnectModal
        onClose={() => setIsConnectOpen(false)}
        open={isConnectOpen}
      />
    </>
  );
}
