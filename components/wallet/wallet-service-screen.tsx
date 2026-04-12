"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  startTransition,
  useDeferredValue,
  useEffect,
  useState
} from "react";
import { getContract, sendTransaction, waitForReceipt } from "thirdweb";
import { getBalance, transfer } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { Search, Send, ShieldCheck } from "lucide-react";

import { WalletConnectButton } from "@/components/auth/wallet-connect-button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { formatMessage, getIntlLocale } from "@/lib/i18n";
import { appChain, thirdwebClient } from "@/lib/thirdweb";
import type { PublicToken, PublicUser } from "@/lib/types";
import { formatAmount, formatDate, shortenAddress } from "@/lib/utils";

type TokenBalance = {
  displayValue: string;
  symbol: string;
};

export function WalletServiceScreen() {
  const account = useActiveAccount();
  const { dictionary, locale } = useLocale();
  const { member } = useWalletMember();
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [members, setMembers] = useState<PublicUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<PublicUser | null>(null);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [tokens, setTokens] = useState<PublicToken[]>([]);
  const deferredSearch = useDeferredValue(searchTerm);
  const home = dictionary.home;
  const nav = dictionary.nav;
  const wallet = dictionary.wallet;
  const common = dictionary.common;
  const intlLocale = getIntlLocale(locale);

  useEffect(() => {
    let ignore = false;

    async function loadTokens() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/tokens", { cache: "no-store" });
        const data = (await response.json()) as { tokens: PublicToken[] };

        if (!ignore) {
          setTokens(data.tokens);
          setSelectedTokenAddress((current) => current || data.tokens[0]?.contractAddress || "");
        }
      } catch {
        if (!ignore) {
          setTokens([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadTokens();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadBalances() {
      if (!account?.address || tokens.length === 0) {
        setBalances({});
        return;
      }

      const entries = await Promise.all(
        tokens.map(async (token) => {
          try {
            const contract = getContract({
              address: token.contractAddress,
              chain: appChain,
              client: thirdwebClient
            });
            const balance = await getBalance({ address: account.address, contract });

            return [
              token.contractAddress,
              {
                displayValue: balance.displayValue,
                symbol: balance.symbol
              }
            ] as const;
          } catch {
            return [
              token.contractAddress,
              {
                displayValue: "0",
                symbol: token.symbol
              }
            ] as const;
          }
        })
      );

      if (!ignore) {
        setBalances(Object.fromEntries(entries));
      }
    }

    void loadBalances();

    return () => {
      ignore = true;
    };
  }, [account?.address, tokens]);

  useEffect(() => {
    let ignore = false;

    async function loadMembers() {
      try {
        const query = deferredSearch.trim();
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=8`, {
          cache: "no-store"
        });
        const data = (await response.json()) as { users: PublicUser[] };

        if (!ignore) {
          startTransition(() => {
            setMembers(data.users.filter((user) => user.walletAddress !== account?.address));
          });
        }
      } catch {
        if (!ignore) {
          setMembers([]);
        }
      }
    }

    void loadMembers();

    return () => {
      ignore = true;
    };
  }, [account?.address, deferredSearch]);

  const selectedToken =
    tokens.find((token) => token.contractAddress === selectedTokenAddress) ?? null;
  const availableAmount = selectedToken
    ? balances[selectedToken.contractAddress]?.displayValue ?? "0"
    : "0";

  async function refreshBalances() {
    if (!account?.address || tokens.length === 0) {
      return;
    }

    const entries = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.contractAddress,
          chain: appChain,
          client: thirdwebClient
        });
        const balance = await getBalance({ address: account.address, contract });

        return [
          token.contractAddress,
          {
            displayValue: balance.displayValue,
            symbol: balance.symbol
          }
        ] as const;
      })
    );

    setBalances(Object.fromEntries(entries));
  }

  async function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account || !selectedToken || !selectedMember) {
      setStatusMessage(wallet.pickRecipientError);
      return;
    }

    if (selectedMember.walletAddress === account.address) {
      setStatusMessage(wallet.selfTransferError);
      return;
    }

    setIsSending(true);
    setStatusMessage(wallet.sendInProgress);

    try {
      const contract = getContract({
        address: selectedToken.contractAddress,
        chain: appChain,
        client: thirdwebClient
      });

      const transaction = transfer({
        amount,
        contract,
        to: selectedMember.walletAddress
      });

      const result = await sendTransaction({
        account,
        transaction
      });

      await waitForReceipt({
        chain: appChain,
        client: thirdwebClient,
        transactionHash: result.transactionHash
      });

      await refreshBalances();
      setAmount("");
      setStatusMessage(
        formatMessage(wallet.sendSuccess, {
          amount,
          name: selectedMember.displayName,
          symbol: selectedToken.symbol
        })
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error && error.message ? error.message : wallet.transferFailed
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 px-4 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-[36px] sm:px-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
            {wallet.headerEyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{wallet.headerTitle}</h1>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <LanguageSwitcher />
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink/80 sm:min-h-0 sm:py-2"
            href="/"
          >
            {nav.backToStudio}
          </Link>
          <WalletConnectButton />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {wallet.tokenListEyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink">{wallet.tokenListTitle}</h2>
            </div>
            <Badge className="bg-sky/20 text-ink">
              {formatAmount(tokens.length, intlLocale)} {wallet.tokenCountSuffix}
            </Badge>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-[28px] border border-dashed border-white/80 bg-white/55 p-5 text-sm text-ink/60">
                {wallet.loadingTokens}
              </div>
            ) : null}

            {!isLoading && tokens.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/80 bg-white/55 p-5 text-sm text-ink/60">
                {wallet.emptyTokens}
              </div>
            ) : null}

            {tokens.map((token) => (
              <div
                key={token.contractAddress}
                className="rounded-[28px] border border-white/70 bg-white/85 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] bg-bubble">
                      {token.imageUrl ? (
                        <Image
                          alt={token.name}
                          className="h-full w-full object-cover"
                          height={64}
                          src={token.imageUrl}
                          width={64}
                        />
                      ) : (
                        <Image
                          alt={common.fallbackMascotAlt}
                          height={46}
                          src="/mascot-orbit.svg"
                          width={46}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-ink">{token.name}</p>
                      <p className="break-all text-sm text-ink/60 sm:break-normal">
                        {token.symbol} · {shortenAddress(token.contractAddress, 8, 6)}
                      </p>
                      <p className="mt-1 break-words text-xs text-ink/45">
                        {home.ownerLabel}:{" "}
                        {token.owner?.displayName ?? shortenAddress(token.ownerWallet)}
                      </p>
                      <p className="mt-1 text-xs text-ink/45">
                        {home.launchedLabel}: {formatDate(token.deployedAt, intlLocale)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-[24px] bg-bubble px-4 py-3 text-left sm:w-auto sm:text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      {wallet.myBalanceLabel}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-ink">
                      {account ? balances[token.contractAddress]?.displayValue ?? "0" : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  {wallet.activeWalletEyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">
                  {member ? member.displayName : wallet.activeWalletLoggedOut}
                </h2>
              </div>
              <ShieldCheck className="h-7 w-7 shrink-0 text-mint" />
            </div>

            <div className="mt-4 rounded-[28px] bg-bubble p-4 text-sm text-ink/70">
              {member ? (
                <>
                  {member.maskedPhone ? <p>{member.maskedPhone}</p> : null}
                  <p className={`${member.maskedPhone ? "mt-2" : ""} break-all`}>
                    {shortenAddress(member.walletAddress, 10, 6)}
                  </p>
                  <p className="mt-2 text-xs text-ink/45">{wallet.smartAccountNote}</p>
                </>
              ) : (
                wallet.connectRequiredNote
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {wallet.sendEyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">{wallet.sendTitle}</h3>
            </div>

            <form className="space-y-4" onSubmit={handleTransfer}>
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
                  {wallet.searchFieldLabel}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <Input
                    className="pl-11"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={wallet.searchFieldPlaceholder}
                    value={searchTerm}
                  />
                </div>

                <div className="mt-3 space-y-2">
                  {members.map((entry) => (
                    <button
                      key={entry.walletAddress}
                      className={`w-full rounded-[24px] border px-4 py-3 text-left transition ${
                        selectedMember?.walletAddress === entry.walletAddress
                          ? "border-mint bg-mint/15"
                          : "border-white/70 bg-white/75"
                      }`}
                      onClick={() => setSelectedMember(entry)}
                      type="button"
                    >
                      <p className="break-words text-sm font-semibold text-ink">{entry.displayName}</p>
                      <p className="mt-1 break-all text-xs text-ink/55 sm:break-normal">
                        {entry.maskedPhone} · {shortenAddress(entry.walletAddress, 8, 6)}
                      </p>
                    </button>
                  ))}

                  {members.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 px-4 py-3 text-sm text-ink/60">
                      {wallet.emptyMembers}
                    </div>
                  ) : null}
                </div>
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

              {statusMessage ? (
                <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                  {statusMessage}
                </div>
              ) : null}

              <Button
                className="w-full"
                disabled={!account || !selectedToken || !selectedMember || !amount.trim() || isSending}
                type="submit"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? wallet.sendInProgress : wallet.sendButton}
              </Button>
            </form>
          </Panel>
        </div>
      </section>
    </main>
  );
}
