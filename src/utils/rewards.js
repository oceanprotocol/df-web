import { getTotalOceanSupply } from "./ve.js";
import { getEpoch } from "./epochs.js";

export const convertAPYtoWPR = (apy) => {
  const weeks = 52;
  let apy_passiv = (Math.pow(apy / 100 + 1, 1.0 / weeks) - 1) * weeks;
  let wpr = apy_passiv / weeks;
  return wpr;
};

export const convertWPRtoAPY = (wpr) => {
  const weeks = 52;
  const apy = (((1 + wpr) ** weeks) - 1) * 100;
  return apy;
};

export const getRewards = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          LP_addr: userAddress.toLowerCase(),
        },
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
};

export const getRewardsForDataAllocation = (
  rewards,
  userAddress,
  nftAddress
) => {
  let reward = rewards.find((reward) => {
    if (reward.LP_addr === userAddress && reward.nft_addr === nftAddress) {
      return reward;
    }
  });
  return reward ? reward.amt : 0.0;
};

/*export const calculateAPR = async (veOCEAN) => {
  const veSupply = parseFloat(await getTotalVeSupply())
  const newVeSupply = veSupply + veOCEAN
  const curEpoch = getEpoch();
  const passiveRewards = curEpoch?.streams[0]?.substreams[0]?.rewards
  console.log(passiveRewards, passiveRewards, veOCEAN, newVeSupply)
  const myRewards = parseFloat(passiveRewards) * veOCEAN / newVeSupply
  const myShare = (veOCEAN / newVeSupply) * 100
  console.log('myRewards', myRewards)
  console.log('myShare', parseFloat(myShare).toFixed(2),"%")
  const roundYield = (!myRewards || !veOCEAN) ? 0 : myRewards / veOCEAN
  const APR = roundYield * 52
  const APY = ((1 + roundYield)^52) - 1
  console.log(parseFloat(roundYield).toFixed(2),parseFloat(APR).toFixed(2),parseFloat(APY).toFixed(2))
}*/

export const getPassiveAPY = async () => {
  const oceanSupply = await getTotalOceanSupply();
  const curEpoch = getEpoch();
  const passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1" ? 20 : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const wpr_passive = passiveRewards / oceanSupply;
  return convertWPRtoAPY(wpr_passive);
};

export const getPassiveUserRewardsData = async (userVeOcean, lockedOcean, veOceanSupply) => {
  const curEpoch = getEpoch();
  const passiveRewards = import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1" ? 20 : curEpoch?.streams[0]?.substreams[0]?.rewards;
  /*veOceanSupply = 40000000
  userVeOcean = 21000*/
  console.log(passiveRewards, veOceanSupply)
  const weeklyRewards = (passiveRewards / (veOceanSupply + userVeOcean)) * userVeOcean
  console.log('weekly rewards',weeklyRewards)
  const yearlyRewards = weeklyRewards * 52
  console.log('yearly rewards:',yearlyRewards)
  const apr = yearlyRewards * 100 / (veOceanSupply + userVeOcean)
  console.log(apr, '%')
  const apy = ((1+(apr/52))**52)-1
  console.log('apy:',apy,'%')
  return {apy: ((1+(apr/52))**52)-1, weeklyRewards: weeklyRewards};
};

export const getActiveAPY = async (userAddress) => {
  let res;
  try {
    res = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/apy/${
        userAddress ? `addr/${userAddress}` : "active"
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data.apy ? data.apy * 100 : 0;
};

export const getRoundAPY = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/rewardsSummary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userAddress
          ? {
              round: {
                $gt: -1,
              },
              LP_addr: userAddress.toLowerCase(),
            }
          : {
              round: {
                $gt: -1,
              },
            },
        fields: [
          {
            expression: {
              pattern: "sum(curating_amt)",
            },
          },
          {
            expression: {
              pattern: "sum(passive_amt)",
            },
          },
          {
            expression: {
              pattern: "sum(challenge_amt)",
            },
          },
          "round",
        ],
        group: "round",
      }),
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data;
};

export const getVeOceanBal = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/vebals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userAddress
          ? {
              round: {
                $gt: -1,
              },
              LP_addr: userAddress.toLowerCase(),
            }
          : {
              round: {
                $gt: -1,
              },
            },
        fields: [
          {
            expression: {
              pattern: "sum(locked_amt)",
            },
          },
          "round",
        ],
        group: "round",
      }),
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data;
};

export const getDFallocations = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/allocations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userAddress
          ? {
              round: {
                $gt: -1,
              },
              LP_addr: userAddress.toLowerCase(),
            }
          : {
              round: {
                $gt: -1,
              },
            },
        fields: [
          {
            expression: {
              pattern: "sum(ocean_amt)",
            },
          },
          "round",
        ],
        group: "round",
      }),
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data;
};

export const getChallengeRewards = async () => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/challenge/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
              round: {
                $gt: 47,
              }
            },
            join: [
              {
                "alias": "t1",
                "type": "left",
                "on": {
                  "challenge_rewards.winner_addr": "t1.from_addr",
                  "challenge_rewards.round": "t1.rnd"
                },
                "select": {
                  "table": "challenge_data",
                  "fields": [
                    {
                      "expression": {
                        "pattern": "nmse"
                      }
                    },
                    "from_addr",
                    "nft_addr",
            {
                      "field": "round",
                      "alias": "rnd"
                    }
                  ]
                }
              }
            ]
      }),
      
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data;
};

export const calcTotalAPY = (activeAPY, passiveAPY) => {
  let wpr_active = convertAPYtoWPR(activeAPY);
  let wpr_passive = convertAPYtoWPR(passiveAPY);
  let wpr_total = wpr_active + wpr_passive;
  return convertWPRtoAPY(wpr_total);
};
