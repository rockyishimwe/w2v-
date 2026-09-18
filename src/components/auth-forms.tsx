"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
  LeafMark,
  LockIcon,
  MailIcon,
  UserIcon,
} from "./icons";

type AuthMode = "login" | "signup" | "forgot";
type ViewState = "active" | "leaving" | "hidden";

const VIEW_FADE_OUT_MS = 220;
const VIEWS: AuthMode[] = ["login", "signup", "forgot"];

/**
 * Root wrapper for each auth view. All views share the same grid cell
 * ([grid-area:1/1]) inside AuthForms so the outgoing and incoming views
 * overlap in place while cross-fading. Inactive views stay mounted with
 * `hidden` so their state (typed email, sent confirmation) survives
 * navigating away and back; their fade-in animation replays when reshown.
 */
const viewClassName = (state: ViewState) =>
  `my-auto flex w-full max-w-[560px] flex-col items-center py-2 [grid-area:1/1] ${
    state === "leaving"
      ? "pointer-events-none [animation:fade-out_220ms_ease-in_both]"
      : state === "active"
        ? "[animation:fade-in_450ms_ease-out_both]"
        : "hidden"
  }`;

function inputBase(className: string) {
  return `h-[clamp(2.75rem,6.2vh,3.5rem)] w-full rounded-2xl border border-gray-200 bg-white/60 pl-12 pr-4 text-[clamp(0.85rem,1.9vh,0.95rem)] text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${className}`;
}

function Field({
  label,
  type,
  placeholder,
  icon,
  trailing,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
          {icon}
        </span>
        <input
          name={label}
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={
            onChange ? (event) => onChange(event.target.value) : undefined
          }
          className={inputBase(trailing ? "pr-12" : "")}
        />
        {trailing ? (
          <span className="absolute inset-y-0 right-4 flex items-center">
            {trailing}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function PasswordField({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      label={label}
      type={visible ? "text" : "password"}
      placeholder={label}
      icon={<LockIcon className="h-5 w-5" />}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-gray-400 transition-colors hover:text-gray-900"
        >
          {visible ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      }
    />
  );
}

function SocialButtons({ dividerText }: { dividerText: string }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[clamp(0.75rem,1.7vh,0.875rem)] text-gray-500">
          {dividerText}
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="mx-auto grid w-[min(420px,100%)] grid-cols-2 gap-5">
        <button
          type="button"
          className="flex h-[clamp(2.1rem,4.4vh,2.5rem)] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-[clamp(0.78rem,1.7vh,0.85rem)] font-medium text-gray-900 transition-colors hover:border-brand-400"
        >
          <GoogleIcon className="h-4 w-4" />
          Google
        </button>
        <button
          type="button"
          className="flex h-[clamp(2.1rem,4.4vh,2.5rem)] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-[clamp(0.78rem,1.7vh,0.85rem)] font-medium text-gray-900 transition-colors hover:border-brand-400"
        >
          <FacebookIcon className="h-4 w-4" />
          Facebook
        </button>
      </div>
    </>
  );
}

function AuthButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="mx-auto flex h-[clamp(2.75rem,6.2vh,3.5rem)] w-[min(420px,100%)] items-center justify-center gap-2 rounded-full bg-brand-700 text-[clamp(0.85rem,1.9vh,0.95rem)] font-medium text-white shadow-[0_14px_28px_rgba(20,92,54,0.35)] transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
    >
      {children}
    </button>
  );
}

function LoginView({
  onSwitch,
  onForgot,
  state,
}: {
  onSwitch: () => void;
  onForgot: () => void;
  state: ViewState;
}) {
  return (
    <div className={viewClassName(state)} aria-hidden={state !== "active"}>
      <div className="flex items-center justify-center gap-3">
        <LeafMark className="h-[clamp(2rem,4.5vh,3rem)] w-[clamp(2rem,4.5vh,3rem)]" />
        <h1 className="text-[clamp(1.6rem,4.6vh,2.75rem)] font-semibold leading-tight text-brand-700">
          Welcome back
        </h1>
      </div>
      <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-gray-500">
        Log in to your Waste2Value account and continue making an impact.
      </p>

      <form
        className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.7rem,1.9vh,1.25rem)]"
        action="#"
        method="post"
      >
        <Field
          label="Email address"
          type="email"
          placeholder="Email address"
          icon={<MailIcon className="h-5 w-5" />}
        />
        <PasswordField label="Password" />

        <div className="mt-[clamp(0.1rem,0.6vh,0.4rem)] flex w-full items-center justify-between px-1">
          <label className="flex cursor-pointer items-center gap-2 text-[clamp(0.8rem,1.8vh,0.9375rem)] text-gray-500">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 cursor-pointer appearance-none rounded-[5px] border border-gray-200 bg-white checked:border-brand-700 checked:bg-brand-700 checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22><path d=%22M3.5 8.5 6.5 11.5 12.5 4.5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="font-semibold text-brand-700 hover:text-brand-500"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-[clamp(0.4rem,1.4vh,1rem)] flex w-full flex-col gap-[clamp(0.8rem,2.4vh,2rem)]">
          <AuthButton>
            Log in
            <ArrowRightIcon className="h-4 w-4" />
          </AuthButton>

          <SocialButtons dividerText="Or continue with" />
        </div>
      </form>

      <p className="mt-[clamp(0.8rem,2.4vh,2rem)] text-center text-[clamp(0.8rem,1.8vh,0.9375rem)] text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-brand-700 hover:text-brand-500"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

function SignUpView({
  onSwitch,
  state,
}: {
  onSwitch: () => void;
  state: ViewState;
}) {
  return (
    <div className={viewClassName(state)} aria-hidden={state !== "active"}>
      <div className="flex items-center justify-center gap-3">
        <LeafMark className="h-[clamp(2rem,4.5vh,3rem)] w-[clamp(2rem,4.5vh,3rem)]" />
        <h1 className="text-[clamp(1.6rem,4.6vh,2.75rem)] font-semibold leading-tight text-brand-700">
          Create your account
        </h1>
      </div>
      <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-gray-500">
        Join Waste2Value and be part of a community that turns waste into
        opportunity
      </p>

      <form
        className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.7rem,1.9vh,1.25rem)]"
        action="#"
        method="post"
      >
        <Field
          label="First name"
          type="text"
          placeholder="First name"
          icon={<UserIcon className="h-5 w-5" />}
        />
        <Field
          label="Last name"
          type="text"
          placeholder="Last name"
          icon={<UserIcon className="h-5 w-5" />}
        />
        <Field
          label="Email address"
          type="email"
          placeholder="Email address"
          icon={<MailIcon className="h-5 w-5" />}
        />
        <PasswordField label="Password" />
        <PasswordField label="Confirm Password" />

        <div className="mt-[clamp(0.4rem,1.4vh,1rem)] flex w-full flex-col gap-[clamp(0.8rem,2.4vh,2rem)]">
          <AuthButton>
            Sign up
            <ArrowRightIcon className="h-4 w-4" />
          </AuthButton>

          <SocialButtons dividerText="Or sign up with" />
        </div>
      </form>

      <p className="mt-[clamp(0.8rem,2.4vh,2rem)] text-center text-[clamp(0.8rem,1.8vh,0.9375rem)] text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-brand-700 hover:text-brand-500"
        >
          Login
        </button>
      </p>
    </div>
  );
}

