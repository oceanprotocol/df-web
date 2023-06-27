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
        if(import.meta.env.VITE_VE_SUPPORTED_CHAINID === GANACHE) {
          epoch.passive = 10;
          epoch.active = 10;
          epoch.total = 20;
        } else if(import.meta.env.VITE_VE_SUPPORTED_CHAINID === STAGING) {
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