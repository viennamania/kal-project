"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock3, Gift, ShieldCheck } from "lucide-react";

import { WalletConnectButton } from "@/components/auth/wallet-connect-button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { useWalletMember } from "@/components/providers/wallet-member-provider";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { AppLocale } from "@/lib/i18n";
import type { PublicInviteClaim } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";

const copyByLocale: Record<
  AppLocale,
  {
    claimButton: string;
    claimHint: string;
    claimQueued: string;
    claimTitle: string;
    connectRequired: string;
    expired: string;
    expiresLabel: string;
    headerEyebrow: string;
    invalidPhone: string;
    processing: string;
    senderLabel: string;
    statusLabel: string;
    statusCancelled: string;
    statusDelivered: string;
    statusExpired: string;
    statusFailed: string;
    statusPending: string;
    statusProcessing: string;
    targetPhoneLabel: string;
    tokenLabel: string;
    viewWallet: string;
  }
> = {
  ko: {
    claimButton: "전화번호 확인하고 받기",
    claimHint: "같은 전화번호로 지갑을 연결하면 지급 요청이 접수됩니다.",
    claimQueued: "전화번호가 확인되어 지급 요청을 접수했습니다.",
    claimTitle: "초대 링크로 토큰 받기",
    connectRequired: "대상 전화번호로 지갑을 먼저 연결해 주세요.",
    expired: "이 초대 링크는 만료되었습니다.",
    expiresLabel: "만료 일정",
    headerEyebrow: "초대 수령",
    invalidPhone: "이 링크는 다른 전화번호용으로 예약되어 있습니다.",
    processing: "지급 요청이 접수되어 처리 대기 중입니다.",
    senderLabel: "보낸 사람",
    statusLabel: "상태",
    statusCancelled: "취소됨",
    statusDelivered: "지급 완료",
    statusExpired: "만료됨",
    statusFailed: "실패",
    statusPending: "대기중",
    statusProcessing: "지급 준비중",
    targetPhoneLabel: "대상 전화번호",
    tokenLabel: "보낼 토큰",
    viewWallet: "지갑 서비스로"
  },
  en: {
    claimButton: "Verify phone and claim",
    claimHint: "Connect the wallet with the same phone number to queue delivery.",
    claimQueued: "Phone verified. The delivery request has been queued.",
    claimTitle: "Claim tokens from an invite link",
    connectRequired: "Connect the wallet with the target phone number first.",
    expired: "This invite link has expired.",
    expiresLabel: "Expires",
    headerEyebrow: "Invite claim",
    invalidPhone: "This invite link is reserved for a different phone number.",
    processing: "The delivery request is already queued.",
    senderLabel: "Sender",
    statusLabel: "Status",
    statusCancelled: "Cancelled",
    statusDelivered: "Delivered",
    statusExpired: "Expired",
    statusFailed: "Failed",
    statusPending: "Pending",
    statusProcessing: "Processing",
    targetPhoneLabel: "Target phone",
    tokenLabel: "Token",
    viewWallet: "Back to wallet"
  },
  ja: {
    claimButton: "電話番号を確認して受け取る",
    claimHint: "同じ電話番号でウォレットを接続すると、受け取りリクエストが登録されます。",
    claimQueued: "電話番号を確認し、受け取りリクエストを登録しました。",
    claimTitle: "招待リンクでトークンを受け取る",
    connectRequired: "対象の電話番号でウォレットを接続してください。",
    expired: "この招待リンクは期限切れです。",
    expiresLabel: "有効期限",
    headerEyebrow: "招待受取",
    invalidPhone: "このリンクは別の電話番号用に予約されています。",
    processing: "受け取りリクエストはすでに処理待ちです。",
    senderLabel: "送信者",
    statusLabel: "状態",
    statusCancelled: "キャンセル済み",
    statusDelivered: "受取完了",
    statusExpired: "期限切れ",
    statusFailed: "失敗",
    statusPending: "待機中",
    statusProcessing: "処理中",
    targetPhoneLabel: "対象電話番号",
    tokenLabel: "トークン",
    viewWallet: "ウォレットへ"
  },
  "zh-CN": {
    claimButton: "验证手机号并领取",
    claimHint: "用同一个手机号连接钱包后即可提交发放请求。",
    claimQueued: "手机号已验证，发放请求已加入队列。",
    claimTitle: "通过邀请链接领取代币",
    connectRequired: "请先用目标手机号连接钱包。",
    expired: "此邀请链接已过期。",
    expiresLabel: "过期时间",
    headerEyebrow: "邀请领取",
    invalidPhone: "此链接保留给其他手机号。",
    processing: "发放请求已经在处理中。",
    senderLabel: "发送人",
    statusLabel: "状态",
    statusCancelled: "已取消",
    statusDelivered: "已发放",
    statusExpired: "已过期",
    statusFailed: "失败",
    statusPending: "待领取",
    statusProcessing: "处理中",
    targetPhoneLabel: "目标手机号",
    tokenLabel: "代币",
    viewWallet: "返回钱包"
  }
};

