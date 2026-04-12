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
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { formatMessage, getIntlLocale } from "@/lib/i18n";
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
  const { dictionary, locale } = useLocale();
  const { member, status: memberStatus } = useWalletMember();
  const [communityTokens, setCommunityTokens] = useState<PublicToken[]>([]);
  const [form, setForm] = useState<StudioForm>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const home = dictionary.home;
  const nav = dictionary.nav;
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
      setFormError(home.emptyWalletError);
      return;
    }

    if (!form.image) {
      setFormError(home.emptyImageError);
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
        throw new Error(home.imageUploadFailed);
      }

      const uploadPayload = (await uploadResponse.json()) as { url: string };

      const contractAddress = await deployERC20Contract({
        account,
        chain: appChain,
        client: thirdwebClient,
        params: {
          description:
            form.description ||
            formatMessage(home.defaultDescriptionTemplate, {
              brand: common.brand,
              name: form.name.trim()
            }),
          // Pass the original file to thirdweb so it uploads directly to storage
          // instead of trying to re-download a freshly created external Blob URL.
          image: form.image,
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
        throw new Error(home.tokenSaveFailed);
      }

      const latest = await fetch("/api/tokens", { cache: "no-store" });
      const latestPayload = (await latest.json()) as { tokens: PublicToken[] };

      setCommunityTokens(latestPayload.tokens);
      setSuccessMessage(
        formatMessage(home.deploySuccess, {
          address: shortenAddress(contractAddress, 8, 6)
        })
      );
      setForm(initialForm);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(null);
    } catch (error) {
      setFormError(
        error instanceof Error && error.message
          ? error.message
          : home.tokenDeployFallbackError
      );
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
              <Image alt={common.mascotAlt} height={44} src="/mascot-orbit.svg" width={44} />
            </div>
            <div>
              <p className="font-display text-2xl text-ink">{common.brand}</p>
              <p className="text-sm text-ink/65">{home.heroDescription}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <Link
              className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/80"
              href="/wallet"
            >
              {nav.walletService}
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
                <Badge className="bg-mint/30 text-ink">{home.studioTag}</Badge>
                <Badge className="bg-sky/25 text-ink">{home.networkTag}</Badge>
                <Badge className="bg-peach/45 text-ink">{home.gasSponsoredTag}</Badge>
              </div>

              <div className="max-w-xl">
                <h1 className="font-display text-5xl leading-none text-ink sm:text-6xl">
                  {home.heroTitle}
                </h1>
                <p className="mt-4 text-base leading-7 text-ink/70">{home.heroDescription}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
                    {home.communityStatLabel}
                  </p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {isLoading ? "..." : formatCompact(communityTokens.length, intlLocale)}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">{home.communityStatCaption}</p>
                </Panel>
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
                    {home.membersStatLabel}
                  </p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {isLoading ? "..." : formatCompact(uniqueMembers, intlLocale)}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">{home.membersStatCaption}</p>
                </Panel>
                <Panel className="bg-bubble">
                  <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
                    {home.mineStatLabel}
                  </p>
                  <p className="mt-3 font-display text-4xl text-ink">
                    {account ? myTokens.length : 0}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">{home.mineStatCaption}</p>
                </Panel>
              </div>

              <Panel className="flex items-center justify-between gap-4 bg-gradient-to-r from-white to-sky/10">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {member
                      ? formatMessage(home.launchReadyTitleLoggedIn, {
                          name: member.displayName
                        })
                      : home.launchReadyTitleLoggedOut}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {member
                      ? formatMessage(home.launchReadyBodyLoggedIn, {
                          address: shortenAddress(member.walletAddress, 8, 6),
                          phone: member.maskedPhone ?? ""
                        })
                      : home.launchReadyBodyLoggedOut}
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
                  {home.studioEyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">{home.studioTitle}</h2>
              </div>
              <Stars className="h-6 w-6 text-candy" />
            </div>

            <form className="space-y-4" onSubmit={handleDeploy}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    {home.nameFieldLabel}
                  </label>
                  <Input
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder={home.nameFieldPlaceholder}
                    required
                    value={form.name}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    {home.symbolFieldLabel}
                  </label>
                  <Input
                    maxLength={12}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, symbol: event.target.value }))
                    }
                    placeholder={home.symbolFieldPlaceholder}
                    required
                    value={form.symbol}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    {home.descriptionFieldLabel}
                  </label>
                  <Textarea
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder={home.descriptionFieldPlaceholder}
                    value={form.description}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink/70">
                    {home.initialSupplyFieldLabel}
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
                    {home.smartAccountHint}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {home.imageFieldLabel}
                </label>
                <label className="flex cursor-pointer items-center gap-4 rounded-[28px] border border-dashed border-candy/35 bg-candy/10 p-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-white">
                    {imagePreview ? (
                      <Image
                        alt={common.tokenPreviewAlt}
                        className="h-full w-full object-cover"
                        height={96}
                        src={imagePreview}
                        width={96}
                      />
                    ) : (
                      <Image
                        alt={common.uploadMascotAlt}
                        height={54}
                        src="/mascot-orbit.svg"
                        width={54}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{home.imageFieldHint}</p>
                    <p className="mt-1 text-sm text-ink/60">{home.imageFieldStorageHint}</p>
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

              <Button
                className="w-full"
                disabled={isDeploying || memberStatus === "loading"}
                type="submit"
              >
                {isDeploying ? home.deployingButton : home.deployButton}
              </Button>
            </form>
          </Panel>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
              {home.boardTitle}
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
                          <Image
                            alt={common.fallbackMascotAlt}
                            height={42}
                            src="/mascot-orbit.svg"
                            width={42}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{token.name}</p>
                        <p className="text-sm text-ink/60">
                          {token.symbol} · {shortenAddress(token.contractAddress, 8, 6)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-ink/50">
                      {home.boardSavedPrefix}
                      {formatDate(token.deployedAt, intlLocale)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/80 bg-white/55 p-5 text-sm text-ink/60">
                  {home.boardEmpty}
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  {home.communityLaunchesEyebrow}
                </p>
                <h3 className="mt-2 font-display text-3xl text-ink">
                  {home.communityLaunchesTitle}
                </h3>
              </div>
              <Link
                className="text-sm font-semibold text-ink/70 underline-offset-4 hover:underline"
                href="/wallet"
              >
                {home.openWalletService}
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
                        <Image
                          alt={common.fallbackMascotAlt}
                          height={48}
                          src="/mascot-orbit.svg"
                          width={48}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-ink">{token.name}</p>
                      <p className="text-sm text-ink/60">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-ink/65">
                    <p>
                      {home.ownerLabel}:{" "}
                      {token.owner?.displayName ?? shortenAddress(token.ownerWallet)}
                    </p>
                    <p>
                      {home.supplyLabel}: {token.supply}
                    </p>
                    <p>
                      {home.launchedLabel}: {formatDate(token.deployedAt, intlLocale)}
                    </p>
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
