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
      appDescription: "전화번호 로그인과 스마트 계정으로 BSC 토큰을 쉽게 발행하는 스튜디오",
      modalTitle: "전화번호로 연결",
      welcomeSubtitle: "모든 회원에게 BSC 스마트 계정과 가스 스폰서를 제공합니다",
      welcomeTitle: "오아시스 토큰 아케이드 입장"
    },
    home: {
      boardEmpty: "첫 토큰을 발행하면 이 보드에 바로 나타납니다.",
      boardSavedPrefix: "Atlas 저장 · ",
      boardTitle: "내 런치 보드",
      communityLaunchesEyebrow: "커뮤니티 런치",
      communityLaunchesTitle: "회원들이 막 발행한 토큰",
      communityOwnerLabel: "소유자",
      communityStatCaption: "발행된 토큰 컨트랙트 수",
      communityStatLabel: "커뮤니티",
      defaultDescriptionTemplate: "{brand}에서 발행한 {name} 토큰",
      deployButton: "BSC에서 토큰 발행하기",
      deployingButton: "토큰 발행 중...",
      deploySuccess: "토큰이 발행되었습니다: {address}",
      descriptionFieldLabel: "설명",
      descriptionFieldPlaceholder: "다음 런치 캠페인을 위한 산뜻한 커뮤니티 토큰입니다.",
      emptyImageError: "토큰 이미지를 업로드해 주세요.",
      emptyWalletError: "토큰을 발행하려면 먼저 전화번호 지갑을 연결해야 합니다.",
      gasSponsoredTag: "가스 스폰서",
      heroDescription:
        "모든 회원은 전화번호로 로그인하고, 가스가 스폰서되는 스마트 계정을 받으며, Vercel Blob에 토큰 이미지를 저장하고, Atlas MongoDB에 컨트랙트를 기록합니다.",
      heroTitle: "전화번호 한 번으로 산뜻한 토큰을 발행하세요.",
      imageFieldHint: "PNG, JPG, WEBP, 최대 4MB",
      imageFieldLabel: "토큰 이미지",
      imageFieldStorageHint: "Vercel Blob에 저장되고 스튜디오와 지갑 서비스에서 함께 사용됩니다.",
      imageUploadFailed: "이미지 업로드에 실패했습니다.",
      initialSupplyFieldLabel: "초기 발행량",
      launchReadyBodyLoggedOut:
        "전화번호 로그인만 허용되며, 스마트 계정 가스는 자동으로 스폰서됩니다.",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} 님, 바로 런치할 수 있어요",
      launchReadyTitleLoggedOut: "전화번호 연결로 지갑 스튜디오를 열어보세요",
      launchedLabel: "발행일",
      membersStatCaption: "온보딩된 스마트 계정 수",
      membersStatLabel: "회원",
      mineStatCaption: "내 지갑에서 발행한 컨트랙트 수",
      mineStatLabel: "내 토큰",
      nameFieldLabel: "이름",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "BSC 메인넷",
      openWalletService: "지갑 서비스 열기",
      ownerLabel: "소유자",
      smartAccountHint: "발행 직후 연결된 스마트 계정으로 바로 민팅됩니다.",
      studioEyebrow: "ERC20 스튜디오",
      studioTag: "스튜디오 오픈",
      studioTitle: "BSC 토큰 만들기",
      supplyLabel: "발행량",
      symbolFieldLabel: "심볼",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "토큰 발행에 실패했습니다.",
      tokenSaveFailed: "온체인 발행은 완료됐지만 데이터베이스 저장에 실패했습니다."
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
      smartAccountNote: "BSC 스마트 계정이며 가스 스폰서 기능이 활성화되어 있습니다.",
      tokenCountSuffix: "개 토큰",
      tokenFieldLabel: "토큰",
      tokenListEyebrow: "커뮤니티 토큰 목록",
      tokenListTitle: "발행된 전체 컨트랙트",
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
      appDescription: "Phone-first BSC token studio with smart accounts and sponsored gas",
      modalTitle: "Connect by phone",
      welcomeSubtitle: "Every member gets a BSC smart account with sponsored gas",
      welcomeTitle: "Enter Oasis Token Arcade"
    },
    home: {
      boardEmpty: "Your first token will appear here as soon as you launch one.",
      boardSavedPrefix: "Saved to Atlas · ",
      boardTitle: "Your launch board",
      communityLaunchesEyebrow: "Community launches",
      communityLaunchesTitle: "Fresh tokens from members",
      communityOwnerLabel: "Owner",
      communityStatCaption: "issued token contracts",
      communityStatLabel: "Community",
      defaultDescriptionTemplate: "{name} token launched from {brand}",
      deployButton: "Deploy token on BSC",
      deployingButton: "Deploying token...",
      deploySuccess: "Token deployed at {address}.",
      descriptionFieldLabel: "Description",
      descriptionFieldPlaceholder: "A playful community token for the next launch campaign.",
      emptyImageError: "Token art is required.",
      emptyWalletError: "Phone wallet must be connected before deployment.",
      gasSponsoredTag: "Gas sponsored",
      heroDescription:
        "Every member logs in by phone, receives a sponsored smart account, uploads token art to Vercel Blob, and stores contracts in Atlas MongoDB.",
      heroTitle: "Launch bright little tokens with one phone tap.",
      imageFieldHint: "PNG, JPG, WEBP up to 4MB",
      imageFieldLabel: "Token art",
      imageFieldStorageHint: "Stored in Vercel Blob and reused across studio and wallet service.",
      imageUploadFailed: "Image upload failed.",
      initialSupplyFieldLabel: "Initial supply",
      launchReadyBodyLoggedOut:
        "Only phone login is enabled, and smart account gas is sponsored automatically.",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} is ready to ship",
      launchReadyTitleLoggedOut: "Phone connect unlocks your wallet studio",
      launchedLabel: "Launched",
      membersStatCaption: "smart accounts onboarded",
      membersStatLabel: "Members",
      mineStatCaption: "contracts launched from your wallet",
      mineStatLabel: "Mine",
      nameFieldLabel: "Name",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "BSC mainnet",
      openWalletService: "Open wallet service",
      ownerLabel: "Owner",
      smartAccountHint: "Minted directly to your connected smart account after deployment.",
      studioEyebrow: "ERC20 Studio",
      studioTag: "Studio live",
      studioTitle: "Create a BSC token",
      supplyLabel: "Supply",
      symbolFieldLabel: "Symbol",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "Token deployment failed.",
      tokenSaveFailed: "Contract deployed onchain but database sync failed."
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
      smartAccountNote: "Smart account on BSC with sponsored gas enabled.",
      tokenCountSuffix: "tokens",
      tokenFieldLabel: "Token",
      tokenListEyebrow: "Community token list",
      tokenListTitle: "All issued contracts",
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
      appDescription: "電話番号ログインとスマートアカウントで使うBSCトークンスタジオ",
      modalTitle: "電話番号で接続",
      welcomeSubtitle: "すべてのメンバーにBSCスマートアカウントとガススポンサーを提供します",
      welcomeTitle: "Oasis Token Arcadeへようこそ"
    },
    home: {
      boardEmpty: "最初のトークンを発行すると、ここにすぐ表示されます。",
      boardSavedPrefix: "Atlas保存済み · ",
      boardTitle: "あなたのローンチボード",
      communityLaunchesEyebrow: "コミュニティローンチ",
      communityLaunchesTitle: "メンバーが発行した最新トークン",
      communityOwnerLabel: "所有者",
      communityStatCaption: "発行済みトークンコントラクト数",
      communityStatLabel: "コミュニティ",
      defaultDescriptionTemplate: "{brand} から発行された {name} トークン",
      deployButton: "BSCでトークンを発行",
      deployingButton: "トークンを発行中...",
      deploySuccess: "トークンを発行しました: {address}",
      descriptionFieldLabel: "説明",
      descriptionFieldPlaceholder: "次のローンチキャンペーンのための、軽やかなコミュニティトークンです。",
      emptyImageError: "トークン画像をアップロードしてください。",
      emptyWalletError: "発行前に電話番号ウォレットを接続してください。",
      gasSponsoredTag: "ガススポンサー",
      heroDescription:
        "すべてのメンバーは電話番号でログインし、ガスがスポンサーされたスマートアカウントを受け取り、Vercel Blobに画像を保存し、Atlas MongoDBにコントラクトを記録します。",
      heroTitle: "電話番号ひとつで、明るいトークンを発行しましょう。",
      imageFieldHint: "PNG、JPG、WEBP、最大4MB",
      imageFieldLabel: "トークン画像",
      imageFieldStorageHint: "Vercel Blobに保存され、スタジオとウォレットサービスの両方で使われます。",
      imageUploadFailed: "画像のアップロードに失敗しました。",
      initialSupplyFieldLabel: "初期供給量",
      launchReadyBodyLoggedOut:
        "電話番号ログインのみ利用でき、スマートアカウントのガスは自動でスポンサーされます。",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name} さん、すぐにローンチできます",
      launchReadyTitleLoggedOut: "電話番号接続でウォレットスタジオを開きましょう",
      launchedLabel: "発行日",
      membersStatCaption: "オンボード済みスマートアカウント数",
      membersStatLabel: "メンバー",
      mineStatCaption: "あなたのウォレットから発行したコントラクト数",
      mineStatLabel: "自分",
      nameFieldLabel: "名前",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "BSCメインネット",
      openWalletService: "ウォレットサービスを開く",
      ownerLabel: "所有者",
      smartAccountHint: "発行後すぐ、接続中のスマートアカウントへミントされます。",
      studioEyebrow: "ERC20スタジオ",
      studioTag: "スタジオ稼働中",
      studioTitle: "BSCトークンを作成",
      supplyLabel: "供給量",
      symbolFieldLabel: "シンボル",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "トークンの発行に失敗しました。",
      tokenSaveFailed: "オンチェーン発行は完了しましたが、データベース同期に失敗しました。"
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
      smartAccountNote: "BSCスマートアカウントで、ガススポンサーが有効です。",
      tokenCountSuffix: "トークン",
      tokenFieldLabel: "トークン",
      tokenListEyebrow: "コミュニティトークン一覧",
      tokenListTitle: "発行済みコントラクト一覧",
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
      appDescription: "通过手机号登录和智能账户快速创建 BSC 代币",
      modalTitle: "手机号连接",
      welcomeSubtitle: "每位会员都会获得 BSC 智能账户和 Gas 赞助",
      welcomeTitle: "进入 Oasis Token Arcade"
    },
    home: {
      boardEmpty: "发行第一个代币后，它会立即显示在这里。",
      boardSavedPrefix: "已保存到 Atlas · ",
      boardTitle: "你的发行面板",
      communityLaunchesEyebrow: "社区发行",
      communityLaunchesTitle: "会员刚发行的代币",
      communityOwnerLabel: "拥有者",
      communityStatCaption: "已发行的代币合约数",
      communityStatLabel: "社区",
      defaultDescriptionTemplate: "{brand} 发行的 {name} 代币",
      deployButton: "在 BSC 上发行代币",
      deployingButton: "正在发行代币...",
      deploySuccess: "代币已发行：{address}",
      descriptionFieldLabel: "说明",
      descriptionFieldPlaceholder: "一个轻快有趣、适合下一次活动的社区代币。",
      emptyImageError: "请上传代币图片。",
      emptyWalletError: "发行前请先连接手机号钱包。",
      gasSponsoredTag: "Gas 赞助",
      heroDescription:
        "每位会员都通过手机号登录，获得带 Gas 赞助的智能账户，把代币图片上传到 Vercel Blob，并将合约记录到 Atlas MongoDB。",
      heroTitle: "只用一次手机号点击，就能发行亮眼的代币。",
      imageFieldHint: "PNG、JPG、WEBP，最大 4MB",
      imageFieldLabel: "代币图片",
      imageFieldStorageHint: "图片会存入 Vercel Blob，并在工作室和钱包服务中复用。",
      imageUploadFailed: "图片上传失败。",
      initialSupplyFieldLabel: "初始发行量",
      launchReadyBodyLoggedOut: "当前仅支持手机号登录，智能账户 Gas 会自动赞助。",
      launchReadyBodyLoggedIn: "{phone} · {address}",
      launchReadyTitleLoggedIn: "{name}，已经可以开始发行",
      launchReadyTitleLoggedOut: "手机号连接即可开启你的钱包工作室",
      launchedLabel: "发行时间",
      membersStatCaption: "已开通的智能账户数量",
      membersStatLabel: "会员",
      mineStatCaption: "你钱包中发行的合约数量",
      mineStatLabel: "我的",
      nameFieldLabel: "名称",
      nameFieldPlaceholder: "Candy Rangers",
      networkTag: "BSC 主网",
      openWalletService: "打开钱包服务",
      ownerLabel: "拥有者",
      smartAccountHint: "发行后会直接铸造到你当前连接的智能账户。",
      studioEyebrow: "ERC20 工作室",
      studioTag: "工作室在线",
      studioTitle: "创建一个 BSC 代币",
      supplyLabel: "发行量",
      symbolFieldLabel: "符号",
      symbolFieldPlaceholder: "RANG",
      tokenDeployFallbackError: "代币发行失败。",
      tokenSaveFailed: "链上发行成功，但数据库同步失败。"
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
      smartAccountNote: "这是 BSC 智能账户，并已启用 Gas 赞助。",
      tokenCountSuffix: "个代币",
      tokenFieldLabel: "代币",
      tokenListEyebrow: "社区代币列表",
      tokenListTitle: "所有已发行合约",
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
