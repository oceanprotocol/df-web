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