function getStatusLabel(status: PublicInviteClaim["status"], copy: (typeof copyByLocale)["ko"]) {
  switch (status) {
    case "cancelled":
      return copy.statusCancelled;
    case "delivered":
      return copy.statusDelivered;
    case "expired":
      return copy.statusExpired;
    case "failed":
      return copy.statusFailed;
    case "processing":
      return copy.statusProcessing;
    case "pending":
    default:
      return copy.statusPending;
  }
}

export function InviteClaimScreen({
  claimToken,
  initialInviteClaim
}: {
  claimToken: string;
  initialInviteClaim: PublicInviteClaim;
}) {
  const { locale } = useLocale();
  const { member, status: memberStatus } = useWalletMember();
  const copy = copyByLocale[locale];
  const [inviteClaim, setInviteClaim] = useState(initialInviteClaim);
  const [isClaiming, setIsClaiming] = useState(false);
  const [message, setMessage] = useState<string | null>(
    initialInviteClaim.status === "expired"
      ? copy.expired
      : initialInviteClaim.status === "processing"
        ? copy.processing
        : null
  );

  async function handleClaim() {
    setIsClaiming(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/invite-claims/${claimToken}/claim`, {
        method: "POST"
      });
      const data = (await response.json()) as { error?: string; inviteClaim?: PublicInviteClaim };

      if (!response.ok || !data.inviteClaim) {
        throw new Error(data.error || copy.invalidPhone);
      }

      setInviteClaim(data.inviteClaim);
      setMessage(copy.claimQueued);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalidPhone);
    } finally {
      setIsClaiming(false);
    }
  }

  const isPending = inviteClaim.status === "pending";

  return (
    <main className="mx-auto max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 px-4 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-[36px] sm:px-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
            {copy.headerEyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{copy.claimTitle}</h1>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <LanguageSwitcher />
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink/80 sm:min-h-0 sm:py-2"
            href="/wallet"
          >
            {copy.viewWallet}
          </Link>
          <WalletConnectButton />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {copy.tokenLabel}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink">
                {inviteClaim.amount} {inviteClaim.tokenSymbol}
              </h2>
              <p className="mt-2 text-sm text-ink/60">{inviteClaim.tokenName}</p>
            </div>
            <Gift className="h-8 w-8 text-candy" />
          </div>

          <dl className="mt-6 space-y-4 text-sm text-ink/70">
            <div>
              <dt className="font-semibold text-ink/55">{copy.senderLabel}</dt>
              <dd className="mt-1">
                {inviteClaim.senderDisplayName ?? shortenAddress(inviteClaim.senderWallet, 8, 6)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">{copy.targetPhoneLabel}</dt>
              <dd className="mt-1">{inviteClaim.targetPhoneMasked}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">{copy.statusLabel}</dt>
              <dd className="mt-1">{getStatusLabel(inviteClaim.status, copy)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">{copy.expiresLabel}</dt>
              <dd className="mt-1">{formatDate(inviteClaim.expiresAt, locale)}</dd>
            </div>
          </dl>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                  {copy.headerEyebrow}
                </p>
                <h3 className="mt-2 font-display text-3xl text-ink">{getStatusLabel(inviteClaim.status, copy)}</h3>
              </div>
              {inviteClaim.status === "processing" ? (
                <Clock3 className="h-7 w-7 text-sky" />
              ) : (
                <ShieldCheck className="h-7 w-7 text-mint" />
              )}
            </div>

            <div className="mt-4 rounded-[28px] bg-bubble p-4 text-sm text-ink/70">
              {member ? (
                <>
                  {member.maskedPhone ? <p>{member.maskedPhone}</p> : null}
                  <p className={`${member.maskedPhone ? "mt-2" : ""} break-all`}>
                    {shortenAddress(member.walletAddress, 10, 6)}
                  </p>
                </>
              ) : (
                copy.connectRequired
              )}
            </div>

            <div className="mt-4 rounded-[28px] border border-dashed border-white/80 bg-white/55 px-4 py-3 text-sm text-ink/70">
              {inviteClaim.status === "expired"
                ? copy.expired
                : inviteClaim.status === "processing"
                  ? copy.processing
                  : copy.claimHint}
            </div>

            {message ? (
              <div className="mt-4 rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                {message}
              </div>
            ) : null}

            <Button
              className="mt-4 w-full"
              disabled={!isPending || !member || memberStatus === "loading" || isClaiming}
              onClick={handleClaim}
              type="button"
            >
              {isClaiming ? copy.statusProcessing : copy.claimButton}
            </Button>
          </Panel>
        </div>
      </div>
    </main>
  );
}
