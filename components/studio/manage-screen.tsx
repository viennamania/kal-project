"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Activity, Clock3, Coins, ExternalLink, Rocket, ShieldCheck } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import type { PublicCampaign, PublicJobLog, PublicRewardLog, PublicToken } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";

type ManageScreenProps = {
  campaigns: PublicCampaign[];
  jobLogs: PublicJobLog[];
  rewardLogs: PublicRewardLog[];
  token: PublicToken;
};

const copyByLocale = {
  ko: {
    campaignDescriptionLabel: "설명",
    campaignEndLabel: "종료 일정",
    campaignRewardLabel: "보상 수량",
    campaignStartLabel: "시작 일정",
    campaignSubmit: "캠페인 만들기",
    campaignSubmitError: "캠페인을 저장하지 못했습니다.",
    campaignSubmitSuccess: "캠페인을 저장했습니다.",
    campaignTitleLabel: "캠페인 이름",
    campaignTypeLabel: "캠페인 유형",
    emptyCampaigns: "등록된 캠페인이 아직 없습니다.",
    emptyJobs: "작업 기록이 아직 없습니다.",
    emptyRewards: "보상 대기 기록이 아직 없습니다.",
    headerEyebrow: "운영 센터",
    headerTitle: "캠페인, 보상, 작업 상태를 한곳에서 관리",
    jobsTitle: "최근 작업",
    liquidityBuyClosed: "구매 잠김",
    liquidityBuyOpen: "구매 열림",
    liquidityButton: "LP 검증하고 구매 열기",
    liquidityHint:
      "PancakeSwap에서 만든 pair 주소를 넣으면 온체인 reserve를 확인하고 구매 위젯을 자동으로 엽니다.",
    liquidityMissing: "아직 등록된 LP가 없습니다.",
    liquidityPairLabel: "Pair 주소",
    liquidityQuoteLabel: "상대 토큰",
    liquidityStatusLabel: "유동성 상태",
    liquidityStatusPending: "등록됨, 유동성 대기",
    liquidityStatusVerified: "검증 완료",
    liquiditySubmitError: "LP 검증에 실패했습니다.",
    liquiditySubmitSuccessPending: "pair는 확인됐지만 아직 reserve가 없어 구매는 잠겨 있습니다.",
    liquiditySubmitSuccessVerified: "LP를 확인했고 구매 경로를 열었습니다.",
    liquidityTitle: "PancakeSwap LP 연결",
    liquidityTxHashLabel: "LP 트랜잭션 해시",
    manageLocked: "현재 연결된 지갑이 이 토큰의 운영 지갑과 다르면 읽기 전용으로 표시됩니다.",
    queueButton: "에어드롭 대기열 만들기",
    queueError: "에어드롭 대기열 생성에 실패했습니다.",
    queueHint: "한 줄에 `지갑주소,수량` 형식으로 입력하세요.",
    queueLabel: "에어드롭 대상",
    queueSuccess: "에어드롭 작업을 대기열에 넣었습니다.",
    rewardsTitle: "보상 대기 로그",
    statsCampaigns: "캠페인",
    statsJobs: "작업",
    statsQueued: "대기 보상",
    syncButton: "트랜잭션 동기화",
    syncError: "트랜잭션 동기화 작업을 넣지 못했습니다.",
    syncHint: "thirdweb Insight에서 이 토큰의 최근 온체인 전송을 다시 가져옵니다.",
    syncSuccess: "트랜잭션 동기화 작업을 대기열에 넣었습니다.",
    statusDraft: "준비중",
    statusEnded: "종료",
    statusLive: "진행중",
    backToToken: "토큰 상세로"
  },
  en: {
    campaignDescriptionLabel: "Description",
    campaignEndLabel: "End time",
    campaignRewardLabel: "Reward amount",
    campaignStartLabel: "Start time",
    campaignSubmit: "Create campaign",
    campaignSubmitError: "Failed to save the campaign.",
    campaignSubmitSuccess: "Campaign saved.",
    campaignTitleLabel: "Campaign title",
    campaignTypeLabel: "Campaign type",
    emptyCampaigns: "No campaigns have been saved yet.",
    emptyJobs: "No jobs have been recorded yet.",
    emptyRewards: "No queued rewards yet.",
    headerEyebrow: "Manage center",
    headerTitle: "Run campaigns, rewards, and job queues in one place",
    jobsTitle: "Recent jobs",
    liquidityBuyClosed: "Buy Off",
    liquidityBuyOpen: "Buy On",
    liquidityButton: "Verify LP and open buy",
    liquidityHint:
      "Paste the PancakeSwap pair address. The app checks on-chain reserves and unlocks the buy widget automatically.",
    liquidityMissing: "No LP pair has been linked yet.",
    liquidityPairLabel: "Pair address",
    liquidityQuoteLabel: "Quote token",
    liquidityStatusLabel: "Liquidity status",
    liquidityStatusPending: "Linked, waiting for reserves",
    liquidityStatusVerified: "Verified",
    liquiditySubmitError: "Failed to verify the LP pair.",
    liquiditySubmitSuccessPending:
      "The pair was found, but reserves are still zero so buying stays disabled.",
    liquiditySubmitSuccessVerified: "LP verified and the buy route is now enabled.",
    liquidityTitle: "Link PancakeSwap LP",
    liquidityTxHashLabel: "LP transaction hash",
    manageLocked:
      "This screen becomes read-only when the connected wallet does not match the token owner wallet.",
    queueButton: "Queue airdrop batch",
    queueError: "Failed to queue the airdrop batch.",
    queueHint: "Use one line per recipient in the format `walletAddress,amount`.",
    queueLabel: "Airdrop recipients",
    queueSuccess: "Airdrop job queued.",
    rewardsTitle: "Queued reward logs",
    statsCampaigns: "Campaigns",
    statsJobs: "Jobs",
    statsQueued: "Queued rewards",
    syncButton: "Sync transfers",
    syncError: "Failed to queue the transfer sync job.",
    syncHint: "Refresh recent on-chain transfers for this token from thirdweb Insight.",
    syncSuccess: "Transfer sync job queued.",
    statusDraft: "Draft",
    statusEnded: "Ended",
    statusLive: "Live",
    backToToken: "Back to token"
  },
  ja: {
    campaignDescriptionLabel: "説明",
    campaignEndLabel: "終了日時",
    campaignRewardLabel: "報酬数量",
    campaignStartLabel: "開始日時",
    campaignSubmit: "キャンペーンを作成",
    campaignSubmitError: "キャンペーンを保存できませんでした。",
    campaignSubmitSuccess: "キャンペーンを保存しました。",
    campaignTitleLabel: "キャンペーン名",
    campaignTypeLabel: "キャンペーン種別",
    emptyCampaigns: "まだ登録されたキャンペーンはありません。",
    emptyJobs: "まだ作業記録はありません。",
    emptyRewards: "まだ報酬待機ログはありません。",
    headerEyebrow: "運営センター",
    headerTitle: "キャンペーン、報酬、作業状態をまとめて管理",
    jobsTitle: "最近の作業",
    liquidityBuyClosed: "購入停止",
    liquidityBuyOpen: "購入開始",
    liquidityButton: "LPを確認して購入を開く",
    liquidityHint:
      "PancakeSwap で作成した pair アドレスを入力すると、オンチェーン reserve を確認して購入ウィジェットを自動で開きます。",
    liquidityMissing: "まだ登録された LP はありません。",
    liquidityPairLabel: "Pair アドレス",
    liquidityQuoteLabel: "相手トークン",
    liquidityStatusLabel: "流動性ステータス",
    liquidityStatusPending: "登録済み、流動性待ち",
    liquidityStatusVerified: "確認済み",
    liquiditySubmitError: "LP の確認に失敗しました。",
    liquiditySubmitSuccessPending:
      "pair は確認できましたが reserve がまだ 0 のため、購入はまだ無効です。",
    liquiditySubmitSuccessVerified: "LP を確認し、購入ルートを有効にしました。",
    liquidityTitle: "PancakeSwap LP 連携",
    liquidityTxHashLabel: "LP トランザクションハッシュ",
    manageLocked:
      "接続中ウォレットがこのトークンの所有ウォレットと異なる場合、この画面は閲覧専用になります。",
    queueButton: "エアドロップ待機を作成",
    queueError: "エアドロップ待機の作成に失敗しました。",
    queueHint: "1行ごとに `ウォレットアドレス,数量` 形式で入力してください。",
    queueLabel: "エアドロップ対象",
    queueSuccess: "エアドロップ作業をキューに追加しました。",
    rewardsTitle: "報酬待機ログ",
    statsCampaigns: "キャンペーン",
    statsJobs: "作業",
    statsQueued: "待機中報酬",
    syncButton: "取引を同期",
    syncError: "取引同期ジョブを追加できませんでした。",
    syncHint: "thirdweb Insight からこのトークンの最近のオンチェーン送信履歴を再取得します。",
    syncSuccess: "取引同期ジョブをキューに追加しました。",
    statusDraft: "準備中",
    statusEnded: "終了",
    statusLive: "進行中",
    backToToken: "トークン詳細へ"
  },
  "zh-CN": {
    campaignDescriptionLabel: "说明",
    campaignEndLabel: "结束时间",
    campaignRewardLabel: "奖励数量",
    campaignStartLabel: "开始时间",
    campaignSubmit: "创建活动",
    campaignSubmitError: "无法保存活动。",
    campaignSubmitSuccess: "活动已保存。",
    campaignTitleLabel: "活动名称",
    campaignTypeLabel: "活动类型",
    emptyCampaigns: "还没有已保存的活动。",
    emptyJobs: "还没有任务记录。",
    emptyRewards: "还没有奖励排队记录。",
    headerEyebrow: "运营中心",
    headerTitle: "在一个页面管理活动、奖励和任务队列",
    jobsTitle: "最近任务",
    liquidityBuyClosed: "购买关闭",
    liquidityBuyOpen: "购买开启",
    liquidityButton: "验证 LP 并开启购买",
    liquidityHint:
      "输入在 PancakeSwap 创建的 pair 地址后，系统会检查链上 reserve，并在通过后自动开启购买组件。",
    liquidityMissing: "还没有绑定 LP pair。",
    liquidityPairLabel: "Pair 地址",
    liquidityQuoteLabel: "报价代币",
    liquidityStatusLabel: "流动性状态",
    liquidityStatusPending: "已绑定，等待流动性",
    liquidityStatusVerified: "已验证",
    liquiditySubmitError: "LP 验证失败。",
    liquiditySubmitSuccessPending: "已找到 pair，但 reserve 仍为 0，购买功能保持关闭。",
    liquiditySubmitSuccessVerified: "LP 已验证，购买路径已开启。",
    liquidityTitle: "连接 PancakeSwap LP",
    liquidityTxHashLabel: "LP 交易哈希",
    manageLocked: "当当前连接钱包不是该代币的拥有者钱包时，此页面将以只读方式显示。",
    queueButton: "加入空投队列",
    queueError: "加入空投队列失败。",
    queueHint: "每行使用 `钱包地址,数量` 格式。",
    queueLabel: "空投对象",
    queueSuccess: "空投任务已加入队列。",
    rewardsTitle: "奖励排队日志",
    statsCampaigns: "活动",
    statsJobs: "任务",
    statsQueued: "排队奖励",
    syncButton: "同步转账",
    syncError: "无法加入转账同步任务。",
    syncHint: "从 thirdweb Insight 重新拉取这个代币最近的链上转账记录。",
    syncSuccess: "转账同步任务已加入队列。",
    statusDraft: "准备中",
    statusEnded: "已结束",
    statusLive: "进行中",
    backToToken: "返回代币详情"
  }
} as const;

