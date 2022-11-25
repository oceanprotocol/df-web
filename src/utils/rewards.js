import { getTotalVeSupply } from "./ve";
import { getEpoch } from "./epochs";

const convertAPYtoWPR = (apy) => { 
  const weeks = 52
  let apy_passiv = ((Math.pow((apy / 100) + 1, 1.0/weeks) - 1) * weeks)
  let wpr = apy_passiv / weeks
  return(wpr)
}

const convertWPRtoAPY = (wpr) =>{
  const weeks = 52
  const apr_passiv = wpr * weeks
  const apy_passiv = (((1 + apr_passiv/weeks) ** weeks) - 1) * 100
  return apy_passiv
}

export const getRewards = async(userAddress) => {
  let res;
  try {
    res = await fetch(`${process.env.BACKEND_API}/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "query":{
          "LP_addr":userAddress.toLowerCase()
      }
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

export const getRewardsForDataAllocation = (rewards,  userAddress, nftAddress) => {
  let reward = rewards.find((reward) => {
    if(reward.LP_addr === userAddress && reward.nft_addr === nftAddress){
      return reward
    }
  })
  return reward ? reward.amt : 0.0
}

export const getPassiveAPY = async () => {
  const veSupply = await getTotalVeSupply()
  let curEpoch = getEpoch();
  const wpr_passive = curEpoch.passive / veSupply
  return convertWPRtoAPY(wpr_passive) 
}

export const getActiveAPY = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${process.env.BACKEND_API}/apy/${userAddress ? `addr/${userAddress}` : 'active'}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data.apy ? data.apy : 0;
}

export const calcTotalAPY = (activeAPY, passiveAPY) => {
  let wpr_active = convertAPYtoWPR(activeAPY)
  let wpr_passive = convertAPYtoWPR(passiveAPY)
  let wpr_total = wpr_active + wpr_passive
  return convertWPRtoAPY(wpr_total)
}