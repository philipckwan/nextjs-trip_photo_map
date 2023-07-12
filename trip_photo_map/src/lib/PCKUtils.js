export function timeLog(msg) {
  let current = new Date();
  let currentTime  = current.toLocaleTimeString();
  console.log(`[${currentTime}]${msg}`);
};

export function timestampToDateTime(timestamp) {
  let d = new Date(timestamp);
  let year = d.getFullYear();
  let month = d.getMonth()+1;
  let date = d.getDate();

  let hour = d.getHours();
  let minute = d.getMinutes();

  return `${year}-${month.toString().padStart(2,"0")}-${date.toString().padStart(2,"0")}@${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}`;
}

export function timestampToDate(timestamp) {
  let d = new Date(timestamp);
  let year = d.getFullYear();
  let month = d.getMonth()+1;
  let date = d.getDate();
  return `${year}-${month.toString().padStart(2,"0")}-${date.toString().padStart(2,"0")}`;
}

export function dateTimeToTimestamp(dateTime) {
  let date = new Date(dateTime)
  return date.getTime()
}