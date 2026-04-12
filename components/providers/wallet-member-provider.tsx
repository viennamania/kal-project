"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState
} from "react";
import { getUserPhoneNumber } from "thirdweb/wallets/in-app";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus
} from "thirdweb/react";

import { thirdwebClient } from "@/lib/thirdweb";
import type { PublicUser } from "@/lib/types";

type WalletMemberContextValue = {
  member: PublicUser | null;
  refresh: () => Promise<void>;
  status: "idle" | "loading" | "ready";
};

const WalletMemberContext = createContext<WalletMemberContextValue | null>(null);

export function WalletMemberProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const account = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();
  const [member, setMember] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<WalletMemberContextValue["status"]>("idle");

  async function refresh() {
    if (!account?.address || connectionStatus !== "connected") {
      setMember(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");

    try {
      const phone = await getUserPhoneNumber({ client: thirdwebClient }).catch(() => undefined);
      const response = await fetch("/api/users/sync", {
        body: JSON.stringify({
          phone,
          walletAddress: account.address
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to sync member");
      }

      const data = (await response.json()) as { user: PublicUser };
      startTransition(() => {
        setMember(data.user);
        setStatus("ready");
      });
    } catch {
      setStatus("idle");
    }
  }

  useEffect(() => {
    async function syncMember() {
      if (!account?.address || connectionStatus !== "connected") {
        setMember(null);
        setStatus("idle");
        return;
      }

      setStatus("loading");

      try {
        const phone = await getUserPhoneNumber({ client: thirdwebClient }).catch(() => undefined);
        const response = await fetch("/api/users/sync", {
          body: JSON.stringify({
            phone,
            walletAddress: account.address
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Failed to sync member");
        }

        const data = (await response.json()) as { user: PublicUser };
        startTransition(() => {
          setMember(data.user);
          setStatus("ready");
        });
      } catch {
        setStatus("idle");
      }
    }

    void syncMember();
  }, [account?.address, connectionStatus]);

  return (
    <WalletMemberContext.Provider
      value={{
        member,
        refresh,
        status
      }}
    >
      {children}
    </WalletMemberContext.Provider>
  );
}

export function useWalletMember() {
  const context = useContext(WalletMemberContext);

  if (!context) {
    throw new Error("useWalletMember must be used inside WalletMemberProvider");
  }

  return context;
}
