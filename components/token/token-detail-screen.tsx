"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { ArrowUpRight, Coins, ExternalLink, Gift, ShieldCheck, Sparkles } from "lucide-react";

import { WalletConnectButton } from "@/components/auth/wallet-connect-button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { AppLocale } from "@/lib/i18n";
import type { PublicCampaign, PublicRewardLog, PublicToken, PublicTransferLog } from "@/lib/types";
import { formatAmount, formatDate, shortenAddress } from "@/lib/utils";

type TokenDetailScreenProps = {
  campaigns: PublicCampaign[];
  rewardLogs: PublicRewardLog[];
  token: PublicToken;
  transferLogs: PublicTransferLog[];
};

const TokenBuyPanel = dynamic(
  () => import("@/components/token/token-buy-panel").then((module) => module.TokenBuyPanel),
  {
    loading: () => (
      <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 text-sm text-ink/60">
        Loading buy options...
      </div>
    ),
    ssr: false
  }
);

const copyByLocale: Record<
  AppLocale,
  {
    activityEmpty: string;
    activityEyebrow: string;
    activityInsightLabel: string;
    activityLocalLabel: string;
    activityTitle: string;
    backToWallet: string;
    buyConnectedDescription: string;
    buyEyebrow: string;
    buyLoggedOutDescription: string;
    buyTitle: string;
    campaignEmpty: string;
    campaignEyebrow: string;
    campaignTitle: string;
    connectToBuy: string;
    descriptionFallback: string;
    explorerAction: string;
    manageAction: string;
    ownerLabel: string;
    buyUnavailableBody: string;
    buyUnavailableTitle: string;
    receiveHint: string;
    sendAction: string;
    statusDraft: string;
    statusEnded: string;
    statusLive: string;
    summaryEyebrow: string;
    summaryTitle: string;
  }
> = {
  ko: {
    activityEmpty: "아직 표시할 최근 활동이 없습니다.",
    activityEyebrow: "최근 활동",
    activityInsightLabel: "온체인 동기화",
    activityLocalLabel: "앱 기록",
    activityTitle: "전송과 보상 기록",
    backToWallet: "지갑 서비스로",
    buyConnectedDescription: "카드 결제나 보유 자산으로 이 토큰을 바로 받을 수 있습니다.",
    buyEyebrow: "구매하기",
    buyLoggedOutDescription: "구매를 시작하려면 먼저 전화번호 지갑을 연결해 주세요.",
    buyTitle: "이 토큰 받기",
    campaignEmpty: "아직 시작된 캠페인이 없습니다.",
    campaignEyebrow: "이벤트",
    campaignTitle: "운영 중인 캠페인",
    connectToBuy: "지갑을 연결하면 구매 위젯이 열립니다.",
    descriptionFallback: "아직 등록된 토큰 설명이 없습니다.",
    explorerAction: "BscScan 보기",
    manageAction: "운영 센터",
    ownerLabel: "운영 지갑",
    buyUnavailableBody:
      "이 토큰은 아직 구매 경로가 준비되지 않았습니다. 유동성이나 지원 경로가 연결되면 여기에서 바로 구매할 수 있게 열립니다.",
    buyUnavailableTitle: "구매 지원 준비 중",
    receiveHint: "구매가 완료되면 현재 연결된 지갑으로 바로 들어옵니다.",
    sendAction: "회원에게 보내기",
    statusDraft: "준비중",
    statusEnded: "종료",
    statusLive: "진행중",
    summaryEyebrow: "토큰 상세",
    summaryTitle: "커뮤니티 토큰 소개"
  },
  en: {
    activityEmpty: "No recent activity is available yet.",
    activityEyebrow: "Recent activity",
    activityInsightLabel: "On-chain sync",
    activityLocalLabel: "App log",
    activityTitle: "Transfer and reward history",
    backToWallet: "Back to wallet",
    buyConnectedDescription: "Buy this token directly with a card or supported crypto.",
    buyEyebrow: "Buy",
    buyLoggedOutDescription: "Connect your phone wallet before opening the buy flow.",
    buyTitle: "Get this token",
    campaignEmpty: "No campaigns are running yet.",
    campaignEyebrow: "Campaigns",
    campaignTitle: "Live community programs",
    connectToBuy: "Connect a wallet to open the buy widget.",
    descriptionFallback: "No token description has been added yet.",
    explorerAction: "View on BscScan",
    manageAction: "Manage center",
    ownerLabel: "Owner wallet",
    buyUnavailableBody:
      "This token does not have a live buy route yet. The widget will appear here after liquidity and routing are ready.",
    buyUnavailableTitle: "Buy support is coming soon",
    receiveHint: "Purchased tokens are delivered to the wallet you are using now.",
    sendAction: "Send to a member",
    statusDraft: "Draft",
    statusEnded: "Ended",
    statusLive: "Live",
    summaryEyebrow: "Token details",
    summaryTitle: "Community token profile"
  },
  ja: {
    activityEmpty: "まだ表示できる最近の活動はありません。",
    activityEyebrow: "最近の活動",
    activityInsightLabel: "オンチェーン同期",
    activityLocalLabel: "アプリ記録",
    activityTitle: "送信と報酬の履歴",
    backToWallet: "ウォレットサービスへ",
    buyConnectedDescription: "カード決済や保有資産から、このトークンをすぐ受け取れます。",
    buyEyebrow: "購入",
    buyLoggedOutDescription: "購入を始めるには、先に電話番号ウォレットを接続してください。",
    buyTitle: "このトークンを受け取る",
    campaignEmpty: "まだ開始されたキャンペーンはありません。",
    campaignEyebrow: "キャンペーン",
    campaignTitle: "進行中のコミュニティ企画",
    connectToBuy: "ウォレットを接続すると購入ウィジェットが開きます。",
    descriptionFallback: "まだトークン説明は登録されていません。",
    explorerAction: "BscScanで見る",
    manageAction: "運営センター",
    ownerLabel: "運営ウォレット",
    buyUnavailableBody:
      "このトークンはまだ購入ルートが準備されていません。流動性や対応ルートが整うと、ここで購入できるようになります。",
    buyUnavailableTitle: "購入サポート準備中",
    receiveHint: "購入が完了すると、今使っているウォレットにすぐ届きます。",
    sendAction: "メンバーに送る",
    statusDraft: "準備中",
    statusEnded: "終了",
    statusLive: "進行中",
    summaryEyebrow: "トークン詳細",
    summaryTitle: "コミュニティトークン紹介"
  },
  "zh-CN": {
    activityEmpty: "暂时还没有可显示的近期活动。",
    activityEyebrow: "近期活动",
    activityInsightLabel: "链上同步",
    activityLocalLabel: "应用记录",
    activityTitle: "转账与奖励记录",
    backToWallet: "前往钱包服务",
    buyConnectedDescription: "你可以直接用银行卡或现有加密资产购买这个代币。",
    buyEyebrow: "购买",
    buyLoggedOutDescription: "开始购买前，请先连接手机号钱包。",
    buyTitle: "获取这个代币",
    campaignEmpty: "还没有正在进行的活动。",
    campaignEyebrow: "活动",
    campaignTitle: "进行中的社区活动",
    connectToBuy: "连接钱包后即可打开购买组件。",
    descriptionFallback: "暂时还没有填写代币说明。",
    explorerAction: "在 BscScan 查看",
    manageAction: "运营中心",
    ownerLabel: "运营钱包",
    buyUnavailableBody:
      "这个代币暂时还没有可用的购买路径。等流动性和路由准备好后，这里会直接开放购买。",
    buyUnavailableTitle: "购买功能准备中",
    receiveHint: "购买完成后，代币会直接进入你当前连接的钱包。",
    sendAction: "发送给会员",
    statusDraft: "准备中",
    statusEnded: "已结束",
    statusLive: "进行中",
    summaryEyebrow: "代币详情",
    summaryTitle: "社区代币简介"
  }
};

