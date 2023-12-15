import { getThursdayDate, isThursday } from "./functions";

import { getEpoch } from "./epochs";
import { convertWPRtoAPY, getMaxDate } from "./rewards";
import moment from "moment";


/**
 * Calculates the optimal number of compounding events and the corresponding
 * Annual Percentage Yield (APY) for a specific amount of Ocean tokens,
 * considering the locked amount, unlock date, fees, and total veOCEAN supply.
 * Returns details of the optimal compounding strategy, including the highest net return in Ocean tokens.
 *
 * @param {number} lockedOceanAmount - The amount of Ocean tokens locked in the contract
 * @param {number} amountToLock - The amount of Ocean tokens to be locked
 * @param {string} unlockDate - The unlock date of the tokens
 * @param {object} fees - The fees object
 * @param {number} totalVeOceanSupply - The total supply of veOCEAN tokens
 * @param {number} oceanTokenPrice - OCEAN token price in usdt
 * @returns {Object} - The optimal compound count and APY
 */
export const calculateOptimalCompoundInterestWithFees = async ({
  lockedOceanAmount,
  amountToLock,
  unlockDate,
  fees,
  totalVeOceanSupply,
  compounds,
  oceanTokenPrice
}) => {
  const msDelta = getTotalMSDelta(unlockDate);
  let highestNetReturn = 0 - (fees.lock + totalMandatoryClaimCount(msDelta) * fees.claim + fees.withdraw);
  let optimalCompoundDetails = [];

  let hasReachedMaxReturn = false;
  const principalAmount = amountToLock + parseFloat(lockedOceanAmount);

  let currentCompoundDetails;
  let totalWeeksInLock = Math.ceil(msDelta / 604800000)
  let optimalCompoundCount = compounds ? compounds : 0
  let rewardsWithFees = 0

  let lowerBound = 0; // Initial lower bound for compound count
  let upperBound = 1000; // Initial upper bound for compound count (adjust as needed)

  if(compounds!==undefined){
    currentCompoundDetails = await calculateCompoundDetails({
      principal: principalAmount,
      totalSupply: totalVeOceanSupply,
      fees: fees,
      msDelta,
      compoundCount: optimalCompoundCount,
      tokenPrice: oceanTokenPrice,
      unlockDate,
    });
    const { netRewardsInOcean, grossRewards } = currentCompoundDetails;
    rewardsWithFees = grossRewards
    optimalCompoundCount = compounds
    highestNetReturn = netRewardsInOcean;
    optimalCompoundDetails = currentCompoundDetails;
  }else if(principalAmount<=100000){
    while (!hasReachedMaxReturn) {
      currentCompoundDetails = await calculateCompoundDetails({
        principal: principalAmount,
        totalSupply: totalVeOceanSupply,
        fees: fees,
        msDelta,
        compoundCount: optimalCompoundCount,
        tokenPrice: oceanTokenPrice,
        unlockDate,
      });
      const { netRewardsInOcean, grossRewards } = currentCompoundDetails;
      if (netRewardsInOcean > highestNetReturn) {
        highestNetReturn = netRewardsInOcean;
        rewardsWithFees = grossRewards
        optimalCompoundCount = optimalCompoundCount + 1;
        optimalCompoundDetails = currentCompoundDetails;
      } else {
        highestNetReturn = netRewardsInOcean;
        rewardsWithFees = grossRewards;
        hasReachedMaxReturn = true;
        optimalCompoundDetails = currentCompoundDetails;
        optimalCompoundCount = optimalCompoundCount
      }
    }
  }else{
    while (lowerBound <= upperBound) {
      const midCompoundCount = Math.floor((lowerBound + upperBound) / 2);
  
      const [currentCompoundDetails, upperCompoundDetails] = await Promise.all([
          calculateCompoundDetails({
            principal: principalAmount,
            totalSupply: totalVeOceanSupply,
            fees: fees,
            msDelta,
            compoundCount: midCompoundCount,
            tokenPrice: oceanTokenPrice,
            unlockDate,
          }),
          calculateCompoundDetails({
            principal: principalAmount,
            totalSupply: totalVeOceanSupply,
            fees: fees,
            msDelta,
            compoundCount: midCompoundCount + 1,
            tokenPrice: oceanTokenPrice,
            unlockDate,
          })
        ])
  
      if (currentCompoundDetails.netRewardsInOcean < upperCompoundDetails.netRewardsInOcean) {
        const optCompDetails = optimalCompoundCount >0 ? upperCompoundDetails : currentCompoundDetails
        const { netRewardsInOcean, grossRewards } = optCompDetails
        highestNetReturn = netRewardsInOcean;
        rewardsWithFees = grossRewards
        optimalCompoundCount = midCompoundCount;
        optimalCompoundDetails = optCompDetails
        lowerBound = midCompoundCount + 1;
      } else {
        // Search in the left half of the range
        upperBound = midCompoundCount - 1;
      }
      if(lowerBound > upperBound){
        const optCompDetails = optimalCompoundCount >0 ? upperCompoundDetails : currentCompoundDetails
        const { netRewardsInOcean, grossRewards } = optCompDetails
        highestNetReturn = netRewardsInOcean;
        rewardsWithFees = grossRewards
        optimalCompoundCount = midCompoundCount;
        optimalCompoundDetails = optCompDetails
      }
    }
  }

  optimalCompoundCount = compounds ? compounds : principalAmount > 100000 ? optimalCompoundCount > 0 ? optimalCompoundCount+1 : optimalCompoundCount : optimalCompoundCount
  const yyield = ((principalAmount + highestNetReturn)) / principalAmount - 1
  const wpr = yyield / totalWeeksInLock * (optimalCompoundCount>0 ? (52 / optimalCompoundCount) : 1)

  const result = {
    optimalCompounds: optimalCompoundCount,
    apy: convertWPRtoAPY(wpr, optimalCompoundCount),
    rewards: rewardsWithFees,
    rewardsWithoutFees: highestNetReturn,
    ...optimalCompoundDetails,
  };

  return result;
};

