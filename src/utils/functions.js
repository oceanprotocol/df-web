export const getThursdayDate = () => {
    var curr = new Date();
    if (curr.getDay() > 4) curr.setDate(curr.getDate() + 4); // get current date
    var first = curr.getDate() - curr.getDay();
    var thursday = new Date(curr.setDate(first + 4)).toLocaleDateString(
      "en-CA"
    );
    return thursday;
  };