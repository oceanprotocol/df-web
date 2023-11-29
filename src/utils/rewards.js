import { fetchFeeData } from "@wagmi/core";
import { getEpoch } from "./epochs.js";
import { getTotalOceanSupply } from "./ve.js";
import moment from "moment";

const Fees = {
  lock: 400, //Gas usage ~335
  withdraw: 250, //Gas usage ~224
  claim: 200, //Gas usage 130 - 220
  updateLockedAmount: 300, //Gas usage ~277
  updateUnlockDate: 280, //Gas usage ~254
};

const eth = 1000000;

export const convertAPYtoWPR = (apy) => {
  const weeks = 52;
  let apy_passiv = (Math.pow(apy / 100 + 1, 1.0 / weeks) - 1) * weeks;
  let wpr = apy_passiv / weeks;
  return wpr;
};

export const convertWPRtoAPY = (wpr, nrOfCompounds) => {
  const weeks = 52;
  console.log(nrOfCompounds);
  const apy = Math.pow(1 + wpr, nrOfCompounds ? nrOfCompounds : weeks) - 1;
  return apy * 100;
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
  const curEpoch = getEpoch();
  const passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1"
      ? 20
      : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const wpr_passive = passiveRewards / oceanSupply;
  return convertWPRtoAPY(wpr_passive);
};

export const getPassiveUserAPY = async (userVeOcean, lockedOcean) => {
  const veOceanSupply = await getTotalVeSupply();
  let curEpoch = getEpoch();
  let passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1"
      ? 20
      : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const rewards = (passiveRewards / veOceanSupply) * userVeOcean;
  const wpr_passive = rewards / lockedOcean;
  return convertWPRtoAPY(wpr_passive);
};

export const getMsDelta = (unlockDate) => {
  var today = moment.utc();
  var unlockDate = moment.utc(unlockDate);
  return unlockDate.diff(today);
}

export const getVotingPower = (msDelta, getMaxDate, totalAmount) => {
  return ((msDelta / getMaxDate().diff(moment.utc())) * totalAmount).toFixed(3);
};

const calculateFeeForPeriod = (fees, unlockDate) => {
  // Assuming 'fees' contains fee values for different actions (lock, claim, etc.)
  // and 'unlockDate' is the moment object of the unlock date

  const numberOfClaims = calculateNumberOFClaims(unlockDate); // Function from your 'rewards.js'
  const feePerClaim = fees.claim * numberOfClaims;
  const feeForLock = fees.lock;
  const totalFeeForPeriod = feePerClaim + feeForLock; // Summing up fees for lock and claims

  return totalFeeForPeriod;
};

const calculateAPYBasedOnTotalRewards = (principal, totalRewards) => {
  if (principal === 0) return 0; // Avoid division by zero

  // Calculate the APY based on the total rewards and the principal
  const apy = (totalRewards / principal) * 100; // Convert the ratio to a percentage

  return apy;
};

export const calculateCompoundInterestWithFees = async ({
  msDelta,
  getMaxDate,
  lockedOceanAmount,
  formAmount,
  formUnlockDate,
  fees,
  displayedAPY,
  totalVeOceanSupply,
  compounds,
}) => {
  const formatApyForDisplay = (apy, rewards) => {
    return { apy: apy, profit: rewards };
  };

  const startPrincipal =
    formAmount > 0
      ? formAmount + parseFloat(lockedOceanAmount)
      : parseFloat(lockedOceanAmount);

  let calculatedVotingPower = getVotingPower(msDelta, getMaxDate, startPrincipal);

  if (
    calculatedVotingPower <= 0 ||
    (!lockedOceanAmount && formAmount <= 0) ||
    !fees
  ) {
    displayedAPY = formatApyForDisplay(0, 0);
    return;
  }

  let principal = startPrincipal;

  let totalRewards = 0;

  let totalVotingPower = 0;
  for (let i = 0; i < compounds; i++) {
    let tempVotingPower = getVotingPower(
      msDelta / compounds,
      getMaxDate,
      principal
    );

    totalVotingPower += parseFloat(tempVotingPower);

    const totalVeOceanSupplyWithVP =
      totalVeOceanSupply + parseFloat(totalVotingPower);

    // Get rewards data for the current compound period
    const data = await getPassiveUserRewardsData(
      calculatedVotingPower,
      principal,
      totalVeOceanSupplyWithVP,
      1
    );

    let periodReward = data.rewards / compounds; // Annual reward divided by number of compounds
    let feeForPeriod = calculateFeeForPeriod(fees, moment(formUnlockDate)); // Calculate fees for the period

    // Deduct fee from the reward
    periodReward -= feeForPeriod;

    // Add the remaining reward to the principal for the next period
    principal += periodReward;
    totalRewards += periodReward;
  }

  console.log("Total rewards: ", totalRewards);

  let finalAPY = calculateAPYBasedOnTotalRewards(startPrincipal, totalRewards); // Function to calculate APY based on total rewards and final principal
  displayedAPY = formatApyForDisplay(finalAPY, totalRewards);
  return displayedAPY;
};

