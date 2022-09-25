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