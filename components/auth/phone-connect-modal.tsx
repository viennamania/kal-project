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
  return value.replace(/\D/g, "").slice(0, 11);
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
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [step, setStep] = useState<ConnectStep>("phone");
  const [verificationCode, setVerificationCode] = useState("");

  const isBusy = isConnecting || isSendingCode;

  function resetState() {
    setCountdown(0);
    setErrorMessage(null);
    setIsSendingCode(false);
    setLocalPhoneNumber("");
    setStep("phone");
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
      className="fixed inset-0 z-[95] flex items-end justify-center bg-[#1E2451]/35 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-lg rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_28px_70px_rgba(30,36,81,0.22)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
              {copy.modalTitle}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-ink">
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

        {step === "phone" ? (
          <>
            <p className="mt-4 text-sm leading-6 text-ink/70">{copy.phoneStepDescription}</p>

            <div className="mt-5 rounded-[28px] border border-candy/30 bg-candy/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-candy">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{copy.phoneNoticeTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/70">{copy.phoneNoticeBody}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-ink/70">
                {copy.phoneNumberLabel}
              </label>
              <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                <div className="flex h-12 items-center justify-center rounded-3xl border border-white/75 bg-bubble px-4 text-sm font-semibold text-ink">
                  KR {KR_DIALING_CODE}
                </div>
                <Input
                  autoComplete="tel-national"
                  inputMode="numeric"
                  maxLength={11}
                  onChange={(event) => {
                    setErrorMessage(null);
                    setLocalPhoneNumber(sanitizeDigits(event.target.value));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void sendCode();
                    }
                  }}
                  placeholder={copy.phoneNumberPlaceholder}
                  value={localPhoneNumber}
                />
              </div>
              <p className="mt-2 text-xs text-ink/50">
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
          </>
        ) : (
          <>
            <button
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink/65 transition hover:text-ink"
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
          </>
        )}
      </div>
    </div>
  );
}
