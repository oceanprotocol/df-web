import { getThursdayDate, isThursday } from "./functions";

import { getEpoch } from "./epochs";
import { getMaxDate } from "./rewards";
import { getTokenPriceFromCoingecko } from "./tokens";
import moment from "moment";

export const calculateOptimalCompoundInterestWithFees = async ({
  lockedOceanAmount,
  formAmount,
  formUnlockDate,
  fees,
  totalVeOceanSupply,
}) => {
  const msDelta = moment(formUnlockDate).diff(moment());
  let optimalCompoundCount = 1;
  let highestNetReturn = 0;
  let optimalCompoundDetails = [];

  const oceanTokenPrice = await getTokenPriceFromCoingecko(
    "ocean-protocol",
    "usd"
  );

  let hasReachedMaxReturn = false;
  const principalAmount = formAmount + lockedOceanAmount;

  let currentCompoundDetails;
  while (!hasReachedMaxReturn) {
    currentCompoundDetails = await calculateCompoundDetails({
      principal: principalAmount,
      totalSupply: totalVeOceanSupply,
      fees: fees,
      msDelta,
      compoundCount: optimalCompoundCount,
      tokenPrice: oceanTokenPrice,
      formUnlockDate,
    });

    const { netRewardsInOcean, compoundDetails } = currentCompoundDetails;

    console.log("currentCompoundDetails", currentCompoundDetails);

    if (netRewardsInOcean > highestNetReturn) {
      highestNetReturn = netRewardsInOcean;
      optimalCompoundCount = optimalCompoundCount + 1;
      optimalCompoundDetails = compoundDetails;
    } else {
      hasReachedMaxReturn = true;
    }
  }

  const optimalAPY = calculateAPY(principalAmount, highestNetReturn);

  const result = {
    optimalCompounds: optimalCompoundCount,
    optimalAPY,
    optimalCompoundDetails,
    highestNetReturn,
    ...currentCompoundDetails,
  };
  console.log("result", result);
  return result;
};

const calculateCompoundDetails = async ({
  principal,
  totalSupply,
  fees,
  msDelta,
  compoundCount,
  tokenPrice,
  formUnlockDate,
}) => {
  let currentPrincipal = principal;
  let tempTotalSupply = totalSupply;
  let grossRewards = 0;
  let totalCostInOcean = 0;
  let claimCount = 0;
  const compoundDetails = [];

  console.log("msDelta", msDelta);
  console.log("compoundCount", compoundCount);
  const compoundDates = calculateCompoundAndStartDates(
    formUnlockDate,
    compoundCount
  );
  console.log("compoundDates", compoundDates);
  for (let i = 0; i < compoundCount; i++) {
    const { periodReward, totalPeriodClaims } = await calculateRewardForPeriod({
      periodStartDate: compoundDates[i],
      periodEndDate: compoundDates[i + 1],
      formUnlockDate: formUnlockDate,
      periodMS: msDelta / compoundCount,
      currentPrincipal,
      tempTotalSupply,
      fees,
    });

    claimCount += totalPeriodClaims;
    tempTotalSupply += periodReward;
    currentPrincipal += periodReward;
    grossRewards += periodReward;

    compoundDetails.push({
      order: i,
      periodReward,
      tempTotalSupply,
      stepPrincipal: currentPrincipal - periodReward,
      nextPrincipal: currentPrincipal,
      grossRewards,
      totalPeriodClaims,
    });
  }

  const costs = calculateTotalCost(claimCount, compoundCount, fees);
  totalCostInOcean = costs.totalCost / tokenPrice;

  const netRewards = grossRewards - totalCostInOcean;
  return {
    grossRewards,
    netRewardsInOcean: netRewards,
    compoundDetails,
    totalCostInOcean,
    costs: costs,
    claimCount,
  };
};

const calculateTotalCost = (claimCount, compoundCount, fees) => {
  const claimFees = claimCount * fees.claim;
  const updateFees = (compoundCount - 1) * fees.updateLockedAmount;
  const lockFee = fees.lock;
  const withdrawFee = fees.withdraw;

  const total = claimFees + updateFees + lockFee + withdrawFee;

  return {
    totalCost: total,
    claimCount,
    claimFees,
    updateFees,
    lockFee,
    withdrawFee,
  };
};

const calculateAPY = (principal, totalRewards) => {
  if (principal === 0) return 0;
  return (totalRewards / principal) * 100;
};

