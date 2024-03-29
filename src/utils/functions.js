export const getThursdayDate = (date) => {
  // returns: nearest, forward looking thursday from the specified date
  // params: moment(date)
  
  if(date.day() < 4) {
      date.day(4);
  } else if(date.day() >= 4) {
      date.day(11);
  }

  return date.format("YYYY-MM-DD");
};

export const getThursdayOffset = (day, days, max) => {
  // returns: nearest, forward looking thursday from specified date, and day offset
  // returns: nearest thursday below the maximum date

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

export const isThursday = (date) => {
  // returns: true if date is a thursday
  // params: moment(date)

  return date.day() == 4;
}

export const getRoundsDatafarm = (currentRound, limit) => {
    currentRound
    // return an array of numbers from currentRound to (currentRound-10)
    const rounds = [];
    for (let i = currentRound-1; i >= currentRound - limit; i--) {
      rounds.push(i);
    }
    return rounds;
}