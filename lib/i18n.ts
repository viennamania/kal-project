import type { LocaleId } from "thirdweb/react";

export const LOCALE_COOKIE_NAME = "oasis-locale";
export const appLocales = ["ko", "en", "ja", "zh-CN"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "ko";

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  ja: "日本語",
  ko: "한글",
  "zh-CN": "中文"
};

const thirdwebLocaleMap: Record<AppLocale, LocaleId> = {
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
  "zh-CN": "zh_CN"
};

const intlLocaleMap: Record<AppLocale, string> = {
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  "zh-CN": "zh-CN"
};

const dictionaries = {
  ko: {
    common: {
      brand: "Oasis Token Arcade",
      fallbackMascotAlt: "기본 마스코트",
      mascotAlt: "오아시스 마스코트",
      tokenPreviewAlt: "토큰 미리보기",
      uploadMascotAlt: "업로드 마스코트"
    },
    connect: {
      appDescription: "전화번호 로그인으로 토큰을 쉽게 만들고 보낼 수 있는 서비스",
      modalTitle: "전화번호로 연결",
      welcomeSubtitle: "모든 회원에게 바로 쓸 수 있는 지갑과 수수료 지원을 제공합니다",
      welcomeTitle: "오아시스 토큰 아케이드 입장"
    },
    home: {
      boardEmpty: "첫 토큰을 발행하면 이 보드에 바로 나타납니다.",
      boardSavedPrefix: "저장 완료 · ",
      boardTitle: "내 런치 보드",
      communityLaunchesEyebrow: "커뮤니티 런치",
      communityLaunchesTitle: "회원들이 막 발행한 토큰",
      communityOwnerLabel: "소유자",
      communityStatCaption: "발행된 토큰 수",
      communityStatLabel: "커뮤니티",
      defaultDescriptionTemplate: "{brand}에서 발행한 {name} 토큰",
      deployButton: "토큰 발행하기",
      deployingButton: "토큰 발행 중...",
      deploySuccess: "토큰이 발행되었습니다: {address}",
      descriptionFieldLabel: "설명",
      descriptionFieldPlaceholder: "다음 런치 캠페인을 위한 산뜻한 커뮤니티 토큰입니다.",
      emptyImageError: "토큰 이미지를 업로드해 주세요.",
      emptyWalletError: "토큰을 발행하려면 먼저 전화번호 지갑을 연결해야 합니다.",
      gasSponsoredTag: "수수료 지원",
      heroDescription:
        "모든 회원은 전화번호로 로그인하고, 바로 쓸 수 있는 지갑을 받으며, 토큰 이미지를 안전하게 저장하고, 발행 기록도 편하게 관리할 수 있습니다.",
      heroTitle: "전화번호 한 번으로 산뜻한 토큰을 발행하세요.",
      imageFieldHint: "PNG, JPG, WEBP, 최대 4MB",
      imageFieldLabel: "토큰 이미지",
      imageFieldStorageHint: "업로드한 이미지는 안전하게 저장되어 스튜디오와 지갑 서비스에서 함께 사용됩니다.",
      imageUploadFailed: "이미지 업로드에 실패했습니다.",
      initialSupplyFieldLabel: "초기 발행량",
      launchReadyBodyLoggedOut:
        "전화번호로 로그인하면 지갑이 자동으로 준비되고 전송 수수료도 지원됩니다.",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} 님, 바로 런치할 수 있어요",
      launchReadyTitleLoggedOut: "전화번호 연결로 내 지갑을 열어보세요",
      launchedLabel: "발행일",
      membersStatCaption: "가입한 회원 수",
      membersStatLabel: "회원",
      mineStatCaption: "내가 만든 토큰 수",
      mineStatLabel: "내 토큰",
      nameFieldLabel: "이름",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "간편 시작",
      openWalletService: "지갑 서비스 열기",
      ownerLabel: "소유자",
      smartAccountHint: "발행이 끝나면 지금 연결된 지갑으로 바로 받아집니다.",
      studioEyebrow: "토큰 스튜디오",
      studioTag: "스튜디오 오픈",
      studioTitle: "토큰 만들기",
      supplyLabel: "발행량",
      symbolFieldLabel: "심볼",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "토큰 발행에 실패했습니다.",
      tokenSaveFailed: "토큰은 만들어졌지만 발행 기록 저장에 실패했습니다."
    },
    nav: {
      backToStudio: "스튜디오로 돌아가기",
      walletService: "지갑 서비스"
    },
    wallet: {
      activeWalletEyebrow: "현재 지갑",
      activeWalletLoggedOut: "전화번호로 연결하세요",
      amountFieldLabel: "수량",
      amountPlaceholder: "사용 가능 수량: {amount}",
      connectByPhone: "전화번호로 연결하세요",
      connectRequiredNote: "잔고 조회와 토큰 전송을 위해 전화번호 로그인이 필요합니다.",
      emptyMembers: "검색 조건에 맞는 회원이 아직 없습니다.",
      emptyTokens: "아직 발행된 토큰이 없습니다.",
      headerEyebrow: "지갑 서비스",
      headerTitle: "잔고 확인, 회원 검색, 토큰 전송",
      loadingTokens: "토큰을 불러오는 중...",
      myBalanceLabel: "내 잔고",
      pickRecipientError: "전송하려면 토큰과 받는 사람을 먼저 선택해 주세요.",
      searchFieldLabel: "회원 검색",
      searchFieldPlaceholder: "이름, 전화번호 끝자리, 지갑 주소...",
      selfTransferError: "이 데모에서는 자기 자신에게 보내는 전송을 막아두었습니다.",
      sendButton: "토큰 보내기",
      sendEyebrow: "토큰 전송",
      sendInProgress: "토큰 전송 중...",
      sendSuccess: "{name} 님에게 {amount} {symbol} 전송 완료",
      sendTitle: "회원을 검색하고 토큰 보내기",
      smartAccountNote: "이 지갑은 바로 사용할 수 있고, 보내기 수수료도 지원됩니다.",
      tokenCountSuffix: "개 토큰",
      tokenFieldLabel: "토큰",
      tokenListEyebrow: "커뮤니티 토큰 목록",
      tokenListTitle: "발행된 토큰 목록",
      transferFailed: "토큰 전송에 실패했습니다."
    }
  },
  en: {
    common: {
      brand: "Oasis Token Arcade",
      fallbackMascotAlt: "Fallback mascot",
      mascotAlt: "Oasis mascot",
      tokenPreviewAlt: "Token preview",
      uploadMascotAlt: "Upload mascot"
    },
    connect: {
      appDescription: "Create and send tokens with phone login and a ready-to-use wallet",
      modalTitle: "Connect by phone",
      welcomeSubtitle: "Every member gets a wallet that's ready to use, with help covering fees",
      welcomeTitle: "Enter Oasis Token Arcade"
    },
    home: {
      boardEmpty: "Your first token will appear here as soon as you launch one.",
      boardSavedPrefix: "Saved · ",
      boardTitle: "Your launch board",
      communityLaunchesEyebrow: "Community launches",
      communityLaunchesTitle: "Fresh tokens from members",
      communityOwnerLabel: "Owner",
      communityStatCaption: "tokens launched",
      communityStatLabel: "Community",
      defaultDescriptionTemplate: "{name} token launched from {brand}",
      deployButton: "Create token",
      deployingButton: "Deploying token...",
      deploySuccess: "Token deployed at {address}.",
      descriptionFieldLabel: "Description",
      descriptionFieldPlaceholder: "A playful community token for the next launch campaign.",
      emptyImageError: "Token art is required.",
      emptyWalletError: "Phone wallet must be connected before deployment.",
      gasSponsoredTag: "Fees covered",
      heroDescription:
        "Every member signs in with a phone number, gets a wallet that's ready to use, saves token art safely, and keeps launch history in one place.",
      heroTitle: "Launch bright little tokens with one phone tap.",
      imageFieldHint: "PNG, JPG, WEBP up to 4MB",
      imageFieldLabel: "Token art",
      imageFieldStorageHint: "Saved safely and reused across the studio and wallet service.",
      imageUploadFailed: "Image upload failed.",
      initialSupplyFieldLabel: "Initial supply",
      launchReadyBodyLoggedOut:
        "Phone login sets up your wallet automatically and helps cover sending fees.",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} is ready to ship",
      launchReadyTitleLoggedOut: "Connect by phone to open your wallet",
      launchedLabel: "Launched",
      membersStatCaption: "members joined",
      membersStatLabel: "Members",
      mineStatCaption: "tokens created from your wallet",
      mineStatLabel: "Mine",
      nameFieldLabel: "Name",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "Easy setup",
      openWalletService: "Open wallet service",
      ownerLabel: "Owner",
      smartAccountHint: "Your new tokens land in the wallet you're using now.",
      studioEyebrow: "Token Studio",
      studioTag: "Studio live",
      studioTitle: "Create a token",
      supplyLabel: "Supply",
      symbolFieldLabel: "Symbol",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "Token deployment failed.",
      tokenSaveFailed: "The token was created, but saving its launch record failed."
    },
    nav: {
      backToStudio: "Back to studio",
      walletService: "Wallet service"
    },
    wallet: {
      activeWalletEyebrow: "Active wallet",
      activeWalletLoggedOut: "Connect by phone",
      amountFieldLabel: "Amount",
      amountPlaceholder: "Available: {amount}",
      connectByPhone: "Connect by phone",
      connectRequiredNote: "Phone login is required to fetch balances and send community tokens.",
      emptyMembers: "No members matched your search yet.",
      emptyTokens: "No tokens have been issued yet.",
      headerEyebrow: "Wallet service",
      headerTitle: "Balances, members, and token send",
      loadingTokens: "Loading tokens...",
      myBalanceLabel: "My balance",
      pickRecipientError: "Pick a token and a recipient before sending.",
      searchFieldLabel: "Member search",
      searchFieldPlaceholder: "Display name, phone tail, wallet...",
      selfTransferError: "Sending to your own wallet is blocked in this demo.",
      sendButton: "Send token",
      sendEyebrow: "Send token",
      sendInProgress: "Sending token...",
      sendSuccess: "Sent {amount} {symbol} to {name}.",
      sendTitle: "Search a member and transfer",
      smartAccountNote: "This wallet is ready to use, and sending fees are covered for you.",
      tokenCountSuffix: "tokens",
      tokenFieldLabel: "Token",
      tokenListEyebrow: "Community token list",
      tokenListTitle: "Issued tokens",
      transferFailed: "Token transfer failed."
    }
  },
  ja: {
    common: {
      brand: "Oasis Token Arcade",
      fallbackMascotAlt: "代替マスコット",
      mascotAlt: "オアシスマスコット",
      tokenPreviewAlt: "トークンプレビュー",
      uploadMascotAlt: "アップロードマスコット"
    },
    connect: {
      appDescription: "電話番号ログインで、かんたんにトークンを作って送れるサービス",
      modalTitle: "電話番号で接続",
      welcomeSubtitle: "すべてのメンバーに、すぐ使えるウォレットと手数料サポートを用意します",
      welcomeTitle: "Oasis Token Arcadeへようこそ"
    },
    home: {
      boardEmpty: "最初のトークンを発行すると、ここにすぐ表示されます。",
      boardSavedPrefix: "保存済み · ",
      boardTitle: "あなたのローンチボード",
      communityLaunchesEyebrow: "コミュニティローンチ",
      communityLaunchesTitle: "メンバーが発行した最新トークン",
      communityOwnerLabel: "所有者",
      communityStatCaption: "発行済みトークン数",
      communityStatLabel: "コミュニティ",
      defaultDescriptionTemplate: "{brand} から発行された {name} トークン",
      deployButton: "トークンを発行",
      deployingButton: "トークンを発行中...",
      deploySuccess: "トークンを発行しました: {address}",
      descriptionFieldLabel: "説明",
      descriptionFieldPlaceholder: "次のローンチキャンペーンのための、軽やかなコミュニティトークンです。",
      emptyImageError: "トークン画像をアップロードしてください。",
      emptyWalletError: "発行前に電話番号ウォレットを接続してください。",
      gasSponsoredTag: "手数料サポート",
      heroDescription:
        "すべてのメンバーは電話番号でログインし、すぐ使えるウォレットを受け取り、トークン画像を安全に保存し、発行履歴をまとめて管理できます。",
      heroTitle: "電話番号ひとつで、明るいトークンを発行しましょう。",
      imageFieldHint: "PNG、JPG、WEBP、最大4MB",
      imageFieldLabel: "トークン画像",
      imageFieldStorageHint: "アップロードした画像は安全に保存され、スタジオとウォレットサービスの両方で使われます。",
      imageUploadFailed: "画像のアップロードに失敗しました。",
      initialSupplyFieldLabel: "初期供給量",
      launchReadyBodyLoggedOut:
        "電話番号でログインすると、ウォレットが自動で準備され、送金手数料もサポートされます。",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} さん、すぐにローンチできます",
      launchReadyTitleLoggedOut: "電話番号で接続してウォレットを開きましょう",
      launchedLabel: "発行日",
      membersStatCaption: "参加メンバー数",
      membersStatLabel: "メンバー",
      mineStatCaption: "あなたが作ったトークン数",
      mineStatLabel: "自分",
      nameFieldLabel: "名前",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "かんたん開始",
      openWalletService: "ウォレットサービスを開く",
      ownerLabel: "所有者",
      smartAccountHint: "発行が終わると、今つないでいるウォレットですぐ受け取れます。",
      studioEyebrow: "トークンスタジオ",
      studioTag: "スタジオ稼働中",
      studioTitle: "トークンを作成",
      supplyLabel: "供給量",
      symbolFieldLabel: "シンボル",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "トークンの発行に失敗しました。",
      tokenSaveFailed: "トークンは発行できましたが、発行履歴の保存に失敗しました。"
    },
    nav: {
      backToStudio: "スタジオへ戻る",
      walletService: "ウォレットサービス"
    },
    wallet: {
      activeWalletEyebrow: "現在のウォレット",
      activeWalletLoggedOut: "電話番号で接続",
      amountFieldLabel: "数量",
      amountPlaceholder: "利用可能: {amount}",
      connectByPhone: "電話番号で接続",
      connectRequiredNote: "残高確認とトークン送信には電話番号ログインが必要です。",
      emptyMembers: "検索条件に一致するメンバーがまだいません。",
      emptyTokens: "まだ発行されたトークンはありません。",
      headerEyebrow: "ウォレットサービス",
      headerTitle: "残高確認、メンバー検索、トークン送信",
      loadingTokens: "トークンを読み込み中...",
      myBalanceLabel: "自分の残高",
      pickRecipientError: "送信する前にトークンと受取人を選択してください。",
      searchFieldLabel: "メンバー検索",
      searchFieldPlaceholder: "名前、電話番号下4桁、ウォレット...",
      selfTransferError: "このデモでは自分自身への送信は無効です。",
      sendButton: "トークンを送る",
      sendEyebrow: "トークン送信",
      sendInProgress: "トークンを送信中...",
      sendSuccess: "{name} さんに {amount} {symbol} を送信しました。",
      sendTitle: "メンバーを検索してトークン送信",
      smartAccountNote: "このウォレットはすぐ使えて、送金手数料もサポートされています。",
      tokenCountSuffix: "トークン",
      tokenFieldLabel: "トークン",
      tokenListEyebrow: "コミュニティトークン一覧",
      tokenListTitle: "発行済みトークン一覧",
      transferFailed: "トークン送信に失敗しました。"
    }
  },
  "zh-CN": {
    common: {
      brand: "Oasis Token Arcade",
      fallbackMascotAlt: "备用吉祥物",
      mascotAlt: "绿洲吉祥物",
      tokenPreviewAlt: "代币预览",
      uploadMascotAlt: "上传吉祥物"
    },
    connect: {
      appDescription: "通过手机号登录，轻松创建和发送代币",
      modalTitle: "手机号连接",
      welcomeSubtitle: "每位会员都会获得一个开箱即用的钱包，并享受手续费支持",
      welcomeTitle: "进入 Oasis Token Arcade"
    },
    home: {
      boardEmpty: "发行第一个代币后，它会立即显示在这里。",
      boardSavedPrefix: "已保存 · ",
      boardTitle: "你的发行面板",
      communityLaunchesEyebrow: "社区发行",
      communityLaunchesTitle: "会员刚发行的代币",
      communityOwnerLabel: "拥有者",
      communityStatCaption: "已发行代币数",
      communityStatLabel: "社区",
      defaultDescriptionTemplate: "{brand} 发行的 {name} 代币",
      deployButton: "发行代币",
      deployingButton: "正在发行代币...",
      deploySuccess: "代币已发行：{address}",
      descriptionFieldLabel: "说明",
      descriptionFieldPlaceholder: "一个轻快有趣、适合下一次活动的社区代币。",
      emptyImageError: "请上传代币图片。",
      emptyWalletError: "发行前请先连接手机号钱包。",
      gasSponsoredTag: "手续费支持",
      heroDescription:
        "每位会员都通过手机号登录，获得一个已准备好的钱包，代币图片会被安全保存，发行记录也会集中保留。",
      heroTitle: "只用一次手机号点击，就能发行亮眼的代币。",
      imageFieldHint: "PNG、JPG、WEBP，最大 4MB",
      imageFieldLabel: "代币图片",
      imageFieldStorageHint: "上传后的图片会被安全保存，并在工作室和钱包服务中重复使用。",
      imageUploadFailed: "图片上传失败。",
      initialSupplyFieldLabel: "初始发行量",
      launchReadyBodyLoggedOut: "手机号登录后会自动为你准备好钱包，并帮助承担发送手续费。",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name}，已经可以开始发行",
      launchReadyTitleLoggedOut: "手机号连接即可打开你的钱包",
      launchedLabel: "发行时间",
      membersStatCaption: "已加入会员数",
      membersStatLabel: "会员",
      mineStatCaption: "你创建的代币数",
      mineStatLabel: "我的",
      nameFieldLabel: "名称",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "轻松开始",
      openWalletService: "打开钱包服务",
      ownerLabel: "拥有者",
      smartAccountHint: "发行完成后，代币会直接进入你当前使用的钱包。",
      studioEyebrow: "代币工作室",
      studioTag: "工作室在线",
      studioTitle: "创建代币",
      supplyLabel: "发行量",
      symbolFieldLabel: "符号",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "代币发行失败。",
      tokenSaveFailed: "代币已创建，但保存发行记录失败。"
    },
    nav: {
      backToStudio: "返回工作室",
      walletService: "钱包服务"
    },
    wallet: {
      activeWalletEyebrow: "当前钱包",
      activeWalletLoggedOut: "用手机号连接",
      amountFieldLabel: "数量",
      amountPlaceholder: "可用数量：{amount}",
      connectByPhone: "用手机号连接",
      connectRequiredNote: "查看余额和发送社区代币都需要手机号登录。",
      emptyMembers: "还没有匹配搜索条件的会员。",
      emptyTokens: "还没有发行任何代币。",
      headerEyebrow: "钱包服务",
      headerTitle: "余额、会员搜索与代币发送",
      loadingTokens: "正在加载代币...",
      myBalanceLabel: "我的余额",
      pickRecipientError: "发送前请先选择代币和接收会员。",
      searchFieldLabel: "搜索会员",
      searchFieldPlaceholder: "名称、手机号尾号、钱包地址...",
      selfTransferError: "此演示中禁止向自己的钱包发送。",
      sendButton: "发送代币",
      sendEyebrow: "发送代币",
      sendInProgress: "正在发送代币...",
      sendSuccess: "已向 {name} 发送 {amount} {symbol}。",
      sendTitle: "搜索会员并发送代币",
      smartAccountNote: "这个钱包已经为你准备好，发送时的手续费也会得到支持。",
      tokenCountSuffix: "个代币",
      tokenFieldLabel: "代币",
      tokenListEyebrow: "社区代币列表",
      tokenListTitle: "已发行代币列表",
      transferFailed: "代币发送失败。"
    }
  }
} as const;

