import {convertWPRtoAPY, convertAPYtoWPR} from "../../utils/rewards.js"

const getPassiveAPY = (veSupply, epoch) => {
    const wpr_passive = epoch.passive / veSupply
    const weeks = 52
    const apr_passiv = wpr_passive * weeks
    const apy_passiv = (((1 + apr_passiv/weeks) ** weeks) - 1) * 100

    return apy_passiv
}

// Test #1
let veSupply = 1000;
let epoch =   {
    "id": 1,
    "date_start": "2022-06-16",
    "date_end": "2022-06-23",
    "passive": 10,
    "active": 10,
    "total": 20
}
let apy_passiv = getPassiveAPY(veSupply, epoch);
if( apy_passiv.toFixed(2) != 67.77 ) throw true;

// Test #2
veSupply = 50000;
epoch.passive = 100;
apy_passiv = getPassiveAPY(veSupply, epoch);
if( apy_passiv.toFixed(2) != 10.95 ) throw true;

//Test WPRtoAPY and APYtoWPR conversions
let wpr = 0.0015065927431079373
let calculated_apy = convertWPRtoAPY(wpr)
let calculated_wpr = convertAPYtoWPR(calculated_apy)
if(parseFloat(calculated_apy).toFixed(5) != parseFloat(calculated_wpr).toFixed(5)) throw true
