import { getPassiveUserRewardsData, getVotingPower } from "./rewards";

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
  while (!reachedHighestNetReturn) {
    let totalRewards = 0;
    let currentPrincipal = principal;
    let tempTotalSupply = totalVeOceanSupply;
    const compoundDetails = [];
    for (let i = 0; i < optimalCompounds; i++) {
      const periodMS = msDelta / currentCompoundCount;

      console.log('periodMS',periodMS)
      const votingPower = getVotingPower(
        periodMS,
        getMaxDate,
        currentPrincipal
      );

      console.log('votingPower',votingPower)
      let rewardsData = await getPassiveUserRewardsData(
        votingPower,
        currentPrincipal,
        tempTotalSupply,
        1
      );

      console.log('rewardsData',rewardsData)
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
        periodReward -= fees.claim;
        periodReward -= fees.withdraw;
      }

      if (i > 0 && i < currentCompoundCount - 1) {
        periodReward -= totalFeeForPeriod;
      }

      tempTotalSupply += periodReward;
      currentPrincipal += periodReward;
      totalRewards += periodReward;

      compoundDetails.push({
        order: i,
        lock: i === 0 ? fees.lock : 0,
        withdraw: i === currentCompoundCount - 1 ? fees.withdraw : 0,
        votingPower,
        apy: rewardsData.apy,
        rawPeriodReward,
        periodReward,
        totalFeeForPeriod,
        feeForClaims,
        feeUpdateAmount: i === 0 ? feeUpdateAmount : 0,
        tempTotalSupply,
        currentPrincipal,
        totalRewards,
        mandatoryClaimCount,
        totalPeriodClaims,
      });
    }

    if (totalRewards > highestNetReturn) {
      highestNetReturn = totalRewards;
      optimalCompounds = compounds;
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
