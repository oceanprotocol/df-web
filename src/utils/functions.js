export const getThursdayDate = (date) => {
  var curr = date || new Date();
  if (curr.getUTCDay() >= 4) curr.setDate(curr.getDate() + 4); // get current date
  var first = curr.getDate() - curr.getUTCDay();
  var thursday = new Date(curr.setDate(first + 4)).toLocaleDateString(
    "en-CA"
  );
  return thursday;
};

export const getThursdayDateRoundingDown = (date) => {
  var curr = date || new Date();
  if (curr.getUTCDay() < 4) curr.setDate(curr.getDate() - 7); // get current date
  var first = curr.getDate() - curr.getUTCDay();
  var thursday = new Date(curr.setDate(first + 4)).toLocaleDateString(
    "en-CA"
  );
  return thursday;
};

// Use this
export const getOffsetThursday = (day, days, max) => {
  let target = day;
  target.add(days, 'days');
  
  if(target.day() < 4) {
      target.day(4);
  } else if(target.day() > 4) {
      target.day(11);
  }

  if(target.isAfter(max)) {
      target.day(-3); // rollback to previous thursday
  }

  return target.format("YYYY-MM-DD");
}