const campaignTypes = ["airdrop", "attendance", "mission", "referral"] as const;

export function ManageScreen({ campaigns, jobLogs, rewardLogs, token }: ManageScreenProps) {
  const account = useActiveAccount();
  const { locale } = useLocale();
  const copy = copyByLocale[locale];
  const intlLocale =
    locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "zh-CN" ? "zh-CN" : "en-US";
  const [tokenState, setTokenState] = useState(token);
  const isOwner = account?.address?.toLowerCase() === tokenState.ownerWallet.toLowerCase();
  const [campaignState, setCampaignState] = useState(campaigns);
  const [jobState, setJobState] = useState(jobLogs);
  const [rewardState] = useState(rewardLogs);
  const [campaignMessage, setCampaignMessage] = useState<string | null>(null);
  const [liquidityForm, setLiquidityForm] = useState({
    liquidityTxHash: token.liquidityTxHash ?? "",
    pairAddress: token.liquidityPairAddress ?? ""
  });
  const [liquidityMessage, setLiquidityMessage] = useState<string | null>(null);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState({
    description: "",
    endsAt: "",
    rewardAmount: "100",
    startsAt: "",
    title: "",
    type: "attendance" as (typeof campaignTypes)[number]
  });
  const [airdropInput, setAirdropInput] = useState("");
  const [isSavingCampaign, setIsSavingCampaign] = useState(false);
  const [isVerifyingLiquidity, setIsVerifyingLiquidity] = useState(false);
  const [isQueueing, setIsQueueing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const liquidityStatusLabel =
    tokenState.liquidityStatus === "verified"
      ? copy.liquidityStatusVerified
      : tokenState.liquidityStatus === "pending"
        ? copy.liquidityStatusPending
        : copy.liquidityMissing;
  const liquidityQuoteText = tokenState.liquidityQuoteTokenAddress
    ? tokenState.liquidityQuoteTokenSymbol
      ? `${tokenState.liquidityQuoteTokenSymbol} · ${shortenAddress(tokenState.liquidityQuoteTokenAddress, 8, 6)}`
      : shortenAddress(tokenState.liquidityQuoteTokenAddress, 8, 6)
    : "—";

  const summary = useMemo(
    () => ({
      campaigns: campaignState.length,
      jobs: jobState.length,
      queuedRewards: rewardState.filter((entry) => entry.status === "queued").length
    }),
    [campaignState.length, jobState.length, rewardState]
  );

  async function handleCreateCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isOwner) {
      return;
    }

    setIsSavingCampaign(true);
    setCampaignMessage(null);

    try {
      const response = await fetch("/api/campaigns", {
        body: JSON.stringify({
          description: campaignForm.description || null,
          endsAt: campaignForm.endsAt ? new Date(campaignForm.endsAt).toISOString() : null,
          ownerWallet: tokenState.ownerWallet,
          rewardAmount: campaignForm.rewardAmount,
          startsAt: new Date(campaignForm.startsAt || Date.now()).toISOString(),
          status: "draft",
          title: campaignForm.title,
          tokenAddress: tokenState.contractAddress,
          type: campaignForm.type
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(copy.campaignSubmitError);
      }

      const data = (await response.json()) as { campaign: PublicCampaign };
      setCampaignState((current) => [data.campaign, ...current]);
      setCampaignForm({
        description: "",
        endsAt: "",
        rewardAmount: "100",
        startsAt: "",
        title: "",
        type: "attendance"
      });
      setCampaignMessage(copy.campaignSubmitSuccess);
    } catch (error) {
      setCampaignMessage(error instanceof Error ? error.message : copy.campaignSubmitError);
    } finally {
      setIsSavingCampaign(false);
    }
  }

  async function handleVerifyLiquidity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isOwner) {
      return;
    }

    setIsVerifyingLiquidity(true);
    setLiquidityMessage(null);

    try {
      const response = await fetch(`/api/tokens/${tokenState.contractAddress}/liquidity`, {
        body: JSON.stringify({
          liquidityTxHash: liquidityForm.liquidityTxHash.trim() || null,
          pairAddress: liquidityForm.pairAddress.trim()
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const data = (await response.json()) as {
        error?: string;
        token?: PublicToken;
      };

      if (!response.ok || !data.token) {
        throw new Error(data.error || copy.liquiditySubmitError);
      }

      setTokenState(data.token);
      setLiquidityForm({
        liquidityTxHash: data.token.liquidityTxHash ?? "",
        pairAddress: data.token.liquidityPairAddress ?? liquidityForm.pairAddress
      });
      setLiquidityMessage(
        data.token.liquidityStatus === "verified"
          ? copy.liquiditySubmitSuccessVerified
          : copy.liquiditySubmitSuccessPending
      );
    } catch (error) {
      setLiquidityMessage(error instanceof Error ? error.message : copy.liquiditySubmitError);
    } finally {
      setIsVerifyingLiquidity(false);
    }
  }

  async function handleQueueAirdrop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isOwner) {
      return;
    }

    setIsQueueing(true);
    setQueueMessage(null);

    try {
      const recipients = airdropInput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [walletAddress, amount] = line.split(",").map((value) => value.trim());

          if (!walletAddress || !amount) {
            throw new Error(copy.queueError);
          }

          return {
            amount,
            walletAddress
          };
        });

      const response = await fetch("/api/ops/airdrops", {
        body: JSON.stringify({
          ownerWallet: tokenState.ownerWallet,
          recipients,
          tokenAddress: tokenState.contractAddress
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(copy.queueError);
      }

      const data = (await response.json()) as { jobId: string | number; status: string };
      const now = new Date().toISOString();

      setJobState((current) => [
        {
          createdAt: now,
          errorMessage: null,
          id: String(data.jobId),
          jobId: String(data.jobId),
          jobName: "airdrop.create",
          payload: {
            tokenAddress: tokenState.contractAddress
          },
          result: null,
          status: "queued",
          updatedAt: now
        },
        ...current
      ]);
      setAirdropInput("");
      setQueueMessage(copy.queueSuccess);
    } catch (error) {
      setQueueMessage(error instanceof Error ? error.message : copy.queueError);
    } finally {
      setIsQueueing(false);
    }
  }

  async function handleSyncTransfers() {
    if (!isOwner) {
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const response = await fetch("/api/ops/insight-sync", {
        body: JSON.stringify({
          chainId: tokenState.chainId,
          tokenAddress: tokenState.contractAddress
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(copy.syncError);
      }

      const data = (await response.json()) as { jobId: string | number; status: string };
      const now = new Date().toISOString();

      setJobState((current) => [
        {
          createdAt: now,
          errorMessage: null,
          id: String(data.jobId),
          jobId: String(data.jobId),
          jobName: "insight.sync",
          payload: {
            tokenAddress: tokenState.contractAddress
          },
          result: null,
          status: "queued",
          updatedAt: now
        },
        ...current
      ]);
      setSyncMessage(copy.syncSuccess);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : copy.syncError);
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 px-4 py-4 shadow-bubble backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-[36px] sm:px-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
            {copy.headerEyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{copy.headerTitle}</h1>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <LanguageSwitcher />
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink/80 sm:min-h-0 sm:py-2"
            href={`/tokens/${tokenState.contractAddress}`}
          >
            {copy.backToToken}
          </Link>
        </div>
      </header>

      <div className="mb-6 rounded-[28px] border border-white/70 bg-white/70 px-5 py-4 text-sm text-ink/65 shadow-soft">
        {copy.manageLocked}
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Panel className="bg-bubble">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.statsCampaigns}</p>
          <p className="mt-3 font-display text-4xl text-ink">{summary.campaigns}</p>
        </Panel>
        <Panel className="bg-bubble">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.statsQueued}</p>
          <p className="mt-3 font-display text-4xl text-ink">{summary.queuedRewards}</p>
        </Panel>
        <Panel className="bg-bubble">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{copy.statsJobs}</p>
          <p className="mt-3 font-display text-4xl text-ink">{summary.jobs}</p>
        </Panel>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Rocket className="h-6 w-6 text-candy" />
            <h2 className="font-display text-3xl text-ink">{copy.campaignSubmit}</h2>
          </div>

          <form className="space-y-4" onSubmit={handleCreateCampaign}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/70">
                {copy.campaignTitleLabel}
              </label>
              <Input
                disabled={!isOwner || isSavingCampaign}
                onChange={(event) =>
                  setCampaignForm((current) => ({ ...current, title: event.target.value }))
                }
                required
                value={campaignForm.title}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.campaignTypeLabel}
                </label>
                <select
                  className="h-12 w-full rounded-3xl border border-white/70 bg-white/85 px-4 text-base font-medium text-ink outline-none focus:border-sky focus:ring-4 focus:ring-sky/20 sm:text-sm"
                  disabled={!isOwner || isSavingCampaign}
                  onChange={(event) =>
                    setCampaignForm((current) => ({
                      ...current,
                      type: event.target.value as (typeof campaignTypes)[number]
                    }))
                  }
                  value={campaignForm.type}
                >
                  {campaignTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.campaignRewardLabel}
                </label>
                <Input
                  disabled={!isOwner || isSavingCampaign}
                  onChange={(event) =>
                    setCampaignForm((current) => ({ ...current, rewardAmount: event.target.value }))
                  }
                  required
                  value={campaignForm.rewardAmount}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/70">
                {copy.campaignDescriptionLabel}
              </label>
              <Textarea
                disabled={!isOwner || isSavingCampaign}
                onChange={(event) =>
                  setCampaignForm((current) => ({ ...current, description: event.target.value }))
                }
                value={campaignForm.description}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.campaignStartLabel}
                </label>
                <Input
                  disabled={!isOwner || isSavingCampaign}
                  onChange={(event) =>
                    setCampaignForm((current) => ({ ...current, startsAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={campaignForm.startsAt}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.campaignEndLabel}
                </label>
                <Input
                  disabled={!isOwner || isSavingCampaign}
                  onChange={(event) =>
                    setCampaignForm((current) => ({ ...current, endsAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={campaignForm.endsAt}
                />
              </div>
            </div>

            {campaignMessage ? (
              <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                {campaignMessage}
              </div>
            ) : null}

            <Button className="w-full" disabled={!isOwner || isSavingCampaign} type="submit">
              {copy.campaignSubmit}
            </Button>
          </form>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Coins className="h-6 w-6 text-sky" />
            <h2 className="font-display text-3xl text-ink">{copy.liquidityTitle}</h2>
          </div>

          <div className="mb-4 rounded-[24px] border border-white/70 bg-white/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                  {copy.liquidityStatusLabel}
                </p>
                <p className="mt-2 text-base font-semibold text-ink">{liquidityStatusLabel}</p>
              </div>
              <Badge className={tokenState.buyEnabled ? "bg-mint/25 text-ink" : "bg-peach/35 text-ink"}>
                {tokenState.buyEnabled ? copy.liquidityBuyOpen : copy.liquidityBuyClosed}
              </Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm text-ink/65">
              <p>
                <span className="font-semibold text-ink">{copy.liquidityPairLabel}:</span>{" "}
                {tokenState.liquidityPairAddress
                  ? shortenAddress(tokenState.liquidityPairAddress, 8, 6)
                  : copy.liquidityMissing}
              </p>
              <p>
                <span className="font-semibold text-ink">{copy.liquidityQuoteLabel}:</span> {liquidityQuoteText}
              </p>
              {tokenState.liquidityVerifiedAt ? (
                <p>{formatDate(tokenState.liquidityVerifiedAt, intlLocale)}</p>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {tokenState.liquidityPairAddress ? (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-ink"
                  href={`https://bscscan.com/address/${tokenState.liquidityPairAddress}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                  Pair
                </a>
              ) : null}
              {tokenState.liquidityTxHash ? (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-ink"
                  href={`https://bscscan.com/tx/${tokenState.liquidityTxHash}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                  LP Tx
                </a>
              ) : null}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleVerifyLiquidity}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/70">
                {copy.liquidityPairLabel}
              </label>
              <Input
                disabled={!isOwner || isVerifyingLiquidity}
                onChange={(event) =>
                  setLiquidityForm((current) => ({ ...current, pairAddress: event.target.value }))
                }
                placeholder="0x..."
                required
                value={liquidityForm.pairAddress}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/70">
                {copy.liquidityTxHashLabel}
              </label>
              <Input
                disabled={!isOwner || isVerifyingLiquidity}
                onChange={(event) =>
                  setLiquidityForm((current) => ({ ...current, liquidityTxHash: event.target.value }))
                }
                placeholder="0x..."
                value={liquidityForm.liquidityTxHash}
              />
            </div>
            <p className="text-sm text-ink/55">{copy.liquidityHint}</p>

            {liquidityMessage ? (
              <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                {liquidityMessage}
              </div>
            ) : null}

            <Button
              className="w-full"
              disabled={!isOwner || isVerifyingLiquidity}
              type="submit"
              variant="secondary"
            >
              {copy.liquidityButton}
            </Button>
          </form>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-mint" />
            <h2 className="font-display text-3xl text-ink">{copy.queueButton}</h2>
          </div>

          <form className="space-y-4" onSubmit={handleQueueAirdrop}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/70">{copy.queueLabel}</label>
              <Textarea
                disabled={!isOwner || isQueueing}
                onChange={(event) => setAirdropInput(event.target.value)}
                placeholder={copy.queueHint}
                value={airdropInput}
              />
              <p className="mt-2 text-xs text-ink/45">{copy.queueHint}</p>
            </div>

            {queueMessage ? (
              <div className="rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                {queueMessage}
              </div>
            ) : null}

            <Button className="w-full" disabled={!isOwner || isQueueing} type="submit" variant="secondary">
              {copy.queueButton}
            </Button>
          </form>
        </Panel>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-6 w-6 text-sky" />
            <h3 className="font-display text-3xl text-ink">{copy.rewardsTitle}</h3>
          </div>
          <div className="space-y-3">
            {rewardState.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 p-4 text-sm text-ink/60">
                {copy.emptyRewards}
              </div>
            ) : (
              rewardState.slice(0, 8).map((entry) => (
                <div key={entry.id} className="rounded-[24px] border border-white/70 bg-white/85 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {entry.amount} {tokenState.symbol}
                      </p>
                      <p className="mt-1 break-all text-xs text-ink/55">{entry.userWallet}</p>
                    </div>
                    <Badge className="bg-peach/35 text-ink">{entry.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-ink/45">{formatDate(entry.createdAt, intlLocale)}</p>
                </div>
              ))
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Clock3 className="h-6 w-6 text-candy" />
                <h3 className="font-display text-3xl text-ink">{copy.jobsTitle}</h3>
              </div>
              <Button
                disabled={!isOwner || isSyncing}
                onClick={handleSyncTransfers}
                type="button"
                variant="secondary"
              >
                {copy.syncButton}
              </Button>
            </div>
            <p className="mb-4 text-sm text-ink/55">{copy.syncHint}</p>
            {syncMessage ? (
              <div className="mb-4 rounded-3xl border border-sky/25 bg-sky/10 px-4 py-3 text-sm text-ink">
                {syncMessage}
              </div>
            ) : null}
            <div className="space-y-3">
              {jobState.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 p-4 text-sm text-ink/60">
                  {copy.emptyJobs}
                </div>
              ) : (
                jobState.slice(0, 8).map((job) => (
                  <div key={job.id} className="rounded-[24px] border border-white/70 bg-white/85 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{job.jobName}</p>
                        <p className="mt-1 text-xs text-ink/55">
                          {shortenAddress(tokenState.contractAddress, 8, 6)}
                        </p>
                      </div>
                      <Badge className="bg-sky/20 text-ink">{job.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-ink/45">{formatDate(job.createdAt, intlLocale)}</p>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <Rocket className="h-6 w-6 text-mint" />
              <h3 className="font-display text-3xl text-ink">{copy.statsCampaigns}</h3>
            </div>
            <div className="space-y-3">
              {campaignState.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 p-4 text-sm text-ink/60">
                  {copy.emptyCampaigns}
                </div>
              ) : (
                campaignState.slice(0, 8).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-[24px] border border-white/70 bg-white/85 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{campaign.title}</p>
                        <p className="mt-1 text-xs text-ink/55">{campaign.type}</p>
                      </div>
                      <Badge className="bg-mint/25 text-ink">
                        {campaign.status === "live"
                          ? copy.statusLive
                          : campaign.status === "ended"
                            ? copy.statusEnded
                            : copy.statusDraft}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-ink/45">{formatDate(campaign.startsAt, intlLocale)}</p>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
