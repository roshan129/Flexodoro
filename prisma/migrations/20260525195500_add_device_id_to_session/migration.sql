ALTER TABLE "Session"
ADD COLUMN "deviceId" TEXT NOT NULL DEFAULT 'unknown';

CREATE INDEX "Session_deviceId_type_startedAt_idx"
ON "Session"("deviceId", "type", "startedAt");
