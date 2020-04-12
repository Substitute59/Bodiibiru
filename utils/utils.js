export function getFormattedPause(pause) {
  const minutes = Math.floor(pause / 60);
  const seconds = pause % 60;
  if (seconds === 0) return `${minutes}min`;
  return `${minutes}min${seconds < 10 ? '0' + seconds : seconds}`;
};