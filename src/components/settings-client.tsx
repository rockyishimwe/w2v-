"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  CheckIcon,
  GearIcon,
  CompassIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import {
  ApiClientError,
  changePassword,
  logout,
  logoutEverywhere,
  updateProfile,
} from "@/services/auth-service";
import {
  clearCurrentUser,
  setCurrentUser,
  useCurrentUser,
} from "@/hooks/use-current-user";

/** Languages the backend accepts (SRS: Kinyarwanda, English, French). */
const LOCALES: { value: string; label: string; hint: string }[] = [
  { value: "rw", label: "Kinyarwanda", hint: "Ikinyarwanda" },
  { value: "en", label: "English", hint: "English" },
  { value: "fr", label: "French", hint: "Français" },
];

/** Shared card shell — same rounding/shadow as the other pages' cards. */
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-6">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[17px] font-semibold text-gray-900">
            {title}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium text-gray-700">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const INPUT_CLASS =
  "h-[48px] w-full rounded-2xl border border-gray-200 bg-white px-4 text-[14.5px] text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:bg-gray-50 disabled:text-gray-500";

const PRIMARY_BUTTON_CLASS =
  "flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#237f22] px-6 text-[14px] font-semibold text-white shadow-[0_10px_18px_rgba(20,92,54,0.28)] transition-opacity hover:opacity-95 disabled:opacity-60";

/** Turns any thrown error into a message safe to show the user. */
function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiClientError ? error.message : fallback;
}