export const getTotalMSDelta = (unlockDate) => 
  moment(unlockDate).diff(getThursdayDate(moment()));

export const totalMandatoryClaimCount = (unlockDate) => {
  const duration = moment.duration(moment(unlockDate).diff(moment()));
  const claimCount = Math.round(duration.asYears());
  return claimCount
}
/**
 * Computes detailed compounding information for a specified principal amount of Ocean tokens
 * over a set number of compounding periods. Takes into account the total veOCEAN supply,
 * fees, time delta, token price, and unlock date. Returns comprehensive compound details
 * including gross rewards, net rewards in Ocean tokens, and the total cost in Ocean tokens.
 *
 * @param {Object} args - The arguments object
 * @property {number} principal - The amount of Ocean tokens locked in the contract
 * @property {number} totalSupply - The total supply of veOCEAN tokens
 * @property {object} fees - The fees object
 * @property {number} compoundCount - The number of compounds
 * @property {string} unlockDate - The unlock date of the tokens
 *
 * @returns {Object} - The compound details
 * @property {number} grossRewards - The gross rewards
 * @property {number} netRewardsInOcean - The net rewards in Ocean tokens
 * @property {object} compoundDetails - The compound details
 * @property {object} costs - The costs object
 * @property {number} claimCount - The number of claims
 */
