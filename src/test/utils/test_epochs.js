const moment = require('moment');
const epochs = require('../../utils/metadata/epochs/epochs.json');

const getEpoch = (date) => {
  let epoch;
  try {
    for(let i=0; i<epochs.length; i++) {
      epoch = epochs[i];
      
      dateStart = moment(epoch.date_start)
      dateEnd = moment(epoch.date_end)
        
      if(dateStart.isBefore(date) && dateEnd.isAfter(date)) {
        return epoch
      }
    }
  } catch (error) {
    console.log(error);
    return [];
  }
  return null;
}

const today = moment()
const todayEpoch = getEpoch(today)
console.log("today:", today)
console.log("todayEpoch:", todayEpoch)

const date1 = moment("2022-06-18")
const epoch1 = getEpoch(date1)
if( epoch1.index != 1 ) throw true

const date3 = moment("2022-07-01")
const epoch3 = getEpoch(date3)
if( epoch3.index != 3 ) throw true

const date5 = moment("2022-10-08")
const epoch5 = getEpoch(date5)
if( epoch5.index != 5 ) throw true

const date7 = moment("2022-10-23")
const epoch7 = getEpoch(date7)
if( epoch7.index != 7 ) throw true

let arr = [0,1,2,3,4,5]
console.log("arr", arr)
console.log("arr.length", arr.length)
console.log("epochs.length", epochs.length)