export function SettingsClient() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  /* ── Profile form ──────────────────────────────────────────── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [locale, setLocale] = useState("en");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Seed the form from the profile as soon as it arrives, adjusting state
  // during render (React's pattern for deriving state from changing props)
  // so the inputs never paint a frame of empty values.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (user && seededFor !== user.id) {
    setSeededFor(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setLocale(user.locale || "en");
  }

  async function handleProfileSave(event: React.FormEvent) {
    event.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        locale,
      });
      setCurrentUser(updated);
      setProfileMessage("Your profile has been updated.");
    } catch (error) {
      setProfileError(messageOf(error, "Couldn't save your profile."));
    } finally {
      setSavingProfile(false);
    }
  }

  /* ── Password form ─────────────────────────────────────────── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handlePasswordSave(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("The two new passwords don't match.");
      return;
    }

    setSavingPassword(true);
    try {
      // The server revokes every session, so we land back on the login page.
      await changePassword({ currentPassword, newPassword });
      clearCurrentUser();
      router.replace("/?password=changed");
    } catch (error) {
      setPasswordError(
        messageOf(error, "Couldn't change your password. Please try again."),
      );
      setSavingPassword(false);
    }
  }

  /* ── Sign out ──────────────────────────────────────────────── */
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut(everywhere: boolean) {
    setSigningOut(true);
    await (everywhere ? logoutEverywhere() : logout());
    clearCurrentUser();
    router.replace("/");
  }

  // Google/Facebook accounts have no password to change.
  const isOAuthAccount = user !== null && !user.hasPassword;

  return (
    <>
      {/* ── Top bar — mirrors the other pages' header ──────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <GearIcon className="mt-1.5 h-7 w-7 text-gray-900" />
          <div>
            <h1 className="font-display text-[30px] font-bold leading-none text-black">
              Settings
            </h1>
            <p className="mt-2.5 text-[14px] text-[#607493]">
              Manage your account, language and security
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
          </button>
          <AvatarArt className="h-11 w-11 shrink-0 rounded-full object-cover" />
        </div>
      </header>

      {/* ── Account summary ────────────────────────────────────── */}
      <section className="mt-6 flex flex-wrap items-center gap-4 rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:gap-6 sm:p-6">
        <span className="relative shrink-0">
          <AvatarArt className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-500 ring-offset-2 ring-offset-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-brand-500" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[19px] font-bold text-gray-900">
            {user
              ? `${user.firstName} ${user.lastName}`
              : loading
                ? "Loading…"
                : "Your account"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-gray-600">
            <MailIcon className="h-4 w-4 text-gray-500" />
            <span className="truncate">{user?.email ?? "—"}</span>
          </p>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)]">
        {/* ── Left column: profile + password ──────────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          <SettingsCard
            title="Profile"
            description="Your name is used to greet you and on your exchange listings."
            icon={UserIcon}
          >
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    maxLength={60}
                    required
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Last name">
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    maxLength={60}
                    required
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={user?.email ?? ""}
                  disabled
                  readOnly
                  className={INPUT_CLASS}
                />
              </Field>
              <p className="-mt-2 text-[12px] text-gray-500">
                Your email identifies your account and can&apos;t be changed
                here.
              </p>

              {profileError ? (
                <p
                  role="alert"
                  className="text-[13px] font-medium text-red-600"
                >
                  {profileError}
                </p>
              ) : null}
              {profileMessage ? (
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-brand-700">
                  <CheckIcon className="h-4 w-4" />
                  {profileMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={savingProfile || !user}
                className={PRIMARY_BUTTON_CLASS}
              >
                {savingProfile ? "Saving…" : "Save changes"}
              </button>
            </form>
          </SettingsCard>

          {isOAuthAccount ? (
            <SettingsCard
              title="Password"
              description="This account signs in with Google or Facebook."
              icon={LockIcon}
            >
              <p className="text-[13.5px] leading-relaxed text-gray-600">
                You signed up with a social account, so there is no password to
                change here. Manage it with your provider instead.
              </p>
            </SettingsCard>
          ) : (
            <SettingsCard
              title="Password"
              description="Changing your password signs you out of every device."
              icon={LockIcon}
            >
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <Field label="Current password">
                  <input
                    type="password"
                    name="currentPassword"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                    className={INPUT_CLASS}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="New password">
                    <input
                      type="password"
                      name="newPassword"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={8}
                      required
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Confirm new password">
                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      minLength={8}
                      required
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
                <p className="text-[12px] text-gray-500">
                  At least 8 characters, with a letter and a number.
                </p>

                {passwordError ? (
                  <p
                    role="alert"
                    className="text-[13px] font-medium text-red-600"
                  >
                    {passwordError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className={PRIMARY_BUTTON_CLASS}
                >
                  {savingPassword ? "Updating…" : "Change password"}
                </button>
              </form>
            </SettingsCard>
          )}
        </div>

        {/* ── Right rail: language + sessions ──────────────────── */}
        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-9 xl:self-start">
          <SettingsCard
            title="Language"
            description="AI answers, tips and guides come back in this language."
            icon={CompassIcon}
          >
            <div className="space-y-2.5">
              {LOCALES.map((option) => {
                const active = locale === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLocale(option.value)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-brand-500 bg-pale-green"
                        : "border-gray-200 bg-white hover:bg-brand-50"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-gray-900">
                        {option.label}
                      </span>
                      <span className="block text-[12px] text-gray-500">
                        {option.hint}
                      </span>
                    </span>
                    {active ? (
                      <CheckIcon className="h-5 w-5 shrink-0 text-brand-700" />
                    ) : null}
                  </button>
                );
              })}
              <p className="text-[12px] text-gray-500">
                Pick a language, then press “Save changes” in Profile.
              </p>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Sessions"
            description="Sign out here, or end every session if you used a shared device."
            icon={ShieldIcon}
          >
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSignOut(false)}
                disabled={signingOut}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-[14px] font-semibold text-gray-900 transition-colors hover:bg-brand-50 disabled:opacity-60"
              >
                <LogoutIcon className="h-[18px] w-[18px]" />
                {signingOut ? "Signing out…" : "Log out"}
              </button>
              <button
                type="button"
                onClick={() => handleSignOut(true)}
                disabled={signingOut}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                <ShieldIcon className="h-[18px] w-[18px]" />
                Log out on all devices
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </>
  );
}
