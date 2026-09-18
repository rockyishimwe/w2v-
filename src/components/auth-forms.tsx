"use client";

import { useState } from "react";
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

function inputBase(className: string) {
  return `h-[clamp(2.75rem,6.2vh,3.5rem)] w-full rounded-2xl border border-mist-300 bg-white/60 pl-12 pr-4 text-[clamp(0.85rem,1.9vh,0.95rem)] text-ink-700 placeholder:text-ink-400 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/30 ${className}`;
}

function Field({
  label,
  type,
  placeholder,
  icon,
  trailing,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-400">
          {icon}
        </span>
        <input
          name={label}
          type={type}
          required
          placeholder={placeholder}
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
          className="text-ink-400 transition-colors hover:text-ink-700"
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
        <span className="h-px flex-1 bg-mist-300" />
        <span className="text-[clamp(0.75rem,1.7vh,0.875rem)] text-ink-500">
          {dividerText}
        </span>
        <span className="h-px flex-1 bg-mist-300" />
      </div>

      <div className="mx-auto grid w-[min(420px,100%)] grid-cols-2 gap-5">
        <button
          type="button"
          className="flex h-[clamp(2.1rem,4.4vh,2.5rem)] items-center justify-center gap-2 rounded-xl border border-mist-300 bg-white text-[clamp(0.78rem,1.7vh,0.85rem)] font-medium text-ink-700 transition-colors hover:border-leaf-400"
        >
          <GoogleIcon className="h-4 w-4" />
          Google
        </button>
        <button
          type="button"
          className="flex h-[clamp(2.1rem,4.4vh,2.5rem)] items-center justify-center gap-2 rounded-xl border border-mist-300 bg-white text-[clamp(0.78rem,1.7vh,0.85rem)] font-medium text-ink-700 transition-colors hover:border-leaf-400"
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
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className="mx-auto flex h-[clamp(2.75rem,6.2vh,3.5rem)] w-[min(420px,100%)] items-center justify-center gap-2 rounded-full bg-forest-900 text-[clamp(0.85rem,1.9vh,0.95rem)] font-medium text-white shadow-[0_14px_28px_rgba(8,32,19,0.35)] transition-colors hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-leaf-500/40"
    >
      {children}
    </button>
  );
}

function LoginView({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="my-auto flex w-full max-w-[560px] flex-col items-center py-2 [animation:fade-in_450ms_ease-out_both]">
      <div className="flex items-center justify-center gap-3">
        <LeafMark className="h-[clamp(2rem,4.5vh,3rem)] w-[clamp(2rem,4.5vh,3rem)]" />
        <h1 className="text-[clamp(1.6rem,4.6vh,2.75rem)] font-semibold leading-tight text-forest-900">
          Welcome back
        </h1>
      </div>
      <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-ink-500">
        Log in to your Waste2Value account and continue making an impact.
      </p>

      <form className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.7rem,1.9vh,1.25rem)]" action="#" method="post">
        <Field
          label="Email address"
          type="email"
          placeholder="Email address"
          icon={<MailIcon className="h-5 w-5" />}
        />
        <PasswordField label="Password" />

        <div className="mt-[clamp(0.1rem,0.6vh,0.4rem)] flex w-full items-center justify-between px-1">
          <label className="flex cursor-pointer items-center gap-2 text-[clamp(0.8rem,1.8vh,0.9375rem)] text-ink-500">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 cursor-pointer appearance-none rounded-[5px] border border-mist-300 bg-white checked:border-forest-900 checked:bg-forest-900 checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22><path d=%22M3.5 8.5 6.5 11.5 12.5 4.5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-leaf-500/40"
            />
            Remember me
          </label>
          <a
            href="#"
            className="font-semibold text-forest-900 hover:text-leaf-600"
          >
            Forgot password?
          </a>
        </div>

        <div className="mt-[clamp(0.4rem,1.4vh,1rem)] flex w-full flex-col gap-[clamp(0.8rem,2.4vh,2rem)]">
          <AuthButton>
            Log in
            <ArrowRightIcon className="h-4 w-4" />
          </AuthButton>

          <SocialButtons dividerText="Or continue with" />
        </div>
      </form>

      <p className="mt-[clamp(0.8rem,2.4vh,2rem)] text-center text-[clamp(0.8rem,1.8vh,0.9375rem)] text-ink-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-forest-900 hover:text-leaf-600"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

function SignUpView({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="my-auto flex w-full max-w-[560px] flex-col items-center py-2 [animation:fade-in_450ms_ease-out_both]">
      <div className="flex items-center justify-center gap-3">
        <LeafMark className="h-[clamp(2rem,4.5vh,3rem)] w-[clamp(2rem,4.5vh,3rem)]" />
        <h1 className="text-[clamp(1.6rem,4.6vh,2.75rem)] font-semibold leading-tight text-forest-900">
          Create your account
        </h1>
      </div>
      <p className="mt-[clamp(0.4rem,1.4vh,0.75rem)] max-w-[520px] text-center text-[clamp(0.85rem,2vh,1.0625rem)] leading-relaxed text-ink-500">
        Join Waste2Value and be part of a community that turns waste into
        opportunity
      </p>

      <form className="mt-[clamp(0.9rem,2.8vh,2.25rem)] flex w-full flex-col gap-[clamp(0.7rem,1.9vh,1.25rem)]" action="#" method="post">
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

      <p className="mt-[clamp(0.8rem,2.4vh,2rem)] text-center text-[clamp(0.8rem,1.8vh,0.9375rem)] text-ink-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-forest-900 hover:text-leaf-600"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export function AuthForms({
  initialMode = "login",
}: {
  initialMode?: "login" | "signup";
}) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  return mode === "login" ? (
    <LoginView onSwitch={() => setMode("signup")} />
  ) : (
    <SignUpView onSwitch={() => setMode("login")} />
  );
}
