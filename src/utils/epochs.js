import { writable } from "svelte/store";
import moment from "moment"
import * as epochs from "../utils/metadata/epochs/epochs.json";

export const getEpoch = (date) => {
  let epoch;
  try {
    for(let i=0; i<epochs.default.length; i++) {
      epoch = epochs.default[i];
      
      let dateStart = moment(epoch.date_start)
      let dateEnd = moment(epoch.date_end)
      
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