export function getFormattedPause(pause) {
  const minutes = Math.floor(pause / 60);
  const seconds = pause % 60;
  if (seconds === 0) return `${minutes}min`;
  return `${minutes}min${seconds < 10 ? '0' + seconds : seconds}`;
};

export function getFormattedDate(timestamp) {
  var date = new Date(timestamp);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();

  var formattedTime = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  return formattedTime;
}
