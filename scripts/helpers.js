function getSecondsFromDuration(d) {
  let result = 0;
  let arr = d.split(":").reverse();

  for (let i = 0; i < arr.length; i++) {
    result += (+arr[i]) * (60 ** (i));
  }
  return result;
}

function getActualUploadYear(howLongAgo) {
  let arr = howLongAgo.split(" ");

  if (arr[0] === "Streamed") {
    arr = [arr[1], arr[2]];
  }

  const unit = arr[1];
  const amount = arr[0];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = +(new Date().toString().split(" ")[2]);

  let actualYearUploaded;

  if (unit === "years" || unit === "year") {
    actualYearUploaded = currentYear - amount;
  } else if ((unit === "months" || unit === "month") && currentMonth - amount < 0) {
    actualYearUploaded = currentYear - 1;
  } else if ((unit === "days" || unit === "day") && (currentDay - amount < 0 && currentMonth - 1 < 0)) {
    actualYearUploaded = currentYear - 1;
  } else {
    actualYearUploaded = currentYear;
  }

  return actualYearUploaded;
}