function ForgotPasswordView({
  onSwitch,
  state,
}: {
  onSwitch: () => void;
  state: ViewState;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className={viewClassName(state)} aria-hidden={state !== "active"}>
      <div className="flex items-center justify-center gap-3">
        <LeafMark className="h-[clamp(2rem,4.5vh,3rem)] w-[clamp(2rem,4.5vh,3rem)]" />
        <h1 className="text-[clamp(1.6rem,4.6vh,2.75rem)] font-semibold leading-tight text-brand-700">
          Reset your password
        </h1>
      </div>

      {sent ? (
        <>
          <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-gray-500">
            If an account exists for{" "}
            <span className="font-semibold text-gray-900">{email}</span>,
            we&apos;ve sent you a link to reset your password.
          </p>
          <p className="mt-[clamp(0.3rem,1vh,0.6rem)] text-center text-[clamp(0.75rem,1.6vh,0.85rem)] text-gray-400">
            Didn&apos;t get it? Check your spam folder.
          </p>

          <div className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.8rem,2.4vh,2rem)]">
            <AuthButton onClick={onSwitch}>Back to log in</AuthButton>
          </div>
        </>
      ) : (
        <>
          <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-gray-500">
            Enter the email address linked to your account and we&apos;ll send
            you a link to reset your password.
          </p>

          <form
            className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.7rem,1.9vh,1.25rem)]"
            action="#"
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <Field
              label="Email address"
              type="email"
              placeholder="Email address"
              icon={<MailIcon className="h-5 w-5" />}
              value={email}
              onChange={setEmail}
            />

            <div className="mt-[clamp(0.4rem,1.4vh,1rem)] flex w-full flex-col gap-[clamp(0.8rem,2.4vh,2rem)]">
              <AuthButton>
                Send reset link
                <ArrowRightIcon className="h-4 w-4" />
              </AuthButton>
            </div>
          </form>

          <p className="mt-[clamp(0.8rem,2.4vh,2rem)] text-center text-[clamp(0.8rem,1.8vh,0.9375rem)] text-gray-500">
            Remember your password?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-brand-700 hover:text-brand-500"
            >
              Log in
            </button>
          </p>
        </>
      )}
    </div>
  );
}

function AuthView({
  mode,
  state,
  onSwitch,
}: {
  mode: AuthMode;
  state: ViewState;
  onSwitch: (mode: AuthMode) => void;
}) {
  if (mode === "signup") {
    return <SignUpView state={state} onSwitch={() => onSwitch("login")} />;
  }
  if (mode === "forgot") {
    return (
      <ForgotPasswordView state={state} onSwitch={() => onSwitch("login")} />
    );
  }
  return (
    <LoginView
      state={state}
      onSwitch={() => onSwitch("signup")}
      onForgot={() => onSwitch("forgot")}
    />
  );
}

export function AuthForms({
  initialMode = "login",
}: {
  initialMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [leavingMode, setLeavingMode] = useState<AuthMode | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const switchTo = (next: AuthMode) => {
    if (next === mode) return;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setLeavingMode(mode);
    setMode(next);
    fadeTimer.current = setTimeout(
      () => setLeavingMode(null),
      VIEW_FADE_OUT_MS,
    );
  };

  return (
    <div className="grid w-full max-w-[560px] place-items-center">
      {VIEWS.map((view) => (
        <AuthView
          key={view}
          mode={view}
          state={
            view === mode
              ? "active"
              : view === leavingMode
                ? "leaving"
                : "hidden"
          }
          onSwitch={switchTo}
        />
      ))}
    </div>
  );
}
