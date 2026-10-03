-- Existing accounts that previously selected Kinyarwanda fall back to English.
UPDATE "User" SET "locale" = 'en' WHERE "locale" = 'rw';
UPDATE "AssistantMessage" SET "locale" = 'en' WHERE "locale" = 'rw';
