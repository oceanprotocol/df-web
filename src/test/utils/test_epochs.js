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

const date6 = moment("2022-10-08")
const epoch6 = getEpoch(date6)
if( epoch6.index != 6 ) throw true

const date8 = moment("2022-10-23")
const epoch8 = getEpoch(date8)
if( epoch8.index != 8 ) throw true

let arr = [0,1,2,3,4,5]
console.log("arr", arr)
console.log("arr.length", arr.length)
console.log("epochs.length", epochs.length)