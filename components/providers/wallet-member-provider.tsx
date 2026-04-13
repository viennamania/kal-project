"use client";

import {
  createContext,
  startTransition,
  useCallback,
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

  const ensureSession = useCallback(async (walletAddress: string) => {
    const sessionResponse = await fetch("/api/auth/session", {
      cache: "no-store"
    });

    if (sessionResponse.ok) {
      const session = (await sessionResponse.json()) as { address: string };

      if (session.address.toLowerCase() === walletAddress.toLowerCase()) {
        return;
      }
    }

    const challengeResponse = await fetch("/api/auth/challenge", {
      body: JSON.stringify({
        address: walletAddress
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!challengeResponse.ok) {
      throw new Error("Failed to create auth challenge");
    }

    const challenge = (await challengeResponse.json()) as { message: string };
    const signature = await account?.signMessage({
      message: challenge.message
    });

    if (!signature) {
      throw new Error("Failed to sign auth challenge");
    }

    const verifyResponse = await fetch("/api/auth/session", {
      body: JSON.stringify({
        address: walletAddress,
        signature
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!verifyResponse.ok) {
      throw new Error("Failed to establish auth session");
    }
  }, [account]);

  const syncMember = useCallback(async () => {
    if (!account?.address || connectionStatus !== "connected") {
      setMember(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");

    try {
      await ensureSession(account.address);
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
      setMember(null);
      setStatus("idle");
    }
  }, [account, connectionStatus, ensureSession]);

  const refresh = useCallback(async () => {
    await syncMember();
  }, [syncMember]);

  useEffect(() => {
    void syncMember();
  }, [syncMember]);

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
