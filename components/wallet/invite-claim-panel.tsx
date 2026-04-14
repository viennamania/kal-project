"use client";

import { useEffect, useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

import { useLocale } from "@/components/providers/locale-provider";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { formatMessage, getIntlLocale } from "@/lib/i18n";
import type { PublicInviteClaim, PublicToken } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";

type TokenBalance = {
  displayValue: string;
  symbol: string;
};

function getInviteStatusLabel(
  inviteClaim: PublicInviteClaim,
  wallet: ReturnType<typeof useLocale>["dictionary"]["wallet"]
) {
  switch (inviteClaim.status) {
    case "cancelled":
      return wallet.inviteStatusCancelled;
    case "delivered":
      return wallet.inviteStatusDelivered;
    case "expired":
      return wallet.inviteStatusExpired;
    case "failed":
      return wallet.inviteStatusFailed;
    case "processing":
      return wallet.inviteStatusProcessing;
    case "pending":
    default:
      return wallet.inviteStatusPending;
  }
}

export function InviteClaimPanel({
  balances,
  tokens
}: {
  balances: Record<string, TokenBalance>;
  tokens: PublicToken[];
}) {
  const account = useActiveAccount();
  const { dictionary, locale } = useLocale();
  const { member, status: memberStatus } = useWalletMember();
  const wallet = dictionary.wallet;
  const intlLocale = getIntlLocale(locale);
  const [amount, setAmount] = useState("");
  const [inviteClaims, setInviteClaims] = useState<PublicInviteClaim[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTokenAddress((current) => current || tokens[0]?.contractAddress || "");
  }, [tokens]);

  useEffect(() => {
    let ignore = false;

    async function loadInviteClaims() {
      if (!account?.address) {
        setInviteClaims([]);
        return;
      }

      setIsLoadingClaims(true);

      try {
        const response = await fetch("/api/invite-claims?limit=6", {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load invite claims");
        }

        const data = (await response.json()) as { inviteClaims: PublicInviteClaim[] };

        if (!ignore) {
          setInviteClaims(data.inviteClaims);
        }
      } catch {
        if (!ignore) {
          setInviteClaims([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingClaims(false);
        }
      }
    }

    void loadInviteClaims();

    return () => {
      ignore = true;
    };
  }, [account?.address]);

  const selectedToken =
    tokens.find((token) => token.contractAddress === selectedTokenAddress) ?? null;
  const availableAmount = selectedToken
    ? balances[selectedToken.contractAddress]?.displayValue ?? "0"
    : "0";

  async function copyShareUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(wallet.inviteCopied);
    } catch {
      setMessage(url);
    }
  }

  async function handleCreateInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account || !member || !selectedToken || !amount.trim() || !phone.trim()) {
      setMessage(wallet.connectRequiredNote);
      return;
    }

    setIsCreating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/invite-claims", {
        body: JSON.stringify({
          amount,
          phone,
          tokenAddress: selectedToken.contractAddress
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      const data = (await response.json()) as {
        code?: string;
        error?: string;
        existingUser?: {
          displayName: string;
          maskedPhone?: string | null;
          walletAddress: string;
        };
        inviteClaim?: PublicInviteClaim;
        shareUrl?: string;
      };

      if (response.status === 409 && data.code === "USER_ALREADY_REGISTERED" && data.existingUser) {
        const contact =
          data.existingUser.maskedPhone ?? shortenAddress(data.existingUser.walletAddress, 8, 6);

        setMessage(
          formatMessage(wallet.inviteExistingMember, {
            contact,
            name: data.existingUser.displayName
          })
        );
        return;
      }

      if (!response.ok || !data.inviteClaim || !data.shareUrl) {
        throw new Error(data.error || wallet.transferFailed);
      }

      setShareUrl(data.shareUrl);
      setInviteClaims((current) => [
        data.inviteClaim!,
        ...current.filter((entry) => entry.id !== data.inviteClaim!.id)
      ]);
      setPhone("");
      setAmount("");
      setMessage(wallet.inviteLinkReady);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : wallet.transferFailed);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Panel className="p-5 sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
          {wallet.inviteEyebrow}
        </p>
        <h3 className="mt-2 font-display text-3xl text-ink">{wallet.inviteTitle}</h3>
        <p className="mt-3 text-sm text-ink/60">{wallet.inviteHint}</p>
      </div>

      <form className="space-y-4" onSubmit={handleCreateInvite}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink/70">
            {wallet.tokenFieldLabel}
          </label>
          <select
            className="h-12 w-full rounded-3xl border border-white/70 bg-white/85 px-4 text-base font-medium text-ink outline-none focus:border-sky focus:ring-4 focus:ring-sky/20 sm:text-sm"
            onChange={(event) => setSelectedTokenAddress(event.target.value)}
            value={selectedTokenAddress}
          >
            {tokens.map((token) => (
              <option key={token.contractAddress} value={token.contractAddress}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink/70">
            {wallet.invitePhoneLabel}
          </label>
          <Input
            inputMode="tel"
            onChange={(event) => setPhone(event.target.value)}
            placeholder={wallet.invitePhonePlaceholder}
            value={phone}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink/70">
            {wallet.amountFieldLabel}
          </label>
          <Input
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            placeholder={formatMessage(wallet.amountPlaceholder, {
              amount: availableAmount
            })}
            value={amount}
          />
        </div>

        {shareUrl ? (
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink/70">
              {wallet.inviteShareLabel}
            </label>
            <div className="flex items-center gap-2 rounded-[24px] border border-white/70 bg-white/80 px-4 py-3">
              <Link2 className="h-4 w-4 shrink-0 text-ink/40" />
              <p className="min-w-0 flex-1 truncate text-sm text-ink/70">{shareUrl}</p>
              <Button onClick={() => void copyShareUrl(shareUrl)} type="button" variant="ghost">
                <Copy className="mr-2 h-4 w-4" />
                {wallet.inviteCopyButton}
              </Button>
            </div>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
            {message}
          </div>
        ) : null}

        <Button
          className="w-full"
          disabled={!account || !member || !selectedToken || !amount.trim() || !phone.trim() || isCreating || memberStatus === "loading"}
          type="submit"
        >
          {isCreating ? wallet.inviteCreating : wallet.inviteCreateButton}
        </Button>
      </form>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/45">
            {wallet.inviteRecentTitle}
          </p>
          {isLoadingClaims ? <span className="text-xs text-ink/45">...</span> : null}
        </div>

        <div className="space-y-2">
          {inviteClaims.map((inviteClaim) => (
            <div
              key={inviteClaim.id}
              className="rounded-[24px] border border-white/70 bg-white/75 px-4 py-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {inviteClaim.amount} {inviteClaim.tokenSymbol}
                  </p>
                  <p className="mt-1 text-xs text-ink/55">
                    {inviteClaim.targetPhoneMasked} · {getInviteStatusLabel(inviteClaim, wallet)}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    {formatDate(inviteClaim.createdAt, intlLocale)}
                  </p>
                </div>
                <Button
                  onClick={() => void copyShareUrl(inviteClaim.shareUrl)}
                  type="button"
                  variant="ghost"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {wallet.inviteCopyButton}
                </Button>
              </div>
            </div>
          ))}

          {inviteClaims.length === 0 && !isLoadingClaims ? (
            <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 px-4 py-3 text-sm text-ink/60">
              {wallet.inviteEmpty}
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
