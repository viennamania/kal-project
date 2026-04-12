"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { deployERC20Contract } from "thirdweb/deploys";
import { getContract, sendTransaction, waitForReceipt } from "thirdweb";
import { mintTo } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { Sparkles, Stars, Wallet2 } from "lucide-react";

import { WalletConnectButton } from "@/components/auth/wallet-connect-button";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { appChain, thirdwebClient } from "@/lib/thirdweb";
import type { PublicToken } from "@/lib/types";
import { formatCompact, formatDate, shortenAddress } from "@/lib/utils";

type StudioForm = {
  description: string;
  image: File | null;
  name: string;
  supply: string;
  symbol: string;
};

const initialForm: StudioForm = {
  description: "",
  image: null,
  name: "",
  supply: "",
  symbol: ""
};

export function HomeScreen() {
  const account = useActiveAccount();
  const { member, status: memberStatus } = useWalletMember();
  const [communityTokens, setCommunityTokens] = useState<PublicToken[]>([]);
  const [form, setForm] = useState<StudioForm>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadTokens() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/tokens", { cache: "no-store" });
        const data = (await response.json()) as { tokens: PublicToken[] };

        if (!ignore) {
          setCommunityTokens(data.tokens);
        }
      } catch {
        if (!ignore) {
          setCommunityTokens([]);
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
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const myTokens = communityTokens.filter((token) => token.ownerWallet === account?.address);
  const uniqueMembers = new Set(communityTokens.map((token) => token.ownerWallet)).size;

  async function handleImagePick(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm((current) => ({ ...current, image: selected }));
    setImagePreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleDeploy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account) {
      setFormError("Phone wallet must be connected before deployment.");
      return;
    }

    if (!form.image) {
      setFormError("Token art is required.");
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    setIsDeploying(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", form.image);

      const uploadResponse = await fetch("/api/upload-image", {
        body: uploadFormData,
        method: "POST"
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed.");
      }

      const uploadPayload = (await uploadResponse.json()) as { url: string };

      const contractAddress = await deployERC20Contract({
        account,
        chain: appChain,
        client: thirdwebClient,
        params: {
          description: form.description || `${form.name} token launched from Kal Token Arcade`,
          image: uploadPayload.url,
          name: form.name.trim(),
          symbol: form.symbol.trim().toUpperCase()
        },
        type: "TokenERC20"
      });

      const contract = getContract({
        address: contractAddress,
        chain: appChain,
        client: thirdwebClient
      });

      const mintTransaction = mintTo({
        amount: form.supply,
        contract,
        to: account.address
      });

      const mintResult = await sendTransaction({
        account,
        transaction: mintTransaction
      });

      await waitForReceipt({
        chain: appChain,
        client: thirdwebClient,
        transactionHash: mintResult.transactionHash
      });

      const saveResponse = await fetch("/api/tokens", {
        body: JSON.stringify({
          chainId: appChain.id,
          contractAddress,
          imageUrl: uploadPayload.url,
          mintTxHash: mintResult.transactionHash,
          name: form.name.trim(),
          ownerWallet: account.address,
          supply: form.supply,
          symbol: form.symbol.trim().toUpperCase()
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!saveResponse.ok) {
        throw new Error("Contract saved onchain but database sync failed.");
      }

      const latest = await fetch("/api/tokens", { cache: "no-store" });
      const latestPayload = (await latest.json()) as { tokens: PublicToken[] };

      setCommunityTokens(latestPayload.tokens);
      setSuccessMessage(`Token deployed at ${shortenAddress(contractAddress, 8, 6)}.`);
      setForm(initialForm);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Token deployment failed.");
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[36px] border border-white/70 bg-white/70 px-5 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-sky to-candy shadow-soft">
              <Image alt="Kal mascot" height={44} src="/mascot-orbit.svg" width={44} />
            </div>
            <div>
              <p className="font-display text-2xl text-ink">Kal Token Arcade</p>
              <p className="text-sm text-ink/65">
                Phone-first ERC20 launcher with smart accounts on BSC
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/80"
              href="/wallet"
            >
              Wallet service
            </Link>
            <WalletConnectButton />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel className="relative overflow-hidden p-8">
            <div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-candy/20 blur-3xl" />
            <div className="absolute bottom-6 left-6 h-32 w-32 rounded-full bg-mint/20 blur-3xl" />

            <div className="relative flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-mint/30 text-ink">studio live</Badge>
                <Badge className="bg-sky/25 text-ink">BSC mainnet</Badge>
                <Badge className="bg-peach/45 text-ink">gas sponsored</Badge>
              </div>

              <div className="max-w-xl">
                <h1 className="font-display text-5xl leading-none text-ink sm:text-6xl">
                  Launch bright little tokens with one phone tap.
                </h1>
                <p className="mt-4 text-base leading-7 text-ink/70">
                  Every member logs in by phone, receives a sponsored smart account, uploads token
                  art to Vercel Blob, and stores contracts in Atlas MongoDB for the community
                  wallet hub.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Community</p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {isLoading ? "..." : formatCompact(communityTokens.length)}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">issued token contracts</p>
                </Panel>
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Members</p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {isLoading ? "..." : formatCompact(uniqueMembers)}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">smart accounts onboarded</p>
                </Panel>
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Mine</p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {account ? myTokens.length : 0}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">contracts launched from your wallet</p>
                </Panel>
              </div>

              <Panel className="flex items-center justify-between gap-4 bg-gradient-to-r from-white to-sky/10">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {member
                      ? `${member.displayName} is ready to ship`
                      : "Phone connect unlocks your wallet studio"}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {member
                      ? `${member.maskedPhone} · ${shortenAddress(member.walletAddress, 8, 6)}`
                      : "Only phone login is enabled. Smart account gas is sponsored automatically."}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
                  {member ? <Sparkles className="h-6 w-6" /> : <Wallet2 className="h-6 w-6" />}
                </div>
              </Panel>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  ERC20 Studio
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">Create a BSC token</h2>
              </div>
              <Stars className="h-6 w-6 text-candy" />
            </div>

            <form className="space-y-4" onSubmit={handleDeploy}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">Name</label>
                  <Input
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Candy Rangers"
                    required
                    value={form.name}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">Symbol</label>
                  <Input
                    maxLength={12}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, symbol: event.target.value }))
                    }
                    placeholder="RANG"
                    required
                    value={form.symbol}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    Description
                  </label>
                  <Textarea
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="A playful community token for the next launch campaign."
                    value={form.description}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    Initial supply
                  </label>
                  <Input
                    inputMode="decimal"
                    onChange={(event) =>
                      setForm((current) => ({ ...current, supply: event.target.value }))
                    }
                    placeholder="1000000"
                    required
                    value={form.supply}
                  />
                  <div className="mt-3 rounded-[28px] border border-dashed border-sky/40 bg-sky/10 p-3 text-xs text-ink/60">
                    Minted directly to your connected smart account after deployment.
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">Token art</label>
                <label className="flex cursor-pointer items-center gap-4 rounded-[28px] border border-dashed border-candy/35 bg-candy/10 p-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-white">
                    {imagePreview ? (
                      <Image
                        alt="Token preview"
                        className="h-full w-full object-cover"
                        height={96}
                        src={imagePreview}
                        width={96}
                      />
                    ) : (
                      <Image alt="Upload mascot" height={54} src="/mascot-orbit.svg" width={54} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">PNG, JPG, WEBP up to 4MB</p>
                    <p className="mt-1 text-sm text-ink/60">
                      Stored in Vercel Blob and reused across studio + wallet service.
                    </p>
                  </div>
                  <input accept="image/*" className="hidden" onChange={handleImagePick} type="file" />
                </label>
              </div>

              {formError ? (
                <div className="rounded-3xl border border-candy/30 bg-candy/10 px-4 py-3 text-sm text-ink">
                  {formError}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-3xl border border-mint/30 bg-mint/15 px-4 py-3 text-sm text-ink">
                  {successMessage}
                </div>
              ) : null}

              <Button className="w-full" disabled={isDeploying || memberStatus === "loading"} type="submit">
                {isDeploying ? "Deploying token..." : "Deploy token on BSC"}
              </Button>
            </form>
          </Panel>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
              Your launch board
            </p>
            <div className="mt-4 space-y-3">
              {account && myTokens.length > 0 ? (
                myTokens.slice(0, 4).map((token) => (
                  <div
                    key={token.contractAddress}
                    className="rounded-[28px] border border-white/70 bg-white/85 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-bubble">
                        {token.imageUrl ? (
                          <Image
                            alt={token.name}
                            className="h-full w-full object-cover"
                            height={56}
                            src={token.imageUrl}
                            width={56}
                          />
                        ) : (
                          <Image alt="Fallback mascot" height={42} src="/mascot-orbit.svg" width={42} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{token.name}</p>
                        <p className="text-sm text-ink/60">
                          {token.symbol} · {shortenAddress(token.contractAddress, 8, 6)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-ink/50">Saved to Atlas · {formatDate(token.deployedAt)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/80 bg-white/55 p-5 text-sm text-ink/60">
                  Your first launch will appear here once you deploy a token.
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  Community launches
                </p>
                <h3 className="mt-2 font-display text-3xl text-ink">Fresh tokens from members</h3>
              </div>
              <Link className="text-sm font-semibold text-ink/70 underline-offset-4 hover:underline" href="/wallet">
                Open wallet service
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {communityTokens.slice(0, 6).map((token) => (
                <div
                  key={token.contractAddress}
                  className="group rounded-[28px] border border-white/70 bg-white/85 p-4 transition hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
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
                        <Image alt="Fallback mascot" height={48} src="/mascot-orbit.svg" width={48} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-ink">{token.name}</p>
                      <p className="text-sm text-ink/60">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-ink/65">
                    <p>Owner: {token.owner?.displayName ?? shortenAddress(token.ownerWallet)}</p>
                    <p>Supply: {token.supply}</p>
                    <p>Launched: {formatDate(token.deployedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </section>
    </main>
  );
}
