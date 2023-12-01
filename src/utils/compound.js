import { getPassiveUserRewardsData, getVotingPower, getMsDelta } from "./rewards";

const msInWeek = 604800000

export const calculateOptimalCompoundInterestWithFees = async ({
  msDelta,
  getMaxDate,
  lockedOceanAmount,
  formAmount,
  formUnlockDate,
  fees,
  totalVeOceanSupply,
}) => {
  let optimalCompounds = 1;
  let currentCompoundCount = 1;
  let highestNetReturn = 0;
  const principal = formAmount + lockedOceanAmount;
  let optimalCompoundDetails = [];
  // Calculate the optimal number of compounds
  // the 4000 is just a random number, we will never reach it
  let reachedHighestNetReturn = false;
  let lastCompoundDetails = null;
  let currentDate = moment()
  while (!reachedHighestNetReturn) {
    let totalRewards = 0;
    let currentPrincipal = principal;
    let tempTotalSupply = totalVeOceanSupply;
    const compoundDetails = [];
    for (let i = 0; i < currentCompoundCount; i++) {
      const periodMS = msDelta / currentCompoundCount;
      console.log('weeksInPeriod', Math.floor(periodMS/msInWeek))
      const weekInPeriod = Math.floor(periodMS/msInWeek)

      const rewardsData =
      //calculate rewards for period by calculating rewards for each week
      for(let i = 0; i < currentCompoundCount; i++) {
        const currentMsDelta = getMsDelta(formUnlockDate, currentDate)

      }
      
      const votingPower = getVotingPower(
        periodMS,
        getMaxDate,
        currentPrincipal
      );

      const rewardsData = await getPassiveUserRewardsData(
        votingPower,
        currentPrincipal,
        tempTotalSupply,
        1
      );

      let periodReward = rewardsData.rewards;
      const {
        totalFeeForPeriod,
        feeForClaims,
        feeUpdateAmount,
        mandatoryClaimCount,
        totalPeriodClaims,
      } = calculateFeeForPeriod(fees, periodMS);

      const rawPeriodReward = periodReward;

      if (i === 0) {
        periodReward -= fees.lock;
      }

      if (i === currentCompoundCount - 1) {
        periodReward -= totalPeriodClaims;
        periodReward -= fees.withdraw;
      }

      if (i > 0 && i < currentCompoundCount - 1) {
        periodReward -= totalFeeForPeriod;
      }

      tempTotalSupply += periodReward;
      
      const stepPrincipal = currentPrincipal;
      currentPrincipal += periodReward;
      totalRewards += periodReward;

      compoundDetails.push({
        order: i,
        lockFee: i === 0 ? fees.lock : 0,
        withdrawFee: i === currentCompoundCount - 1 ? fees.withdraw : 0,
        claimsFee: feeForClaims,
        votingPower,
        rawPeriodReward,
        periodReward,
        totalFeeForPeriod,
        feeUpdateAmount: i === 0 ? feeUpdateAmount : 0,
        tempTotalSupply,
        stepPrincipal,
        nextPrincipal: currentPrincipal,
        totalRewards,
        mandatoryClaimCount,
        totalPeriodClaims,
      });
    }

    console.log('totalRewards',totalRewards)
    console.log('compoundDetails',compoundDetails)
    console.log('------***------')
    if (totalRewards > highestNetReturn) {
      highestNetReturn = totalRewards;
      optimalCompounds = currentCompoundCount;
      optimalCompoundDetails = compoundDetails;
      currentCompoundCount += 1;
    } else {
      reachedHighestNetReturn = true;
    }
  }

  const optimalAPY = calculateAPYBasedOnTotalRewards(
    principal,
    highestNetReturn
  );

  return {
    optimalCompounds,
    optimalAPY,
    optimalCompoundDetails,
    highestNetReturn,
  };
};

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
