const MIN_BREAK_SECONDS = 60;
const MAX_BREAK_SECONDS = 20 * 60;

export function calculateDynamicBreakSeconds(
  workDurationSeconds: number,
  ratio = 0.2,
): number {
  const safeWorkDuration = Math.max(0, Math.round(workDurationSeconds));
  const safeRatio = Math.min(0.5, Math.max(0.1, ratio));

  if (safeWorkDuration === 0) {
    return MIN_BREAK_SECONDS;
  }

  const rawBreak = safeWorkDuration * safeRatio;
  const roundedBreak = Math.round(rawBreak / 30) * 30;

  return Math.min(MAX_BREAK_SECONDS, Math.max(MIN_BREAK_SECONDS, roundedBreak));
}
