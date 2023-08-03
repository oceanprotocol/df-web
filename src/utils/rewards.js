import { getTotalOceanSupply, getTotalVeSupply } from "./ve.js";
import { getEpoch } from "./epochs.js";

export const convertAPYtoWPR = (apy) => {
  const weeks = 52;
  let apy_passiv = (Math.pow(apy / 100 + 1, 1.0 / weeks) - 1) * weeks;
  let wpr = apy_passiv / weeks;
  return wpr;
};

export const convertWPRtoAPY = (wpr) => {
  const weeks = 52;
  const apr_passiv = wpr * weeks;
  const apy_passiv = ((1 + apr_passiv / weeks) ** weeks - 1) * 100;
  return apy_passiv;
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

export const getPassiveAPY = async () => {
  const oceanSupply = await getTotalOceanSupply();
  let curEpoch = getEpoch();
  let passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1" ? 20 : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const wpr_passive = passiveRewards / oceanSupply;
  return convertWPRtoAPY(wpr_passive);
};

export const getPassiveUserAPY = async (userVeOcean, lockedOcean) => {
  const veOceanSupply = await getTotalVeSupply();
  let curEpoch = getEpoch();
  let passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1" ? 20 : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const rewards = (passiveRewards / veOceanSupply) * userVeOcean;
  const wpr_passive = rewards / lockedOcean;
  return convertWPRtoAPY(wpr_passive);
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
        fields: ["winner_addr", "round", "OCEAN_amt"],
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
