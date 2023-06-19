import moment from "moment"
import * as epochs from "../utils/metadata/epochs/epochs.json";

const GANACHE = "8996"
const STAGING = "5"

export const getEpoch = (date) => {
  let epoch;
  try {
    for(let i=0; i<epochs.default.length; i++) {
      epoch = epochs.default[i];
      
      let dateStart = moment.utc(epoch.date_start,"YYYY-MM-DD")
      let dateEnd = moment.utc(epoch.date_end,"YYYY-MM-DD")
      
      if(dateStart.isBefore(date) && dateEnd.isAfter(date)) {
        // Numbers enforced in test environments to produce a verifiable apy
        if(process.env.VE_SUPPORTED_CHAINID === GANACHE) {
          epoch.passive = 10;
          epoch.active = 10;
          epoch.total = 20;
        } else if(process.env.VE_SUPPORTED_CHAINID === STAGING) {
          epoch.passive = 100;
          epoch.active = 100;
          epoch.total = 200;
        }

        return epoch
      }
    }
  } catch (error) {
    console.log(error);
    return [];
  }
  return null;
}

export const getUpcomingFirstWednesdayOfTheMonth = () => {
  // Get current date
  let currentDate = moment.utc();
  
  // If it's already Thursday or it's past the first Wednesday, move to the next month
  if (currentDate.date() > 7 || currentDate.day() >= 4) {
    currentDate = currentDate.add(1, 'month');
  }

  // Set date to first day of the month
  currentDate.date(1);

  // Find the first Wednesday of the month
  let firstWednesday = currentDate.day() <= 3 ? currentDate.day(3) : currentDate.add(1, 'week').day(3);

  // Set time to 23:59
  firstWednesday.hour(23).minute(59).second(0).millisecond(0);

  // Return the result
  return firstWednesday;
}