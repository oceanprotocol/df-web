import { getThursdayDate, isThursday } from "./functions";

import { getEpoch } from "./epochs";
import { getMaxDate } from "./rewards";
import { getTokenPriceFromCoingecko } from "./tokens";
import moment from "moment";

/**
 * Calculates the optimal number of compounding events and the corresponding
 * Annual Percentage Yield (APY) for a specific amount of Ocean tokens,
 * considering the locked amount, unlock date, fees, and total veOCEAN supply.
 * Returns details of the optimal compounding strategy, including the highest net return in Ocean tokens.
 *
 * @param {number} lockedOceanAmount - The amount of Ocean tokens locked in the contract
 * @param {number} formAmount - The amount of Ocean tokens to be locked
 * @param {string} formUnlockDate - The unlock date of the tokens
 * @param {object} fees - The fees object
 * @param {number} totalVeOceanSupply - The total supply of veOCEAN tokens
 * @returns {Object} - The optimal compound count and APY
 */
export const calculateOptimalCompoundInterestWithFees = async ({
  lockedOceanAmount,
  formAmount,
  formUnlockDate,
  fees,
  totalVeOceanSupply,
  compounds
}) => {
  const msDelta = moment(formUnlockDate).diff(moment());
  let optimalCompoundCount = compounds ? compounds : 1;
  let highestNetReturn = 0;
  let optimalCompoundDetails = [];

  const oceanTokenPrice = await getTokenPriceFromCoingecko(
    "ocean-protocol",
    "usd"
  );

  let hasReachedMaxReturn = false;
  const principalAmount = formAmount + lockedOceanAmount;

  let currentCompoundDetails;

  if(compounds){
    currentCompoundDetails = await calculateCompoundDetails({
      principal: principalAmount,
      totalSupply: totalVeOceanSupply,
      fees: fees,
      msDelta,
      compoundCount: optimalCompoundCount,
      tokenPrice: oceanTokenPrice,
      formUnlockDate,
    });
    const { netRewardsInOcean } = currentCompoundDetails;
    optimalCompoundCount = compounds + 1
    highestNetReturn = netRewardsInOcean;
    optimalCompoundDetails = currentCompoundDetails;
  }else{
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

      const { netRewardsInOcean } = currentCompoundDetails;

      if (netRewardsInOcean > highestNetReturn) {
        highestNetReturn = netRewardsInOcean;
        optimalCompoundCount = optimalCompoundCount + 1;
        optimalCompoundDetails = currentCompoundDetails;
      } else {
        hasReachedMaxReturn = true;
      }
    }
  }

  const optimalAPY = calculateAPY(principalAmount, highestNetReturn);

  const result = {
    optimalCompounds: optimalCompoundCount - 1,
    optimalAPY,
    ...optimalCompoundDetails,
  };
  //console.log("result", result);
  return result;
};

/**
 * Computes detailed compounding information for a specified principal amount of Ocean tokens
 * over a set number of compounding periods. Takes into account the total veOCEAN supply,
 * fees, time delta, token price, and unlock date. Returns comprehensive compound details
 * including gross rewards, net rewards in Ocean tokens, and the total cost in Ocean tokens.
 *
 * @param {number} principal - The amount of Ocean tokens locked in the contract
 * @param {number} totalSupply - The total supply of veOCEAN tokens
 * @param {object} fees - The fees object
 * @param {number} msDelta - The time delta in milliseconds
 * @param {number} compoundCount - The number of compounds
 * @param {number} tokenPrice - The price of the Ocean token
 * @param {string} formUnlockDate - The unlock date of the tokens
 * @returns {Object} - The compound details
 * @property {number} grossRewards - The gross rewards
 * @property {number} netRewardsInOcean - The net rewards in Ocean tokens
 * @property {object} compoundDetails - The compound details
 * @property {object} costs - The costs object
 * @property {number} claimCount - The number of claims
 * @property {string} periodStartDate - The start date of the period
 * @property {string} periodEndDate - The end date of the period
 */
const calculateCompoundDetails = async ({
  principal,
  totalSupply,
  fees,
  msDelta,
  compoundCount,
  formUnlockDate,
}) => {
  console.log('compoundCount',compoundCount)
  let currentPrincipal = principal;
  let tempTotalSupply = totalSupply;
  let grossRewards = 0;
  let claimCount = 0;
  const compoundDetails = [];

  const compoundDates = calculateCompoundAndStartDates(
    formUnlockDate,
    compoundCount
  );

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
      rewards: periodReward,
      fees: periodReward - grossRewards,
      totalPeriodClaims,
      date: compoundDates[i + 1],
    });
  }

  const costs = calculateTotalCost(claimCount, compoundCount, fees);

  const netRewards = grossRewards - costs.totalCost;
  return {
    grossRewards,
    netRewardsInOcean: netRewards,
    compoundDetails,
    costs: costs,
    claimCount,
  };
};

/**
 * Determines the total cost associated with compounding a specified amount of Ocean tokens.
 * This cost includes fees for claims, updating the locked amount, locking, and withdrawing.
 * Outputs the detailed cost breakdown for the given number of claims and compounds.
 *
 * @param {number} claimCount - The number of claims
 * @param {number} compoundCount - The number of compounds
 * @param {object} fees - The fees object
 * @returns {Object} - The total cost
 * @property {number} totalCost - The total cost
 * @property {number} claimCount - The number of claims
 * @property {number} claimFees - The claim fees
 * @property {number} updateFees - The update fees
 * @property {number} lockFee - The lock fee
 * @property {number} withdrawFee - The withdraw fee
 */
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