export type AppDictionary = (typeof dictionaries)[AppLocale];

export function isAppLocale(value: string): value is AppLocale {
  return (appLocales as readonly string[]).includes(value);
}

export function getLocaleFromValue(value?: string | null): AppLocale {
  if (value && isAppLocale(value)) {
    return value;
  }

  return defaultLocale;
}

export function resolveLocaleFromRequest(acceptLanguage?: string | null): AppLocale {
  const normalized = acceptLanguage?.toLowerCase() ?? "";

  if (normalized.includes("ko")) {
    return "ko";
  }

  if (normalized.includes("ja")) {
    return "ja";
  }

  if (normalized.includes("zh")) {
    return "zh-CN";
  }

  if (normalized.includes("en")) {
    return "en";
  }

  return defaultLocale;
}

export function getRequestLocale({
  acceptLanguage,
  cookieLocale
}: {
  acceptLanguage?: string | null;
  cookieLocale?: string | null;
}): AppLocale {
  if (cookieLocale) {
    return getLocaleFromValue(cookieLocale);
  }

  return resolveLocaleFromRequest(acceptLanguage);
}

export function getDictionary(locale: AppLocale): AppDictionary {
  return dictionaries[locale];
}

export function getIntlLocale(locale: AppLocale) {
  return intlLocaleMap[locale];
}

export function getThirdwebLocale(locale: AppLocale): LocaleId {
  return thirdwebLocaleMap[locale];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number | undefined>
) {
  return Object.entries(values).reduce((message, [key, value]) => {
    return message.replaceAll(`{${key}}`, String(value ?? ""));
  }, template);
}
