import { getTotalOceanSupply } from "./ve.js";
import { getEpoch } from "./epochs.js";
import { fetchFeeData } from '@wagmi/core'
import moment from "moment";
import { getThursdayDate, getThursdayOffset } from "./functions.js";

const MAXDAYS = 4 * 365;
const Fees = {
  lock: 400, //Gas usage ~335
  withdraw: 250, //Gas usage ~224
  claim: 200, //Gas usage 130 - 220
  updateLockedAmount: 300, //Gas usage ~277
  updateUnlockDate: 280 //Gas usage ~254
}

const eth = 1000000

export const convertAPYtoWPR = (apy) => {
  const weeks = 52;
  let apy_passiv = (Math.pow(apy / 100 + 1, 1.0 / weeks) - 1) * weeks;
  let wpr = apy_passiv / weeks;
  return wpr;
};

export const convertWPRtoAPY = (wpr, nrOfCompounds) => {
  const weeks = 52;
  console.log(nrOfCompounds)
  const apy = Math.pow(1 + wpr, nrOfCompounds ? nrOfCompounds : weeks) - 1;
  return parseFloat(apy * 100);
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

export const getMaxDate = () => {
  let max = moment.utc().add(MAXDAYS, "days");
  return moment.utc(getThursdayOffset(moment().utc(), MAXDAYS, max));
};

export const getPassiveAPY = async () => {
  const oceanSupply = await getTotalOceanSupply();
  const curEpoch = getEpoch();
  const passiveRewards =
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
}


export const getPassiveUserRewardsData = async (userVeOcean, lockedOcean, veOceanSupply, unlockDate, nrOfCompounds, compoundFees, basicFlowFees) => {
  let currentDate = moment(getThursdayDate(moment()))
  let totalRewards = 0
  let rewards = 0
  let weeks = 0

  const curEpoch = getEpoch();
  const passiveRewards = import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1" ? 20 : curEpoch?.streams[0]?.substreams[0]?.rewards;

  while(currentDate.isBefore(unlockDate)){
    let msDelta = unlockDate.diff(currentDate);
    const votingPower = parseFloat(
      (msDelta / getMaxDate().diff(currentDate)) *
       parseFloat(lockedOcean)
    ).toFixed(3)
    rewards = passiveRewards / veOceanSupply * votingPower;
    totalRewards += rewards
    weeks += 1
    currentDate = currentDate.add(1, 'weeks')
  }

  const yyield = ((lockedOcean + totalRewards - basicFlowFees)) / lockedOcean - 1
  const wpr = yyield / weeks
  console.log(totalRewards, wpr, weeks, yyield * 100, basicFlowFees)
  return {apy: wpr * 52 * 100, yield: yyield * 100, rewards: totalRewards - basicFlowFees}
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

const getFeesInUSD = (ethUsdPrice, fees) => {
  for (const key of Object.keys(fees)){
    fees[key] = fees[key] * ethUsdPrice
  }
  return fees
}

export const calculateNumberOFClaims = (unlockDate) => {
  const numberOfWeeks = unlockDate.diff(moment(), 'weeks')

  //user needs to claim at least once per every 52 weeks
  const numberOfClaims = Math.ceil(numberOfWeeks / 52)
  return numberOfClaims>0 ? numberOfClaims : 1
}

export const calculateFees = async (unlockDate, ethTokenPrice, compounds) => {
  const feeData = await fetchFeeData({
    chainId: 1,
    formatUnits: 'gwei',
  })
  const gasPriceInGwei = feeData.formatted.gasPrice
  const txFees = JSON.parse(JSON.stringify(Fees))
  for (const key of Object.keys(txFees)){
    txFees[key] = txFees[key] * gasPriceInGwei / eth
  }

  //update Fees to proper values in usd
  await getFeesInUSD(ethTokenPrice, txFees)

  const numberOfClaims = calculateNumberOFClaims(unlockDate)
  const simpleFlow = txFees.lock + txFees.withdraw + (txFees.claim * numberOfClaims) + compounds * ( txFees.updateLockedAmount + txFees.updateUnlockDate + txFees.claim )

  return {fees: txFees, simpleFlowFeesCost: simpleFlow}
}