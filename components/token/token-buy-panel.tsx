"use client";

import { BuyWidget, useActiveWallet } from "thirdweb/react";

import { appChain, thirdwebClient } from "@/lib/thirdweb";

export function TokenBuyPanel({
  description,
  image,
  receiverAddress,
  title,
  tokenAddress
}: {
  description: string;
  image?: string | null;
  receiverAddress: `0x${string}`;
  title: string;
  tokenAddress: `0x${string}`;
}) {
  const activeWallet = useActiveWallet();

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-3">
      <BuyWidget
        activeWallet={activeWallet ?? undefined}
        amount="20"
        chain={appChain}
        client={thirdwebClient}
        country="KR"
        currency="USD"
        description={description}
        image={image ?? undefined}
        paymentMethods={["crypto", "card"]}
        presetOptions={[10, 30, 50]}
        receiverAddress={receiverAddress}
        showThirdwebBranding={false}
        theme="light"
        title={title}
        tokenAddress={tokenAddress}
      />
    </div>
  );
}
