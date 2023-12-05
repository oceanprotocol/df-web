import { getEpoch } from "./epochs";
import { getMaxDate } from "./rewards";
import { getThursdayDate } from "./functions";
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
  let optimalCompounds = 1;
  let currentCompoundCount = 1;
  let highestNetReturn = 0;
  const principal = formAmount + lockedOceanAmount;
  let optimalCompoundDetails = [];

  const oceanTokenPrice = await getTokenPriceFromCoingecko(
    "ocean-protocol",
    "usd"
  );

  let reachedHighestNetReturn = false;
  let lastCompoundDetails = null;
  let currentDate = moment();
  let totalCostInOcean = 0;
  let totalCost = 0;
  let claimCount = 0;

  while (!reachedHighestNetReturn) {
    let grossRewards = 0;
    let currentPrincipal = principal;
    let tempTotalSupply = totalVeOceanSupply;
    const compoundDetails = [];
    const compoundDates = calculateCompoundDates(
      formUnlockDate,
      currentCompoundCount
    );
    claimCount = 0;

    for (let i = 0; i < currentCompoundCount; i++) {
      const periodMS = msDelta / currentCompoundCount;

      const periodStartDate = i === 0 ? currentDate : compoundDates[i - 1];

      const rewardsData = await getPeriodRewardData({
        lockedOcean: currentPrincipal,
        veOceanSupply: tempTotalSupply,
        unlockDate: moment(formUnlockDate),
        currentDate: periodStartDate,
        periodEndDate: compoundDates[i],
      });

      const periodReward = rewardsData.rewards;
      const { totalPeriodClaims } = calculateFeeForPeriod(fees, periodMS);

      claimCount += totalPeriodClaims;
      const rawPeriodReward = periodReward;

      /*
      if (i === 0) {
        periodReward -= fees.lock;
        if (currentCompoundCount > 1) {
          periodReward -= totalPeriodClaims;
        }
      }

      if (i === currentCompoundCount - 1) {
        periodReward -= totalPeriodClaims;
        periodReward -= fees.withdraw;
      }

      if (i > 0 && i < currentCompoundCount - 1) {
        periodReward -= totalFeeForPeriod;
      }*/

      tempTotalSupply += periodReward;

      const stepPrincipal = currentPrincipal;
      currentPrincipal += periodReward;
      grossRewards += periodReward;

      compoundDetails.push({
        order: i,
        //        lockFee: i === 0 ? fees.lock : 0,
        //        withdrawFee: i === currentCompoundCount - 1 ? fees.withdraw : 0,
        //        claimsFee: feeForClaims,
        rawPeriodReward,
        periodReward,
        //        totalFeeForPeriod,
        //        feeUpdateAmount: i === 0 ? feeUpdateAmount : 0,
        tempTotalSupply,
        stepPrincipal,
        nextPrincipal: currentPrincipal,
        grossRewards,
        //        mandatoryClaimCount,
        totalPeriodClaims,
      });
    }

    totalCost =
      claimCount * fees.claim +
      (currentCompoundCount - 1) * fees.updateLockedAmount +
      fees.lock +
      fees.withdraw;

    totalCostInOcean = totalCost / oceanTokenPrice;

    const netRewards = grossRewards - totalCostInOcean;
    if (netRewards > highestNetReturn) {
      highestNetReturn = netRewards;
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
    totalCostInOcean,
    totalCost,
    claimCount,
    fees,
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

const calculateCompoundDates = (unlockDate, compoundCount) => {
  const compoundDates = [];
  const msDelta = moment(unlockDate).diff(moment());
  const periodMsDelta = msDelta / compoundCount;
  let currentDate = moment();
  for (let i = 0; i < compoundCount; i++) {
    currentDate = moment(getThursdayDate(currentDate.add(periodMsDelta, "ms")));
    compoundDates.push(currentDate.format("YYYY-MM-DD"));
  }
  return compoundDates;
};

export const getPeriodRewardData = async ({
  lockedOcean,
  veOceanSupply,
  unlockDate,
  currentDate,
  periodEndDate,
}) => {
  let tempCurrentDate = moment(
    getThursdayDate(moment(currentDate)),
    "YYYY-MM-DD"
  );
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