export function TokenDetailScreen({
  campaigns,
  rewardLogs,
  token,
  transferLogs
}: TokenDetailScreenProps) {
  const account = useActiveAccount();
  const { dictionary, locale } = useLocale();
  const intlLocale =
    locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "zh-CN" ? "zh-CN" : "en-US";
  const copy = copyByLocale[locale];
  const canBuyWithWidget = token.buyEnabled === true;

  const recentActivity = useMemo(() => {
      const transferItems = transferLogs.map((log) => ({
        id: `transfer-${log.id}`,
        type: "transfer" as const,
        createdAt: log.createdAt,
        title: `${formatAmount(log.amount, intlLocale)} ${token.symbol}`,
        detail: `${shortenAddress(log.fromWallet, 8, 4)} → ${shortenAddress(log.toWallet, 8, 4)}`,
        sourceLabel: log.source === "insight" ? copy.activityInsightLabel : copy.activityLocalLabel
      }));

    const rewardItems = rewardLogs.map((log) => ({
      id: `reward-${log.id}`,
      type: "reward" as const,
      createdAt: log.createdAt,
      title: `${formatAmount(log.amount, intlLocale)} ${token.symbol}`,
      detail:
        log.reason === "attendance"
          ? "Attendance reward"
          : log.reason === "mission"
            ? "Mission reward"
            : log.reason === "referral"
              ? "Referral reward"
              : "Reward log"
    }));

    return [...transferItems, ...rewardItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [copy.activityInsightLabel, copy.activityLocalLabel, intlLocale, rewardLogs, token.symbol, transferLogs]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 px-4 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-[36px] sm:px-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
            {copy.summaryEyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{copy.summaryTitle}</h1>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <LanguageSwitcher />
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink/80 sm:min-h-0 sm:py-2"
            href="/wallet"
          >
            {copy.backToWallet}
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink/80 sm:min-h-0 sm:py-2"
            href={`/studio/${token.contractAddress}/manage`}
          >
            {copy.manageAction}
          </Link>
          <WalletConnectButton />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel className="relative overflow-hidden p-5 sm:p-8">
          <div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-sky/15 blur-3xl" />
          <div className="absolute bottom-8 left-6 h-36 w-36 rounded-full bg-mint/20 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-sky/25 text-ink">{token.symbol}</Badge>
              <Badge className="bg-mint/30 text-ink">{formatAmount(token.supply, intlLocale)}</Badge>
              <Badge className="bg-peach/45 text-ink">BSC</Badge>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[30px] bg-bubble shadow-soft">
                {token.imageUrl ? (
                  <Image
                    alt={token.name}
                    className="h-full w-full object-cover"
                    height={112}
                    src={token.imageUrl}
                    width={112}
                  />
                ) : (
                  <Sparkles className="h-10 w-10 text-candy" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-[2.6rem] leading-none text-ink sm:text-6xl">
                  {token.name}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
                  {token.description || copy.descriptionFallback}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Panel className="bg-bubble">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.ownerLabel}</p>
                <p className="mt-3 text-sm font-semibold text-ink">
                  {token.owner?.displayName ?? shortenAddress(token.ownerWallet, 8, 6)}
                </p>
                <p className="mt-2 break-all text-xs text-ink/45">{token.ownerWallet}</p>
              </Panel>
              <Panel className="bg-bubble">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Contract</p>
                <p className="mt-3 text-sm font-semibold text-ink">{shortenAddress(token.contractAddress, 8, 6)}</p>
                <p className="mt-2 break-all text-xs text-ink/45">{token.contractAddress}</p>
              </Panel>
              <Panel className="bg-bubble">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Launch</p>
                <p className="mt-3 text-sm font-semibold text-ink">
                  {formatDate(token.deployedAt, intlLocale)}
                </p>
                <p className="mt-2 text-xs text-ink/45">{copy.receiveHint}</p>
              </Panel>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
                href="/wallet"
              >
                <Coins className="mr-2 h-4 w-4" />
                {copy.sendAction}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-ink"
                href={`/studio/${token.contractAddress}/manage`}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                {copy.manageAction}
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-ink"
                href={token.explorerUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {copy.explorerAction}
              </a>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
              {copy.buyEyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl text-ink">{copy.buyTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              {account ? copy.buyConnectedDescription : copy.buyLoggedOutDescription}
            </p>
          </div>

          {canBuyWithWidget && account ? (
            <TokenBuyPanel
              description={token.description || token.name}
              image={token.imageUrl}
              receiverAddress={account.address as `0x${string}`}
              title={token.name}
              tokenAddress={token.contractAddress as `0x${string}`}
            />
          ) : canBuyWithWidget ? (
            <Panel className="bg-bubble">
              <p className="text-sm text-ink/70">{copy.connectToBuy}</p>
              <div className="mt-4">
                <WalletConnectButton />
              </div>
            </Panel>
          ) : (
            <Panel className="bg-bubble">
              <div className="rounded-[24px] border border-dashed border-white/70 bg-white/70 p-4">
                <p className="text-base font-semibold text-ink">{copy.buyUnavailableTitle}</p>
                <p className="mt-2 text-sm leading-6 text-ink/65">{copy.buyUnavailableBody}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-ink"
                  href="/wallet"
                >
                  {copy.sendAction}
                </Link>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-ink"
                  href={token.explorerUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {copy.explorerAction}
                </a>
              </div>
            </Panel>
          )}
        </Panel>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {copy.campaignEyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">{copy.campaignTitle}</h3>
            </div>
            <Badge className="bg-sky/20 text-ink">{campaigns.length}</Badge>
          </div>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 p-4 text-sm text-ink/60">
                {copy.campaignEmpty}
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-[24px] border border-white/70 bg-white/85 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-ink">{campaign.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{campaign.description || token.name}</p>
                    </div>
                    <Badge className="bg-peach/40 text-ink">
                      {campaign.status === "live"
                        ? copy.statusLive
                        : campaign.status === "ended"
                          ? copy.statusEnded
                          : copy.statusDraft}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-ink/50">
                    {formatDate(campaign.startsAt, intlLocale)} · {campaign.rewardAmount} {token.symbol}
                  </p>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {copy.activityEyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink">{copy.activityTitle}</h3>
            </div>
            <ArrowUpRight className="h-6 w-6 text-candy" />
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 p-4 text-sm text-ink/60">
                {copy.activityEmpty}
              </div>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[24px] border border-white/70 bg-white/85 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        entry.type === "transfer" ? "bg-sky/20 text-sky" : "bg-mint/25 text-mint"
                      }`}
                    >
                      {entry.type === "transfer" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <Gift className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{entry.title}</p>
                      <p className="mt-1 break-words text-sm text-ink/60">{entry.detail}</p>
                      <p className="mt-2 text-xs text-ink/45">
                        {entry.type === "transfer" ? `${entry.sourceLabel} · ` : ""}
                        {formatDate(entry.createdAt, intlLocale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>
    </main>
  );
}