/**
 * Computes the Annual Percentage Yield (APY) based on the principal amount of
 * Ocean tokens and the total rewards earned. Returns the APY as a percentage.
 *
 * @param {number} principal - The amount of Ocean tokens locked in the contract
 * @param {number} totalRewards - The total rewards
 * @returns {number} - The APY
 */
const calculateAPY = (principal, totalRewards) => {
  if (principal === 0) return 0;
  return (totalRewards / principal) * 100;
};

/**
 * Determines the rewards accrued over a specific period for a given amount of Ocean tokens.
 * The period is defined by start and end dates, which should be Thursdays.
 * Takes into account the current principal, total veOCEAN supply, and fees.
 * Outputs the reward for the period and the total number of claims made.
 *
 * @param {string} periodStartDate - The start date of the period, should be a Thursday and in the format YYYY-MM-DD
 * @param {string} periodEndDate - The end date of the period, should be a Thursday and in the format YYYY-MM-DD
 * @param {string} formUnlockDate - The unlock date of the tokens, should be a Thursday and in the format YYYY-MM-DD
 * @param {number} periodMS - The time delta in milliseconds
 * @param {number} currentPrincipal - The current principal
 * @param {number} tempTotalSupply - The total supply of veOCEAN tokens
 * @param {object} fees - The fees object
 * @returns {Object} - The rewards for the period
 * @property {number} periodReward - The reward for the period
 * @property {number} totalPeriodClaims - The total claims for the period
 */
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

  const rewardsData = await getPeriodRewardData(args);

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

/**
 * Estimates the number of claims that can be made within a specified time delta,
 * measured in milliseconds. The function calculates the number of weeks in the
 * time delta and determines the corresponding number of claims.
 *
 * @param {number} msDelta - The time delta in milliseconds
 * @returns {number} - The number of claims
 */
export const calculatePeriodClaimsWithMS = (msDelta) => {
  const oneWeekInMs = 604800000;
  const numberOfWeeks = Math.ceil(msDelta / oneWeekInMs);
  const numberOfClaims = Math.floor(numberOfWeeks / 52);
  return numberOfClaims;
};

/**
 * Computes the total fees incurred during a specific period, based on the time
 * delta in milliseconds and the provided fee structure. Outputs detailed
 * fee information, including fees for claims, updating the locked amount,
 * and the total fee for the period.
 *
 * @param {object} fees - The fees object
 * @param {number} periodMsDelta - The time delta in milliseconds
 * @returns {Object} - The fees for the period
 * @property {number} totalFeeForPeriod - The total fee for the period
 * @property {number} feeForClaims - The fee for the claims
 * @property {number} feeUpdateAmount - The fee for updating the locked amount
 * @property {number} mandatoryClaimCount - The mandatory claim count
 * @property {number} totalPeriodClaims - The total claims for the period
 *
 */
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

/**
 * Generates a list of dates for compounding events, based on a given
 * unlock date and the number of compounding instances. Ensures all calculated
 * dates are Thursdays. The dates are used to schedule the compounding events for Ocean tokens.
 *
 * @param {string} unlockDate - The unlock date of the tokens, should be a Thursday and in the format YYYY-MM-DD
 * @param {number} compoundCount - The number of compounds
 * @returns {Array<string>} - The compound dates, all elements are Thursday and in the format YYYY-MM-DD
 */
const calculateCompoundAndStartDates = (unlockDate, compoundCount) => {
  console.log('unlockDate',unlockDate)
  const compoundDates = [];
  const msDelta = Math.abs(moment().diff(unlockDate));
  const periodMsDelta = msDelta / compoundCount;
  let currentDate = moment();
  for (let i = 0; i < compoundCount; i++) {
    let tempEndDate = currentDate.add(periodMsDelta, "ms");
    let tempCompoundDate = moment(tempEndDate.format("YYYY-MM-DD"), "YYYY-MM-DD");

    if (!isThursday(tempCompoundDate)) {
      tempCompoundDate = moment(getThursdayDate(tempCompoundDate));
    }
    currentDate = tempEndDate;
    compoundDates.push(tempCompoundDate.format("YYYY-MM-DD"));
  }

  compoundDates.unshift(moment(getThursdayDate(moment())).format("YYYY-MM-DD"));

  return compoundDates;
};

/**
 * Retrieves and calculates reward data for Ocean tokens over a specified period,
 * defined by start and end dates. Considers the amount of locked Ocean tokens, total veOCEAN supply,
 * and the unlock date. Outputs key metrics such as APY, yield,
 * the number of weeks in the period, and total rewards.
 *
 * @typedef {Object} getPeriodRewardDataArgs - The arguments object
 * @property {number} lockedOcean - The amount of Ocean tokens locked in the contract
 * @property {number} veOceanSupply - The total supply of veOCEAN tokens
 * @property {string} unlockDate - The unlock date of the tokens, should be a Thursday and in the format YYYY-MM-DD
 * @property {string} currentDate - The current date, should be a Thursday and in the format YYYY-MM-DD
 * @property {string} periodEndDate - The end date of the period, should be a Thursday and in the format YYYY-MM-DD
 *
 * @param {getPeriodRewardDataArgs} args - The arguments object
 *
 * @returns {Object} - The reward data for the period
 * @property {number} apy - The APY
 * @property {number} yield - The yield
 * @property {number} weeks - The number of weeks
 * @property {number} rewards - The rewards
 */
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
