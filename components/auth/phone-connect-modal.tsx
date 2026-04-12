"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldAlert, X } from "lucide-react";
import { useConnect } from "thirdweb/react";
import { preAuthenticate } from "thirdweb/wallets/in-app";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMessage } from "@/lib/i18n";
import { appChain, phoneWallet, thirdwebClient } from "@/lib/thirdweb";

const KR_DIALING_CODE = "+82";

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function sanitizeSubscriberDigits(value: string) {
  const digits = sanitizeDigits(value);
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;

  return withoutLeadingZero.slice(0, 10);
}

function formatPhonePreview(value: string) {
  if (value.length <= 3) {
    return value;
  }

  if (value.length <= 7) {
    return `${value.slice(0, 3)}-${value.slice(3)}`;
  }

  return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
}

type ConnectStep = "phone" | "code";

export function PhoneConnectModal({
  onClose,
  open
}: {
  onClose: () => void;
  open: boolean;
}) {
  const { dictionary } = useLocale();
  const copy = dictionary.connect;
  const { connect, isConnecting } = useConnect({
    client: thirdwebClient
  });
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [step, setStep] = useState<ConnectStep>("phone");
  const [subscriberPhoneNumber, setSubscriberPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const isBusy = isConnecting || isSendingCode;
  const localPhoneNumber = subscriberPhoneNumber ? `0${subscriberPhoneNumber}` : "";
  const phoneNumberPlaceholder = copy.phoneNumberPlaceholder.startsWith("0")
    ? copy.phoneNumberPlaceholder.slice(1)
    : copy.phoneNumberPlaceholder;

  function resetState() {
    setCountdown(0);
    setErrorMessage(null);
    setIsSendingCode(false);
    setStep("phone");
    setSubscriberPhoneNumber("");
    setVerificationCode("");
  }

  function closeModal() {
    if (isBusy) {
      return;
    }

    resetState();
    onClose();
  }

  function getPhoneValidationMessage(digits: string) {
    if (!digits) {
      return copy.phoneNumberRequired;
    }

    if (!digits.startsWith("0")) {
      return copy.phoneNumberLeadingZero;
    }

    if (!/^0\d{9,10}$/.test(digits)) {
      return copy.phoneNumberInvalid;
    }

    return null;
  }

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown, open]);

  async function sendCode() {
    const phoneError = getPhoneValidationMessage(localPhoneNumber);

    if (phoneError) {
      setErrorMessage(phoneError);
      return;
    }

    setErrorMessage(null);
    setIsSendingCode(true);

    try {
      await preAuthenticate({
        client: thirdwebClient,
        phoneNumber: `${KR_DIALING_CODE}${localPhoneNumber}`,
        strategy: "phone"
      });

      setCountdown(60);
      setStep("code");
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message ? error.message : copy.sendCodeFailed
      );
    } finally {
      setIsSendingCode(false);
    }
  }

  async function verifyCode() {
    if (verificationCode.length !== 6) {
      setErrorMessage(copy.verificationCodeInvalid);
      return;
    }

    setErrorMessage(null);

    try {
      const account = await connect(async () => {
        await phoneWallet.connect({
          chain: appChain,
          client: thirdwebClient,
          phoneNumber: `${KR_DIALING_CODE}${localPhoneNumber}`,
          strategy: "phone",
          verificationCode
        });

        return phoneWallet;
      });

      if (!account) {
        throw new Error(copy.verifyCodeFailed);
      }

      closeModal();
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message ? error.message : copy.verifyCodeFailed
      );
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[95] flex bg-[#1E2451]/45 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      onClick={closeModal}
    >
      <div
        className="flex h-[100svh] w-full flex-col bg-white sm:h-auto sm:max-h-[88dvh] sm:max-w-lg sm:overflow-hidden sm:rounded-[34px] sm:border sm:border-white/80 sm:shadow-[0_28px_70px_rgba(30,36,81,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/98 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur sm:border-b-0 sm:px-6 sm:pb-4 sm:pt-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
              {copy.modalTitle}
            </p>
            <h2 className="mt-2 font-display text-[1.9rem] leading-tight text-ink sm:text-3xl">
              {step === "phone" ? copy.phoneStepTitle : copy.codeStepTitle}
            </h2>
          </div>
          <button
            aria-label={copy.closeLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-bubble text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isBusy}
            onClick={closeModal}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
          {step === "phone" ? (
            <>
              <p className="mt-4 text-sm leading-6 text-ink/70">{copy.phoneStepDescription}</p>

              <div className="mt-4 rounded-[24px] border border-candy/30 bg-candy/10 p-3.5 sm:mt-5 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-candy">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{copy.phoneNoticeTitle}</p>
                    <p className="mt-1 text-[13px] leading-5 text-ink/70 sm:text-sm sm:leading-6">
                      {copy.phoneNoticeBody}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.phoneNumberLabel}
                </label>
                <div className="grid gap-3 min-[420px]:grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[130px_1fr]">
                  <div className="flex h-12 items-center justify-center rounded-3xl border border-white/75 bg-bubble px-4 text-sm font-semibold text-ink">
                    KR {KR_DIALING_CODE}
                  </div>
                  <div className="flex h-12 items-center overflow-hidden rounded-3xl border border-white/75 bg-white/80 focus-within:border-sky focus-within:bg-white focus-within:ring-4 focus-within:ring-sky/20">
                    <span className="pl-4 pr-3 text-base font-semibold text-ink">0</span>
                    <span className="h-5 w-px bg-slate-200" />
                    <Input
                      autoComplete="tel-national"
                      className="rounded-none border-0 bg-transparent pl-3 pr-4 focus:border-transparent focus:bg-transparent focus:ring-0 sm:text-base"
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(event) => {
                        setErrorMessage(null);
                        setSubscriberPhoneNumber(
                          sanitizeSubscriberDigits(event.target.value)
                        );
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void sendCode();
                        }
                      }}
                      placeholder={phoneNumberPlaceholder}
                      value={subscriberPhoneNumber}
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/50">
                  {formatMessage(copy.phoneNumberHint, {
                    example: copy.phoneNumberPlaceholder
                  })}
                </p>
              </div>

              {errorMessage ? (
                <div className="mt-4 rounded-3xl border border-candy/30 bg-candy/10 px-4 py-3 text-sm text-ink">
                  {errorMessage}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <button
                className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink/65 transition hover:text-ink"
                disabled={isBusy}
                onClick={() => {
                  setErrorMessage(null);
                  setStep("phone");
                }}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                {copy.backLabel}
              </button>

              <p className="mt-4 text-sm leading-6 text-ink/70">
                {formatMessage(copy.codeStepDescription, {
                  phone: formatPhonePreview(localPhoneNumber)
                })}
              </p>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-ink/70">
                  {copy.verificationCodeLabel}
                </label>
                <Input
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => {
                    setErrorMessage(null);
                    setVerificationCode(sanitizeDigits(event.target.value).slice(0, 6));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void verifyCode();
                    }
                  }}
                  placeholder={copy.verificationCodePlaceholder}
                  value={verificationCode}
                />
              </div>

              <div className="mt-4 rounded-[24px] bg-bubble px-4 py-3 text-sm text-ink/70">
                {countdown > 0 ? (
                  <p>{formatMessage(copy.resendCountdown, { seconds: countdown })}</p>
                ) : (
                  <button
                    className="font-semibold text-ink"
                    disabled={isBusy}
                    onClick={() => void sendCode()}
                    type="button"
                  >
                    {copy.resendCodeButton}
                  </button>
                )}
              </div>

              {errorMessage ? (
                <div className="mt-4 rounded-3xl border border-candy/30 bg-candy/10 px-4 py-3 text-sm text-ink">
                  {errorMessage}
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="border-t border-slate-100 bg-white/98 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 backdrop-blur sm:border-t-white/70 sm:px-6 sm:pb-6">
          {step === "phone" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={closeModal} type="button" variant="ghost">
                {copy.cancelLabel}
              </Button>
              <Button disabled={isBusy} onClick={() => void sendCode()} type="button">
                {isSendingCode ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.sendingCodeButton}
                  </>
                ) : (
                  copy.sendCodeButton
                )}
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                disabled={isBusy}
                onClick={() => {
                  setErrorMessage(null);
                  setStep("phone");
                }}
                type="button"
                variant="ghost"
              >
                {copy.editPhoneButton}
              </Button>
              <Button disabled={isBusy} onClick={() => void verifyCode()} type="button">
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.verifyingCodeButton}
                  </>
                ) : (
                  copy.verifyCodeButton
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
