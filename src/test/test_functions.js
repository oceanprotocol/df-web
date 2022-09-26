const moment = require('moment');

const getOffsetThursday = (day, days, max) => {
    console.log("");
    console.log("1. day:", day);
    
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

    console.log("3. max", max);
    console.log("4. target-final:", target);
    console.log("2. target-day:", target.day());
    return target.format("YYYY-MM-DD");
}

// Asserts all thursdays chosen are day() == 4
// All values are also within bounds of max date
let max = moment().add(1460, 'days');
if( moment(getOffsetThursday(moment(), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment(), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment(), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment(), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment(), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-15").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-15"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-15"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-15"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-15"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-15"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-16").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-16"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-16"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-16"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-16"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-16"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-17").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-17"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-17"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-17"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-17"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-17"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-18").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-18"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-18"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-18"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-18"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-18"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-19").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-19"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-19"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-19"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-19"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-19"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-20").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-20"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-20"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-20"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-20"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-20"), 1460, max)).day() != 4 ) throw true;

max = moment("2022-09-21").add(1460, 'days')
if( moment(getOffsetThursday(moment("2022-09-21"), 7, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-21"), 30, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-21"), 180, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-21"), 730, max)).day() != 4 ) throw true;
if( moment(getOffsetThursday(moment("2022-09-21"), 1460, max)).day() != 4 ) throw true;