export const calculateOptimalCompoundInterestWithFees = async ({
  msDelta, getMaxDate, lockedOceanAmount, formAmount, formUnlockDate, fees, totalVeOceanSupply
}) => {
  let optimalCompounds = 1;
  let highestNetReturn = 0;
  let principal = formAmount + lockedOceanAmount;

  // Calculate the optimal number of compounds
  // the 4000 is just a random number, we will never reach it 
  for (let compounds = 1; compounds <= 4000; compounds++) {
      let totalRewards = 0;
      let currentPrincipal = principal;
      let tempTotalSupply = totalVeOceanSupply;

      for (let i = 0; i < compounds; i++) {
          let votingPower = getVotingPower(msDelta / compounds, getMaxDate, currentPrincipal);
          let rewardsData = await getPassiveUserRewardsData(votingPower, currentPrincipal, tempTotalSupply, 1);
          let periodReward = rewardsData.rewards;
          let feeForPeriod = calculateFeeForPeriod(fees, moment(formUnlockDate));

          periodReward -= feeForPeriod;
          tempTotalSupply += periodReward;
          currentPrincipal += periodReward;
          totalRewards += periodReward;
      }

      let netReturn = totalRewards - calculateFeeForPeriod(fees, moment(formUnlockDate));
      if (netReturn > highestNetReturn) {
          highestNetReturn = netReturn;
          optimalCompounds = compounds;
      } else {
          break;
      }
  }

  return optimalCompounds;
};

export const getPassiveUserRewardsData = async (
  userVeOcean,
  lockedOcean,
  veOceanSupply,
  nrOfCompounds
) => {
  const curEpoch = getEpoch();
  const passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1"
      ? 20
      : curEpoch?.streams[0]?.substreams[0]?.rewards;
  const rewards = (passiveRewards / veOceanSupply) * userVeOcean;
  const wpr_passive = rewards / lockedOcean;
  return {
    apy: convertWPRtoAPY(wpr_passive, nrOfCompounds),
    rewards: rewards * 52,
  };
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
          },
        },
        join: [
          {
            alias: "t1",
            type: "left",
            on: {
              "challenge_rewards.winner_addr": "t1.from_addr",
              "challenge_rewards.round": "t1.rnd",
            },
            select: {
              table: "challenge_data",
              fields: [
                {
                  expression: {
                    pattern: "nmse",
                  },
                },
                "from_addr",
                "nft_addr",
                {
                  field: "round",
                  alias: "rnd",
                },
              ],
            },
          },
        ],
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
  for (const key of Object.keys(fees)) {
    fees[key] = fees[key] * ethUsdPrice;
  }
  return fees;
};

export const calculateNumberOFClaims = (unlockDate) => {
  const numberOfWeeks = unlockDate.diff(moment(), "weeks");

  //user needs to claim at least once per every 52 weeks
  const numberOfClaims = Math.ceil(numberOfWeeks / 52);
  return numberOfClaims > 0 ? numberOfClaims : 1;
};

export const calculateFees = async (unlockDate, ethTokenPrice, compounds) => {
  const feeData = await fetchFeeData({
    chainId: 1,
    formatUnits: "gwei",
  });
  const gasPriceInGwei = feeData.formatted.gasPrice;
  const txFees = JSON.parse(JSON.stringify(Fees));
  for (const key of Object.keys(txFees)) {
    txFees[key] = (txFees[key] * gasPriceInGwei) / eth;
  }

  //update Fees to proper values in usd
  await getFeesInUSD(ethTokenPrice, txFees);

  const numberOfClaims = calculateNumberOFClaims(unlockDate);
  const simpleFlow =
    txFees.lock +
    txFees.withdraw +
    txFees.claim * numberOfClaims +
    compounds *
      (txFees.updateLockedAmount + txFees.updateUnlockDate + txFees.claim);

  return { fees: txFees, simpleFlowFeesCost: simpleFlow };
};
