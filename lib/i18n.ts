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
      backLabel: "이전 단계",
      cancelLabel: "나중에 하기",
      closeLabel: "닫기",
      codeStepDescription: "{phone} 번호로 보낸 인증코드를 입력해 주세요.",
      codeStepTitle: "인증코드를 입력해 주세요",
      connectButtonLabel: "전화번호로 연결",
      connectedHint: "전화번호 지갑이 준비되어 있어요",
      connectedStatus: "지갑 연결됨",
      connectingStatus: "지갑 상태 확인 중...",
      disconnectButton: "지갑 연결 해제",
      disconnectCancel: "계속 연결",
      disconnectConfirm: "연결 해제",
      disconnectingStatus: "연결 해제 중...",
      disconnectDescription:
        "이 기기에서 지갑 연결을 해제합니다. 다시 쓰려면 전화번호로 다시 연결해야 합니다.",
      disconnectTitle: "지갑 연결을 해제할까요?",
      editPhoneButton: "번호 다시 입력",
      modalTitle: "전화번호로 연결",
      phoneNoticeBody:
        "한국 번호는 반드시 0으로 시작해서 입력해 주세요. 앞의 0이 빠지면 다른 지갑으로 연결될 수 있습니다.",
      phoneNoticeTitle: "항상 0으로 시작해 주세요",
      phoneNumberHint: "예시: {example}",
      phoneNumberInvalid: "전화번호 형식이 올바르지 않습니다. 숫자만 10~11자리로 입력해 주세요.",
      phoneNumberLabel: "전화번호",
      phoneNumberLeadingZero: "전화번호는 반드시 0으로 시작해야 합니다.",
      phoneNumberPlaceholder: "01012345678",
      phoneNumberRequired: "전화번호를 입력해 주세요.",
      phoneStepDescription:
        "한국 전화번호만 연결할 수 있으며, 회원 혼동을 막기 위해 번호를 항상 0으로 시작해서 입력합니다.",
      phoneStepTitle: "전화번호를 입력해 주세요",
      resendCodeButton: "인증코드 다시 보내기",
      resendCountdown: "{seconds}초 후에 인증코드를 다시 보낼 수 있습니다.",
      sendCodeButton: "인증코드 보내기",
      sendCodeFailed: "인증코드 전송에 실패했습니다.",
      sendingCodeButton: "인증코드 보내는 중...",
      verificationCodeInvalid: "인증코드 6자리를 입력해 주세요.",
      verificationCodeLabel: "인증코드",
      verificationCodePlaceholder: "123456",
      verifyCodeButton: "지갑 연결하기",
      verifyCodeFailed: "인증코드 확인에 실패했습니다.",
      verifyingCodeButton: "지갑 연결 중...",
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
      viewToken: "토큰 상세 보기",
      tokenDeployFallbackError: "토큰 발행에 실패했습니다.",
      tokenSaveFailed: "토큰은 만들어졌지만 발행 기록 저장에 실패했습니다."
    },
    nav: {
      backToStudio: "스튜디오로 돌아가기",
      manageCenter: "운영 센터",
      tokenDetails: "토큰 상세",
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
      inviteCopied: "초대 링크를 복사했습니다.",
      inviteCopyButton: "링크 복사",
      inviteCreateButton: "초대 링크 만들기",
      inviteCreating: "초대 링크 생성 중...",
      inviteEmpty: "아직 만든 초대 링크가 없습니다.",
      inviteExistingMember: "{name} ({contact}) 은 이미 가입된 회원입니다. 위에서 바로 보내기를 사용하세요.",
      inviteEyebrow: "전화번호 초대",
      inviteHint: "미가입자 전화번호와 수량을 입력하면 링크를 만들고 SNS로 공유할 수 있습니다.",
      inviteLinkReady: "초대 링크를 만들었습니다. 상대방에게 공유하세요.",
      invitePhoneLabel: "받는 사람 전화번호",
      invitePhonePlaceholder: "예: 01012345678",
      inviteRecentTitle: "최근 초대 링크",
      inviteShareLabel: "공유 링크",
      inviteStatusCancelled: "취소됨",
      inviteStatusDelivered: "지급 완료",
      inviteStatusExpired: "만료됨",
      inviteStatusFailed: "실패",
      inviteStatusPending: "대기중",
      inviteStatusProcessing: "지급 준비중",
      inviteTitle: "전화번호로 초대 링크 만들기",
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
      tokenDetailAction: "토큰 상세",
      tokenFieldLabel: "토큰",
      tokenListEyebrow: "커뮤니티 토큰 목록",
      tokenListTitle: "발행된 토큰 목록",
      tokenManageAction: "운영 센터",
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
      backLabel: "Back",
      cancelLabel: "Maybe later",
      closeLabel: "Close",
      codeStepDescription: "Enter the verification code sent to {phone}.",
      codeStepTitle: "Enter your code",
      connectButtonLabel: "Connect by phone",
      connectedHint: "Your phone wallet is ready to use",
      connectedStatus: "Wallet connected",
      connectingStatus: "Checking wallet status...",
      disconnectButton: "Disconnect wallet",
      disconnectCancel: "Keep connected",
      disconnectConfirm: "Disconnect",
      disconnectingStatus: "Disconnecting...",
      disconnectDescription:
        "This removes the wallet connection from this device. You can connect again later with your phone number.",
      disconnectTitle: "Disconnect this wallet?",
      editPhoneButton: "Edit number",
      modalTitle: "Connect by phone",
      phoneNoticeBody:
        "For Korean numbers, always start with 0. If the leading 0 is missing, a different wallet can be created.",
      phoneNoticeTitle: "Always start with 0",
      phoneNumberHint: "Example: {example}",
      phoneNumberInvalid: "Enter a valid Korean phone number using 10 to 11 digits.",
      phoneNumberLabel: "Phone number",
      phoneNumberLeadingZero: "The phone number must start with 0.",
      phoneNumberPlaceholder: "01012345678",
      phoneNumberRequired: "Phone number is required.",
      phoneStepDescription:
        "Only Korean phone numbers are supported here, and the number must always start with 0 to keep members on the same wallet.",
      phoneStepTitle: "Enter your phone number",
      resendCodeButton: "Send code again",
      resendCountdown: "You can resend the code in {seconds}s.",
      sendCodeButton: "Send verification code",
      sendCodeFailed: "Failed to send the verification code.",
      sendingCodeButton: "Sending code...",
      verificationCodeInvalid: "Enter the 6-digit verification code.",
      verificationCodeLabel: "Verification code",
      verificationCodePlaceholder: "123456",
      verifyCodeButton: "Connect wallet",
      verifyCodeFailed: "Failed to verify the code.",
      verifyingCodeButton: "Connecting wallet...",
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
      viewToken: "View token details",
      tokenDeployFallbackError: "Token deployment failed.",
      tokenSaveFailed: "The token was created, but saving its launch record failed."
    },
    nav: {
      backToStudio: "Back to studio",
      manageCenter: "Manage center",
      tokenDetails: "Token details",
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
      inviteCopied: "Invite link copied.",
      inviteCopyButton: "Copy link",
      inviteCreateButton: "Create invite link",
      inviteCreating: "Creating invite link...",
      inviteEmpty: "No invite links yet.",
      inviteExistingMember:
        "{name} ({contact}) already has a wallet. Use direct send above instead.",
      inviteEyebrow: "Phone invite",
      inviteHint:
        "Enter a phone number and amount for someone new, then share the link over SMS or social media.",
      inviteLinkReady: "Invite link created. Share it with the recipient.",
      invitePhoneLabel: "Recipient phone",
      invitePhonePlaceholder: "Example: 01012345678",
      inviteRecentTitle: "Recent invite links",
      inviteShareLabel: "Share link",
      inviteStatusCancelled: "Cancelled",
      inviteStatusDelivered: "Delivered",
      inviteStatusExpired: "Expired",
      inviteStatusFailed: "Failed",
      inviteStatusPending: "Pending",
      inviteStatusProcessing: "Processing",
      inviteTitle: "Create a phone invite link",
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
      tokenDetailAction: "Details",
      tokenFieldLabel: "Token",
      tokenListEyebrow: "Community token list",
      tokenListTitle: "Issued tokens",
      tokenManageAction: "Manage",
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
      backLabel: "前の段階へ",
      cancelLabel: "あとで",
      closeLabel: "閉じる",
      codeStepDescription: "{phone} に送られた認証コードを入力してください。",
      codeStepTitle: "認証コードを入力してください",
      connectButtonLabel: "電話番号で接続",
      connectedHint: "電話番号ウォレットはすぐ使えます",
      connectedStatus: "ウォレット接続済み",
      connectingStatus: "ウォレット状態を確認中...",
      disconnectButton: "ウォレット接続を解除",
      disconnectCancel: "このまま使う",
      disconnectConfirm: "接続を解除",
      disconnectingStatus: "接続を解除中...",
      disconnectDescription:
        "この端末でのウォレット接続を解除します。再度使うには、電話番号で接続し直してください。",
      disconnectTitle: "ウォレット接続を解除しますか？",
      editPhoneButton: "番号を修正",
      modalTitle: "電話番号で接続",
      phoneNoticeBody:
        "韓国の電話番号は必ず 0 から始めて入力してください。先頭の 0 がないと別のウォレットにつながることがあります。",
      phoneNoticeTitle: "必ず 0 から入力してください",
      phoneNumberHint: "例: {example}",
      phoneNumberInvalid: "韓国の電話番号を数字 10〜11 桁で入力してください。",
      phoneNumberLabel: "電話番号",
      phoneNumberLeadingZero: "電話番号は必ず 0 から始めてください。",
      phoneNumberPlaceholder: "01012345678",
      phoneNumberRequired: "電話番号を入力してください。",
      phoneStepDescription:
        "ここでは韓国の電話番号のみ使えます。会員が同じウォレットを使えるよう、番号は必ず 0 から始めて入力します。",
      phoneStepTitle: "電話番号を入力してください",
      resendCodeButton: "認証コードを再送",
      resendCountdown: "{seconds} 秒後に認証コードを再送できます。",
      sendCodeButton: "認証コードを送信",
      sendCodeFailed: "認証コードの送信に失敗しました。",
      sendingCodeButton: "認証コードを送信中...",
      verificationCodeInvalid: "6 桁の認証コードを入力してください。",
      verificationCodeLabel: "認証コード",
      verificationCodePlaceholder: "123456",
      verifyCodeButton: "ウォレットを接続",
      verifyCodeFailed: "認証コードの確認に失敗しました。",
      verifyingCodeButton: "ウォレット接続中...",
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
      viewToken: "トークン詳細を見る",
      tokenDeployFallbackError: "トークンの発行に失敗しました。",
      tokenSaveFailed: "トークンは発行できましたが、発行履歴の保存に失敗しました。"
    },
    nav: {
      backToStudio: "スタジオへ戻る",
      manageCenter: "運営センター",
      tokenDetails: "トークン詳細",
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
      inviteCopied: "招待リンクをコピーしました。",
      inviteCopyButton: "リンクをコピー",
      inviteCreateButton: "招待リンクを作成",
      inviteCreating: "招待リンクを作成中...",
      inviteEmpty: "まだ作成した招待リンクはありません。",
      inviteExistingMember:
        "{name} ({contact}) はすでに登録済みです。上の直接送信を使ってください。",
      inviteEyebrow: "電話番号招待",
      inviteHint:
        "未登録の電話番号と数量を入力すると、SNS で共有できる招待リンクを作成します。",
      inviteLinkReady: "招待リンクを作成しました。相手に共有してください。",
      invitePhoneLabel: "受取人の電話番号",
      invitePhonePlaceholder: "例: 01012345678",
      inviteRecentTitle: "最近の招待リンク",
      inviteShareLabel: "共有リンク",
      inviteStatusCancelled: "キャンセル済み",
      inviteStatusDelivered: "配布完了",
      inviteStatusExpired: "期限切れ",
      inviteStatusFailed: "失敗",
      inviteStatusPending: "待機中",
      inviteStatusProcessing: "処理中",
      inviteTitle: "電話番号招待リンクを作成",
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
      tokenDetailAction: "詳細",
      tokenFieldLabel: "トークン",
      tokenListEyebrow: "コミュニティトークン一覧",
      tokenListTitle: "発行済みトークン一覧",
      tokenManageAction: "運営センター",
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
      backLabel: "返回上一步",
      cancelLabel: "稍后再说",
      closeLabel: "关闭",
      codeStepDescription: "请输入发送到 {phone} 的验证码。",
      codeStepTitle: "输入验证码",
      connectButtonLabel: "手机号连接",
      connectedHint: "你的手机号钱包已经准备好了",
      connectedStatus: "钱包已连接",
      connectingStatus: "正在检查钱包状态...",
      disconnectButton: "断开钱包连接",
      disconnectCancel: "继续保持连接",
      disconnectConfirm: "断开连接",
      disconnectingStatus: "正在断开连接...",
      disconnectDescription:
        "这会移除当前设备上的钱包连接。之后仍可用手机号重新连接。",
      disconnectTitle: "要断开这个钱包吗？",
      editPhoneButton: "修改号码",
      modalTitle: "手机号连接",
      phoneNoticeBody:
        "韩国手机号必须以 0 开头输入。如果开头的 0 缺失，可能会连接到另一个钱包。",
      phoneNoticeTitle: "请始终以 0 开头",
      phoneNumberHint: "示例：{example}",
      phoneNumberInvalid: "请输入正确的韩国手机号，长度为 10 到 11 位数字。",
      phoneNumberLabel: "手机号",
      phoneNumberLeadingZero: "手机号必须以 0 开头。",
      phoneNumberPlaceholder: "01012345678",
      phoneNumberRequired: "请输入手机号。",
      phoneStepDescription:
        "这里仅支持韩国手机号。为避免会员连到不同钱包，号码必须始终以 0 开头输入。",
      phoneStepTitle: "请输入手机号",
      resendCodeButton: "重新发送验证码",
      resendCountdown: "{seconds} 秒后可重新发送验证码。",
      sendCodeButton: "发送验证码",
      sendCodeFailed: "发送验证码失败。",
      sendingCodeButton: "正在发送验证码...",
      verificationCodeInvalid: "请输入 6 位验证码。",
      verificationCodeLabel: "验证码",
      verificationCodePlaceholder: "123456",
      verifyCodeButton: "连接钱包",
      verifyCodeFailed: "验证码校验失败。",
      verifyingCodeButton: "正在连接钱包...",
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
      viewToken: "查看代币详情",
      tokenDeployFallbackError: "代币发行失败。",
      tokenSaveFailed: "代币已创建，但保存发行记录失败。"
    },
    nav: {
      backToStudio: "返回工作室",
      manageCenter: "运营中心",
      tokenDetails: "代币详情",
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
      inviteCopied: "邀请链接已复制。",
      inviteCopyButton: "复制链接",
      inviteCreateButton: "创建邀请链接",
      inviteCreating: "正在创建邀请链接...",
      inviteEmpty: "还没有创建任何邀请链接。",
      inviteExistingMember: "{name} ({contact}) 已经注册，请直接使用上方转账。",
      inviteEyebrow: "手机号邀请",
      inviteHint: "输入未注册用户的手机号和数量，生成可通过短信或社交媒体分享的链接。",
      inviteLinkReady: "邀请链接已生成，请分享给对方。",
      invitePhoneLabel: "接收人手机号",
      invitePhonePlaceholder: "例如：01012345678",
      inviteRecentTitle: "最近邀请链接",
      inviteShareLabel: "分享链接",
      inviteStatusCancelled: "已取消",
      inviteStatusDelivered: "已发放",
      inviteStatusExpired: "已过期",
      inviteStatusFailed: "失败",
      inviteStatusPending: "待领取",
      inviteStatusProcessing: "处理中",
      inviteTitle: "创建手机号邀请链接",
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
      tokenDetailAction: "详情",
      tokenFieldLabel: "代币",
      tokenListEyebrow: "社区代币列表",
      tokenListTitle: "已发行代币列表",
      tokenManageAction: "运营中心",
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
