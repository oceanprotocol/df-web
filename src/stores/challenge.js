import { writable } from "svelte/store";
import { getChallengeRewards } from "../utils/rewards";

export let dataChallenges = writable([]);

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
        round[1].OCEAN_amt,
        round[1].winner_addr,
        round[2].OCEAN_amt,
        round[2].winner_addr,
      ];
    });

    dataChallenges.set(results);
  } catch (error) {
    console.log("loadDataChallenges error:", error);
    dataChallenges.set([
      [4, "2500", "0x0abca", "1500", "0x0abcb", "1000", "0x0abc"],
      [3, "2500", "0x0abca", "1500", "0x0abcb", "1000", "0x0abc"],
      [2, "2500", "0x0abca", "1500", "0x0abcb", "1000", "0x0abc"],
      [1, "2500", "0x0abca", "1500", "0x0abcb", "1000", "0x0abc"],
    ]);
  }
}
