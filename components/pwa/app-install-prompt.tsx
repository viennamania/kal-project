"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

const copyByLocale = {
  ko: {
    close: "닫기",
    installButton: "앱처럼 설치",
    iosBody:
      "아래 공유 버튼을 누른 뒤 ‘홈 화면에 추가’를 선택하면 오아시스를 앱처럼 바탕화면에 둘 수 있습니다.",
    iosStepOne: "브라우저의 공유 버튼을 누르기",
    iosStepTwo: "‘홈 화면에 추가’ 선택",
    iosTitle: "홈 화면에 추가",
    readyBody: "앱처럼 설치하면 다음부터 더 빠르게 바로 열 수 있습니다.",
    readyTitle: "오아시스를 바탕화면에 놓아보세요"
  },
  en: {
    close: "Close",
    installButton: "Install app",
    iosBody:
      "Tap the share button below and choose ‘Add to Home Screen’ to keep Oasis on your home screen like an app.",
    iosStepOne: "Tap the browser share button",
    iosStepTwo: "Choose ‘Add to Home Screen’",
    iosTitle: "Add to Home Screen",
    readyBody: "Install the app to launch Oasis faster from your home screen next time.",
    readyTitle: "Keep Oasis on your home screen"
  },
  ja: {
    close: "閉じる",
    installButton: "アプリとして追加",
    iosBody:
      "下の共有ボタンを押して「ホーム画面に追加」を選ぶと、Oasis をアプリのようにホーム画面へ置けます。",
    iosStepOne: "ブラウザの共有ボタンを押す",
    iosStepTwo: "「ホーム画面に追加」を選ぶ",
    iosTitle: "ホーム画面に追加",
    readyBody: "アプリのように追加すると、次からホーム画面からすぐ開けます。",
    readyTitle: "Oasis をホーム画面に置きましょう"
  },
  "zh-CN": {
    close: "关闭",
    installButton: "安装为应用",
    iosBody:
      "点击下方分享按钮，再选择“添加到主屏幕”，就可以像应用一样把 Oasis 放到手机桌面。",
    iosStepOne: "点击浏览器分享按钮",
    iosStepTwo: "选择“添加到主屏幕”",
    iosTitle: "添加到主屏幕",
    readyBody: "安装后，下次就可以从桌面更快地打开 Oasis。",
    readyTitle: "把 Oasis 放到手机桌面"
  }
} as const;

const INSTALL_DISMISSED_KEY = "oasis-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
}

export function AppInstallPrompt() {
  const { locale } = useLocale();
  const copy = copyByLocale[locale];
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIosInstallHintOpen, setIsIosInstallHintOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [platform, setPlatform] = useState<"ios" | "prompt" | "unsupported">("unsupported");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isStandalone()) {
      return;
    }

    const dismissed = window.localStorage.getItem(INSTALL_DISMISSED_KEY) === "1";
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIosDevice) {
      setPlatform("ios");
      setIsHidden(dismissed);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setPlatform("prompt");
      setIsHidden(dismissed);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsHidden(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator &&
      window.location.protocol === "https:"
    ) {
      const registerServiceWorker = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      };

      if (document.readyState === "complete") {
        void registerServiceWorker();
      } else {
        window.addEventListener("load", registerServiceWorker, { once: true });
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const canShow = useMemo(() => !isHidden && !isStandalone(), [isHidden]);

  async function handleInstall() {
    if (platform === "ios") {
      setIsIosInstallHintOpen(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
      setIsHidden(true);
      return;
    }

    setIsHidden(true);
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  }

  function dismissPrompt() {
    setIsHidden(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
    }
  }

  if (!canShow) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
        <div className="pointer-events-auto max-w-md">
          <Panel className="border border-white/80 bg-white/85 px-4 py-3 shadow-bubble">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky/20 text-ink">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{copy.readyTitle}</p>
                <p className="mt-1 text-sm leading-6 text-ink/65">{copy.readyBody}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button className="min-h-11 px-4" onClick={handleInstall} type="button">
                    <Download className="mr-2 h-4 w-4" />
                    {copy.installButton}
                  </Button>
                  <Button onClick={dismissPrompt} type="button" variant="ghost">
                    {copy.close}
                  </Button>
                </div>
              </div>
              <button
                aria-label={copy.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/45 transition hover:bg-white hover:text-ink"
                onClick={dismissPrompt}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {platform === "ios" && isIosInstallHintOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 sm:items-center">
          <Panel className="w-full max-w-md rounded-[32px] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/45">
                  PWA
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">{copy.iosTitle}</h2>
              </div>
              <button
                aria-label={copy.close}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-bubble text-ink"
                onClick={() => setIsIosInstallHintOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-ink/70">{copy.iosBody}</p>

            <div className="mt-5 space-y-3">
              <div className="rounded-[24px] bg-bubble px-4 py-3 text-sm font-medium text-ink">
                1. {copy.iosStepOne}
              </div>
              <div className="rounded-[24px] bg-bubble px-4 py-3 text-sm font-medium text-ink">
                2. {copy.iosStepTwo}
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-sky/20 bg-sky/10 px-4 py-3 text-sm text-ink/70">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>{copy.installButton}</span>
              </div>
            </div>

            <Button className="mt-5 w-full" onClick={() => setIsIosInstallHintOpen(false)} type="button">
              {copy.close}
            </Button>
          </Panel>
        </div>
      ) : null}
    </>
  );
}
