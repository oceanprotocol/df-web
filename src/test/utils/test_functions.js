const moment = require('moment');

const getThursdayDate = (date) => {
    // returns: nearest, forward looking thursday from the specified date
    // params: moment(date)
    
    if(date.day() < 4) {
        date.day(4);
    } else if(date.day() > 4) {
        date.day(11);
    }

    return date.format("YYYY-MM-DD");
};

const getThursdayOffset = (date, days, max) => {
    // returns: nearest, forward looking thursday from specified date, and day offset
    // returns: nearest thursday below the maximum date
    console.log("1. day:", date);
    
    let target = date;
    target.add(days, 'days');
    
    if(target.day() < 4) {
        target.day(4);
    } else if(target.day() > 4) {
        target.day(11);
    }

    if(target.isAfter(max)) {
        // This assumes the date is always a week after max
        // TODO - Update to cap at max + rollback to closest thu
        target.day(-3); // rollback to previous thursday
    }

    console.log("2. max", max);
    console.log("3. target-final:", target);
    console.log("4. target-day:", target.day());
    console.log("");
    return target.format("YYYY-MM-DD");
}

console.log("\n>>>>> moment >>>>>>")
console.log("moment()", moment())
console.log("moment().utc()", moment().utc())

console.log("\n>>>>> getThursdayDate() >>>>>>")
console.log("getThursdayDate from 2022-09-10 sat:", getThursdayDate(moment("2022-09-10")));
console.log("getThursdayDate from 2022-09-11 sun:", getThursdayDate(moment("2022-09-11")));
console.log("getThursdayDate from 2022-09-12 mon:", getThursdayDate(moment("2022-09-12")));
console.log("getThursdayDate from 2022-09-13 tue:", getThursdayDate(moment("2022-09-13")));
console.log("getThursdayDate from 2022-09-14 wed:", getThursdayDate(moment("2022-09-14")));
console.log("getThursdayDate from 2022-09-15 thu:", getThursdayDate(moment("2022-09-15")));
console.log("getThursdayDate from 2022-09-16 fri:", getThursdayDate(moment("2022-09-16")));
console.log("getThursdayDate from 2022-09-17 sat:", getThursdayDate(moment("2022-09-17")));
console.log("getThursdayDate from 2022-09-18 sun:", getThursdayDate(moment("2022-09-18")));
console.log("getThursdayDate from 2022-09-19 mon:", getThursdayDate(moment("2022-09-19")));
console.log("getThursdayDate from 2022-09-20 tue:", getThursdayDate(moment("2022-09-20")));
console.log("getThursdayDate from 2022-09-21 wed:", getThursdayDate(moment("2022-09-21")));

// Asserts all thursdays chosen are day() == 4
// All values are also within bounds of max date
console.log("\n>>>>> getThursdayOffset() >>>>>>")
let max = moment().utc().add(1460, 'days');
if( moment.utc(getThursdayOffset(moment().utc(), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment().utc(), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment().utc(), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment().utc(), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment().utc(), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-15").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-15"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-15"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-15"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-15"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-15"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-16").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-16"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-16"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-16"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-16"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-16"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-17").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-17"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-17"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-17"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-17"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-17"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-18").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-18"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-18"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-18"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-18"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-18"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-19").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-19"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-19"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-19"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-19"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-19"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-20").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-20"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-20"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-20"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-20"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-20"), 1460, max)).day() != 4 ) throw true;

max = moment.utc("2022-09-21").add(1460, 'days')
if( moment.utc(getThursdayOffset(moment.utc("2022-09-21"), 7, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-21"), 30, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-21"), 180, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-21"), 730, max)).day() != 4 ) throw true;
if( moment.utc(getThursdayOffset(moment.utc("2022-09-21"), 1460, max)).day() != 4 ) throw true;