const calculateCompoundDetails = async ({
  principal,
  totalSupply,
  fees,
  msDelta,
  compoundCount,
  unlockDate
}) => {
  let currentPrincipal = principal;
  let tempTotalSupply = totalSupply;
  let grossRewards = 0;
  let claimCount = 0;
  const compoundDetails = [];

  const compoundDates = calculateCompoundAndStartDates(
    unlockDate,
    compoundCount
  );

  for (let i = 0; i <= compoundCount; i++) {
    const periodReward = await calculateRewardForPeriod({
      periodStartDate: compoundDates[i],
      periodEndDate: compoundDates[i + 1],
      unlockDate: unlockDate,
      currentPrincipal,
      tempTotalSupply,
    });

    const periodMS = msDelta / compoundCount;

    const {totalPeriodClaims, totalFeeForPeriod} = calculateFeeForPeriod(
      fees /* duration in ms for the period */,
      periodMS
    );
  
    claimCount += totalPeriodClaims;
    tempTotalSupply += periodReward;
    currentPrincipal += periodReward;
    grossRewards += periodReward;

    compoundCount >= 0 && i <= compoundCount - 1 && compoundDetails.push({
      order: i,
      rewards: periodReward,
      fees: totalFeeForPeriod,
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
  const claimFees =  claimCount * fees.claim;
  const updateFees = compoundCount * fees.updateLockedAmount;
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
 * Determines the rewards accrued over a specific period for a given amount of Ocean tokens.
 * The period is defined by start and end dates, which should be Thursdays.
 * Takes into account the current principal, total veOCEAN supply, and fees.
 * Outputs the reward for the period and the total number of claims made.
 *
 * @param {string} periodStartDate - The start date of the period, should be a Thursday and in the format YYYY-MM-DD
 * @param {string} periodEndDate - The end date of the period, should be a Thursday and in the format YYYY-MM-DD
 * @param {string} unlockDate - The unlock date of the tokens, should be a Thursday and in the format YYYY-MM-DD
 * @param {number} currentPrincipal - The current principal
 * @param {number} tempTotalSupply - The total supply of veOCEAN tokens
 * 
 * @returns {number} periodReward - The reward for the period
 */
async function calculateRewardForPeriod({
  periodStartDate,
  periodEndDate,
  unlockDate,
  currentPrincipal,
  tempTotalSupply,
}) {
  const args = {
    lockedOcean: currentPrincipal,
    veOceanSupply: tempTotalSupply,
    unlockDate: moment(unlockDate), // Assuming this is the correct interpretation
    currentDate: moment(periodStartDate),
    periodEndDate: moment(periodEndDate), // Example logic
  };

  const rewardsData = await getPeriodRewardData(args);
  const periodReward = rewardsData.rewards; // Example assignment, adjust based on actual logic

  return periodReward;
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
 * @property {number} totalPeriodClaims - The total claims for the period
 *
 */
const calculateFeeForPeriod = (fees, periodMsDelta) => {
  // Assuming 'fees' contains fee values for different actions (lock, claim, etc.)
  // and 'unlockDate' is the moment object of the unlock date
  const totalPeriodClaims = 1; // Adding 1 to include the claim at the end of the period
  const feeForClaims = fees.claim;
  const feeUpdateAmount = fees.updateLockedAmount;
  const totalFeeForPeriod = feeForClaims + feeUpdateAmount; // Summing up fees for lock and claims

  return {
    totalFeeForPeriod,
    feeForClaims,
    feeUpdateAmount,
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
  const compoundDates = [];
  const msDelta = Math.abs(moment().diff(unlockDate));
  const periodMsDelta = msDelta / (compoundCount + 1);

  let currentDate = moment();
  for (let i = 0; i <= compoundCount; i++) {
    let tempEndDate = currentDate.add(periodMsDelta, "ms");

    let tempCompoundDate = moment(
      tempEndDate.format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    );

    if (!isThursday(tempCompoundDate)) {
      tempCompoundDate = moment(getThursdayDate(tempCompoundDate));
    }
    currentDate = moment(tempEndDate);
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
  let tempCurrentDate = moment(currentDate);
  if (!isThursday(currentDate) || !isThursday(periodEndDate)) {
    throw new Error("Invalid date format. Only Thursdays are supported.");
  }

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
