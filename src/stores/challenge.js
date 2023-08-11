import { writable } from "svelte/store";
import { getChallengeRewards } from "../utils/rewards";

export let dataChallenges = writable(undefined);
export let userSubmittedChallenges = writable([]);

export async function loadDFChallengeResults() {
  try {
    let results = [];
    let rewards = await getChallengeRewards();

    rewards.forEach((r) => {
      if (!results[r.round]) results[r.round] = [];
      results[r.round].push(r);
    });

    results.forEach((round, index) => {
      round.sort((a, b) => (a.OCEAN_amt < b.OCEAN_amt ? 1 : -1));
      results[index] = [
        index,
        round[0].OCEAN_amt,
        round[0].winner_addr,
        parseFloat(round[0].nmse).toFixed(10),
        round[1].OCEAN_amt,
        round[1].winner_addr,
        parseFloat(round[1].nmse).toFixed(10),
        round[2].OCEAN_amt,
        round[2].winner_addr,
        parseFloat(round[2].nmse).toFixed(10),
      ];
    });
    console.log(results)
    dataChallenges.set(results);
  } catch (error) {
    console.log("loadDataChallenges error:", error);
    dataChallenges.set([]);
  }
}

export const getUserSubmittedChallenges = async (userAddress) => {
  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BACKEND_API}/challenge/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userAddress
          ? {
              round: {
                $gt: 47,
              },
              from_addr: userAddress.toLowerCase(),
            }
          : {
              round: {
                $gt: 47,
              },
            },
        fields: ["from_addr", "nft_addr", "nmse", "round"],
      }),
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  let data = await res.json();
  return data;
};
