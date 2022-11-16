import { getTotalVeSupply } from "./ve";
import { getEpoch } from "./epochs";

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
  const weeks = 52
  const apr = wpr_passive * weeks
  const apy_passiv = (((1 + apr/weeks) ** weeks) - 1) * 100
  return apy_passiv 
}

export const getActiveAPY = async () => {
  let res;
  try {
    res = await fetch(`${process.env.BACKEND_API}/apy/active`, {
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
  return data.apy;
}