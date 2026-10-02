"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./notification-bell";
import {
  CheckIcon,
  GearIcon,
  CompassIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  ShieldIcon,
  UploadIcon,
  UserIcon,
} from "./icons";
import { Avatar } from "./avatar";
import {
  ApiClientError,
  AVATAR_ACCEPT,
  changePassword,
  logout,
  logoutEverywhere,
  removeAvatar,
  updateProfile,
  uploadAvatar,
} from "@/services/auth-service";
import {
  clearCurrentUser,
  setCurrentUser,
  useCurrentUser,
} from "@/hooks/use-current-user";
import { LOCALE_LABELS, isLocale, type Locale } from "@/i18n/locales";
import { rememberLocale, useT } from "@/i18n/use-translation";

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

/**
 * The photo helpers throw plain Errors carrying either our own local
 * validation text or the message from our API, so both are worth showing.
 */
function photoMessageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function SettingsClient() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const t = useT();

  /* ── Profile form ──────────────────────────────────────────── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
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
    setLocale(isLocale(user.locale) ? user.locale : "en");
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
      setProfileMessage(t("Your profile has been updated."));
    } catch (error) {
      setProfileError(messageOf(error, t("Couldn't save your profile.")));
    } finally {
      setSavingProfile(false);
    }
  }

  /**
   * Switching language takes effect immediately: the choice is saved and
   * the whole UI re-renders in it, rather than waiting for a separate
   * "Save changes" in the Profile card.
   */
  const [switchingLocale, setSwitchingLocale] = useState(false);

  async function handleLocalePick(next: Locale) {
    if (next === locale) return;
    const previous = locale;
    // Paint in the new language first, then persist it.
    setLocale(next);
    rememberLocale(next);
    // `useLocale` correctly treats the profile as authoritative. Update that
    // shared profile optimistically too, otherwise its old locale would win
    // until the network request below completes.
    if (user) setCurrentUser({ ...user, locale: next });
    setSwitchingLocale(true);
    setProfileError(null);
    try {
      setCurrentUser(await updateProfile({ locale: next }));
    } catch (error) {
      setLocale(previous);
      rememberLocale(previous);
      if (user) setCurrentUser({ ...user, locale: previous });
      setProfileError(messageOf(error, t("Couldn't change the language.")));
    } finally {
      setSwitchingLocale(false);
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
      setPasswordError(t("The two new passwords don't match."));
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
        messageOf(error, t("Couldn't change your password. Please try again.")),
      );
      setSavingPassword(false);
    }
  }

  /* ── Profile photo ─────────────────────────────────────────── */
  const fileInput = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  // Local object URL shown while the upload is in flight, so the new
  // photo appears immediately instead of after the round trip.
  const [preview, setPreview] = useState<string | null>(null);

  async function handlePhotoPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Let the same file be picked again after an error.
    event.target.value = "";
    if (!file) return;

    setPhotoError(null);
    setPhotoSaved(false);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setPhotoBusy(true);
    try {
      setCurrentUser(await uploadAvatar(file));
      setPhotoSaved(true);
    } catch (error) {
      setPhotoError(photoMessageOf(error, t("Couldn't upload that photo.")));
    } finally {
      setPhotoBusy(false);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  }

  async function handlePhotoRemove() {
    setPhotoError(null);
    setPhotoSaved(false);
    setPhotoBusy(true);
    try {
      setCurrentUser(await removeAvatar());
    } catch (error) {
      setPhotoError(photoMessageOf(error, t("Couldn't remove that photo.")));
    } finally {
      setPhotoBusy(false);
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

  // Google accounts have no password to change.
  const isOAuthAccount = user !== null && !user.hasPassword;

  return (
    <>
      {/* ── Top bar — mirrors the other pages' header ──────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <GearIcon className="mt-1.5 h-7 w-7 text-gray-900" />
          <div>
            <h1 className="font-display text-[30px] font-bold leading-none text-black">
              {t("Settings")}
            </h1>
            <p className="mt-2.5 text-[14px] text-[#607493]">
              {t("Manage your account, language and security")}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <NotificationBell ariaLabel={t("Notifications")} />
          <Avatar className="h-11 w-11 shrink-0 rounded-full object-cover" />
        </div>
      </header>

      {/* ── Account summary ────────────────────────────────────── */}
      <section className="mt-6 flex flex-wrap items-center gap-4 rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:gap-6 sm:p-6">
        <span className="relative shrink-0">
          <Avatar
            src={preview ?? undefined}
            alt={user ? `${user.firstName} ${user.lastName}` : t("Your photo")}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-500 ring-offset-2 ring-offset-white"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-brand-500" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[19px] font-bold text-gray-900">
            {user
              ? `${user.firstName} ${user.lastName}`
              : loading
                ? t("Loading…")
                : t("Your account")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-gray-600">
            <MailIcon className="h-4 w-4 text-gray-500" />
            <span className="truncate">{user?.email ?? "—"}</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <input
              ref={fileInput}
              type="file"
              accept={AVATAR_ACCEPT}
              className="sr-only"
              onChange={handlePhotoPicked}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={photoBusy}
              className="flex h-9 items-center gap-2 rounded-full bg-brand-700 px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
            >
              <UploadIcon className="h-4 w-4" />
              {photoBusy
                ? t("Uploading…")
                : user?.avatarPath
                  ? t("Change photo")
                  : t("Upload photo")}
            </button>
            {user?.avatarPath && (
              <button
                type="button"
                onClick={handlePhotoRemove}
                disabled={photoBusy}
                className="flex h-9 items-center rounded-full border border-gray-200 px-3.5 text-[12.5px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                Remove
              </button>
            )}
            <p className="text-[11.5px] text-gray-500">
              JPG, PNG or GIF · 1 MB
            </p>
          </div>

          {photoError && (
            <p role="alert" className="mt-2 text-[12px] text-red-600">
              {photoError}
            </p>
          )}
          {photoSaved && !photoError && (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-brand-700">
              <CheckIcon className="h-3.5 w-3.5" />
              Photo updated.
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)]">
        {/* ── Left column: profile + password ──────────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          <SettingsCard
            title={t("Profile")}
            description={t(
              "Your name is used to greet you and on your exchange listings.",
            )}
            icon={UserIcon}
          >
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("First name")}>
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
                <Field label={t("Last name")}>
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

              <Field label={t("Email")}>
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
                {savingProfile ? `${t("Save")}…` : t("Save changes")}
              </button>
            </form>
          </SettingsCard>

          {isOAuthAccount ? (
            <SettingsCard
              title={t("Password")}
              description={t("This account signs in with Google.")}
              icon={LockIcon}
            >
              <p className="text-[13.5px] leading-relaxed text-gray-600">
                You signed up with a social account, so there is no password to
                change here. Manage it with your provider instead.
              </p>
            </SettingsCard>
          ) : (
            <SettingsCard
              title={t("Password")}
              description={t(
                "Changing your password signs you out of every device.",
              )}
              icon={LockIcon}
            >
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <Field label={t("Current password")}>
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
                  <Field label={t("New password")}>
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
                  <Field label={t("Confirm new password")}>
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
                  {savingPassword
                    ? `${t("Update password")}…`
                    : t("Update password")}
                </button>
              </form>
            </SettingsCard>
          )}
        </div>

        {/* ── Right rail: language + sessions ──────────────────── */}
        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-9 xl:self-start">
          <SettingsCard
            title={t("Language")}
            description={t(
              "AI answers, tips and guides come back in this language.",
            )}
            icon={CompassIcon}
          >
            <div className="space-y-2.5">
              {LOCALE_LABELS.map((option) => {
                const active = locale === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => void handleLocalePick(option.value)}
                    aria-pressed={active}
                    disabled={switchingLocale}
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
                {t("The app switches language as soon as you pick one.")}
              </p>
            </div>
          </SettingsCard>

          <SettingsCard
            title={t("Sessions")}
            description={t(
              "Sign out here, or end every session if you used a shared device.",
            )}
            icon={ShieldIcon}
          >
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSignOut(false)}
                disabled={signingOut}
                className="flex h-[48px] mx-auto w-[min(240px,100%)] items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-[14px] font-semibold text-gray-900 transition-colors hover:bg-brand-50 disabled:opacity-60"
              >
                <LogoutIcon className="h-[18px] w-[18px]" />
                {signingOut ? `${t("Sign out")}…` : t("Sign out")}
              </button>
              <button
                type="button"
                onClick={() => handleSignOut(true)}
                disabled={signingOut}
                className="flex h-[48px] mx-auto w-[min(240px,100%)] items-center justify-center gap-2 rounded-full border border-red-200 bg-white text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                <ShieldIcon className="h-[18px] w-[18px]" />
                {t("Sign out everywhere")}
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </>
  );
}