async function calculateRewardForPeriod({
  periodStartDate,
  periodEndDate,
  formUnlockDate,
  periodMS,
  currentPrincipal,
  tempTotalSupply,
  fees,
}) {
  const args = {
    lockedOcean: currentPrincipal,
    veOceanSupply: tempTotalSupply,
    unlockDate: moment(formUnlockDate), // Assuming this is the correct interpretation
    currentDate: moment(periodStartDate),
    periodEndDate: moment(periodEndDate), // Example logic
  };

  console.log("currentDate", moment(args.currentDate).format("YYYY-MM-DD"));
  console.log("periodEndDate", moment(args.periodEndDate).format("YYYY-MM-DD"));
  console.log("currentPrincipal", args.lockedOcean);
  console.log("tempTotalSupply", args.veOceanSupply);
  const rewardsData = await getPeriodRewardData(args);
  console.log("rewardsData", rewardsData);
  const periodReward = rewardsData.rewards; // Example assignment, adjust based on actual logic
  const totalPeriodClaims = calculateFeeForPeriod(
    fees /* duration in ms for the period */,
    periodMS
  ).totalPeriodClaims;

  return {
    periodReward,
    totalPeriodClaims,
  };
}

export const calculatePeriodClaimsWithMS = (msDelta) => {
  const oneWeekInMs = 604800000;
  const numberOfWeeks = Math.ceil(msDelta / oneWeekInMs);
  const numberOfClaims = Math.floor(numberOfWeeks / 52);
  return numberOfClaims;
};

const calculateFeeForPeriod = (fees, periodMsDelta) => {
  // Assuming 'fees' contains fee values for different actions (lock, claim, etc.)
  // and 'unlockDate' is the moment object of the unlock date
  const mandatoryClaimCount = calculatePeriodClaimsWithMS(periodMsDelta); // Function from your 'rewards.js'
  const totalPeriodClaims = mandatoryClaimCount + 1; // Adding 1 to include the claim at the end of the period
  const feeForClaims = fees.claim * totalPeriodClaims;
  const feeUpdateAmount = fees.updateLockedAmount;
  const totalFeeForPeriod = feeForClaims + feeUpdateAmount; // Summing up fees for lock and claims

  return {
    totalFeeForPeriod,
    feeForClaims,
    feeUpdateAmount,
    mandatoryClaimCount,
    totalPeriodClaims,
  };
};

const calculateAPYBasedOnTotalRewards = (principal, totalRewards) => {
  if (principal === 0) return 0; // Avoid division by zero

  // Calculate the APY based on the total rewards and the principal
  const apy = (totalRewards / principal) * 100; // Convert the ratio to a percentage

  return apy;
};

const calculateCompoundAndStartDates = (unlockDate, compoundCount) => {
  const compoundDates = [];
  const msDelta = Math.abs(moment(unlockDate).diff(moment()));
  const periodMsDelta = msDelta / compoundCount;
  let currentDate = moment();
  for (let i = 0; i < compoundCount; i++) {
    let tempEndDate = currentDate.add(periodMsDelta, "ms");
    if (!isThursday(tempEndDate)) {
      tempEndDate = moment(getThursdayDate(tempEndDate));
    }
    currentDate = tempEndDate;
    compoundDates.push(currentDate.format("YYYY-MM-DD"));
  }

  compoundDates.unshift(moment(getThursdayDate(moment())).format("YYYY-MM-DD"));

  return compoundDates;
};

export const getPeriodRewardData = async ({
  lockedOcean,
  veOceanSupply,
  unlockDate,
  currentDate,
  periodEndDate,
}) => {
  let tempCurrentDate = currentDate;
  if (!isThursday(currentDate) || !isThursday(periodEndDate)) {
    throw new Error("Invalid date format. Only Thursdays are supported.");
  }

  //let tempCurrentDate = moment(getThursdayDate(moment(currentDate)));
  let totalRewards = 0;
  let rewards = 0;
  let weeks = 0;

  const momentPeriodEndDate = moment(periodEndDate, "YYYY-MM-DD");
  const curEpoch = getEpoch();
  const passiveRewards =
    import.meta.env.VITE_VE_SUPPORTED_CHAINID != "1"
      ? 20
      : curEpoch?.streams[0]?.substreams[0]?.rewards;

  while (tempCurrentDate.isBefore(momentPeriodEndDate)) {
    const msDelta = unlockDate.diff(tempCurrentDate);
    const votingPower = parseFloat(
      (msDelta / getMaxDate().diff(currentDate)) * parseFloat(lockedOcean)
    ).toFixed(3);
    rewards = (passiveRewards / veOceanSupply) * votingPower;
    totalRewards += rewards;
    weeks += 1;
    tempCurrentDate = tempCurrentDate.add(1, "weeks");
  }

  const yyield = (lockedOcean + totalRewards) / lockedOcean - 1;
  const wpr = yyield / weeks;

  return {
    apy: wpr * 52 * 100,
    yield: yyield * 100,
    weeks,
    rewards: totalRewards,
  };
};
