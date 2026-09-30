/**
 * Structured JSON logger that never leaks PII or secrets.
 *
 * Every line is single-line JSON (gzip-friendly, parseable by log drains).
 * Callers pass allow-listed fields only; anything named like a secret or a
 * credential is redacted defensively.
 */

type Level = "debug" | "info" | "warn" | "error";

const REDACT_KEYS = /pass|token|secret|api[-_]?key|authorization|cookie/i;
const MAX_FIELD_LENGTH = 500;

function redact(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (REDACT_KEYS.test(key)) {
      out[key] = "[redacted]";
    } else if (typeof value === "string" && value.length > MAX_FIELD_LENGTH) {
      out[key] = `${value.slice(0, MAX_FIELD_LENGTH)}…[truncated]`;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = redact(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function write(
  level: Level,
  message: string,
  fields?: Record<string, unknown>,
) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...(fields ? redact(fields) : {}),
  });
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, fields?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== "production") {
      write("debug", message, fields);
    }
  },
  info: (message: string, fields?: Record<string, unknown>) =>
    write("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) =>
    write("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) =>
    write("error", message, fields),
};
