"use client";

import { ThirdwebProvider } from "thirdweb/react";

import { WalletMemberProvider } from "@/components/providers/wallet-member-provider";

export function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider>
      <WalletMemberProvider>{children}</WalletMemberProvider>
    </ThirdwebProvider>
  );
}
