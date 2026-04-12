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
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { appChain, thirdwebClient } from "@/lib/thirdweb";
import type { PublicToken, PublicUser } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";

type TokenBalance = {
  displayValue: string;
  symbol: string;
};

export function WalletServiceScreen() {
  const account = useActiveAccount();
  const { member } = useWalletMember();
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<PublicUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<PublicUser | null>(null);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [tokens, setTokens] = useState<PublicToken[]>([]);
  const deferredSearch = useDeferredValue(searchTerm);

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
    }

    void loadMembers();

    return () => {
      ignore = true;
    };
  }, [account?.address, deferredSearch]);

  const selectedToken = tokens.find((token) => token.contractAddress === selectedTokenAddress) ?? null;

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
      setStatusMessage("Pick a token and a recipient before sending.");
      return;
    }

    if (selectedMember.walletAddress === account.address) {
      setStatusMessage("Sending to your own wallet is blocked in this demo.");
      return;
    }

    setStatusMessage("Sending token...");

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
      setStatusMessage(`Sent ${amount} ${selectedToken.symbol} to ${selectedMember.displayName}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Token transfer failed.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[36px] border border-white/70 bg-white/70 px-5 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
            Wallet service
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">Balances, members, and token send</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/80"
            href="/"
          >
            Back to studio
          </Link>
          <WalletConnectButton />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                Community token list
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink">All issued contracts</h2>
            </div>
            <Badge className="bg-sky/20 text-ink">{tokens.length} tokens</Badge>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-[28px] border border-dashed border-white/80 bg-white/55 p-5 text-sm text-ink/60">
                Loading tokens...
              </div>
            ) : null}

            {tokens.map((token) => (
              <div
                key={token.contractAddress}
                className="rounded-[28px] border border-white/70 bg-white/85 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
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
                        <Image alt="Fallback mascot" height={46} src="/mascot-orbit.svg" width={46} />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-ink">{token.name}</p>
                      <p className="text-sm text-ink/60">
                        {token.symbol} · {shortenAddress(token.contractAddress, 8, 6)}
                      </p>
                      <p className="mt-1 text-xs text-ink/45">
                        by {token.owner?.displayName ?? shortenAddress(token.ownerWallet)} · {formatDate(token.deployedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-bubble px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/45">My balance</p>
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
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  Active wallet
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">
                  {member ? member.displayName : "Connect by phone"}
                </h2>
              </div>
              <ShieldCheck className="h-7 w-7 text-mint" />
            </div>

            <div className="mt-4 rounded-[28px] bg-bubble p-4 text-sm text-ink/70">
              {member ? (
                <>
                  <p>{member.maskedPhone}</p>
                  <p className="mt-2">{shortenAddress(member.walletAddress, 10, 6)}</p>
                  <p className="mt-2 text-xs text-ink/45">
                    Smart account on BSC with sponsored gas enabled.
                  </p>
                </>
              ) : (
                "Phone login is required to fetch balances and send community tokens."
              )}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                Send token
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">Search a member and transfer</h3>
            </div>

            <form className="space-y-4" onSubmit={handleTransfer}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">Token</label>
                <select
                  className="h-12 w-full rounded-3xl border border-white/70 bg-white/85 px-4 text-sm font-medium text-ink outline-none"
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
                <label className="mb-2 block text-sm font-semibold text-ink/70">Member search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <Input
                    className="pl-11"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Display name, phone tail, wallet..."
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
                      <p className="text-sm font-semibold text-ink">{entry.displayName}</p>
                      <p className="mt-1 text-xs text-ink/55">
                        {entry.maskedPhone} · {shortenAddress(entry.walletAddress, 8, 6)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">Amount</label>
                <Input
                  inputMode="decimal"
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={`Available: ${selectedToken ? balances[selectedToken.contractAddress]?.displayValue ?? "0" : "0"}`}
                  value={amount}
                />
              </div>

              {statusMessage ? (
                <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                  {statusMessage}
                </div>
              ) : null}

              <Button className="w-full" disabled={!account || !selectedToken || !selectedMember} type="submit">
                <Send className="mr-2 h-4 w-4" />
                Send token
              </Button>
            </form>
          </Panel>
        </div>
      </section>
    </main>
  );
}
