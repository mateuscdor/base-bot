module.exports = (lastDay, hours, minutes) => {
  const now = new Date(Date.now());
  hours = hours - now.getHours();
  minutes = minutes - now.getMinutes();

  const nowDay = now.getDate();

  if (lastDay == nowDay) {
    hours += 24;
  } else if (nowDay == 1) {
    lastDay = 0;
  }

  let calc = calcule(hours, minutes);

  if (calc > 0 && lastDay + 1 < nowDay) {
    calc = calc / -1;
  }

  return calc;
};

const calcule = (hours, minutes) => 3600000 * hours + 60000 * minutes;
