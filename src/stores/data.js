import { writable } from "svelte/store";
import { getNetworkDataById, userAddress } from "./web3";
import * as networksDataArray from "../networks-metadata.json";
import * as descriptions from "../utils/metadata/descriptions.json";
import { getEpoch } from "../utils/epochs";
import { getRoundsDatafarm } from "../utils/functions";

let networksData = networksDataArray.default;

export let datasets = writable("");

export const columnsData = {
  alloc: [
    { key: "network", value: "Network" },
    {
      key: "title",
      value: "Title",
      tooltip: descriptions.default.tooltip_datafarming_title,
    },
    { key: "symbol", value: "Symbol" },
    {
      key: "prev5roundavgalloc",
      value: "Prev5 Avg Alloc",
      display: (allocated) => allocated + " veOCEAN",
      tooltip: descriptions.default.tooltip_datafarming_5_round_allocation,
    },
    {
      key: "prev3roundavgalloc",
      value: "Prev3 Avg Alloc",
      display: (allocated) => allocated + " veOCEAN",
      tooltip: descriptions.default.tooltip_datafarming_3_round_allocation,
    },
    {
      key: "roundallocation",
      value: "Rnd Alloc",
      display: (allocated) => allocated + " veOCEAN",
      tooltip: descriptions.default.tooltip_datafarming_round_allocation,
    },
    {
      key: "currentallocation",
      value: "Curr Alloc",
      display: (allocated) => allocated + " veOCEAN",
      tooltip: descriptions.default.tooltip_datafarming_current_allocation,
    },
    {
      key: "myallocation",
      value: "My Allocation",
      tooltip: descriptions.default.tooltip_datafarming_my_allocation,
    },
  ],
  dcv: [
    { key: "network", value: "Network" },
    {
      key: "title",
      value: "Title",
      tooltip: descriptions.default.tooltip_datafarming_title,
    },
    { key: "symbol", value: "Symbol" },
    {
      key: "prev5roundavgdcv",
      value: "Prev5 Avg DCV",
      display: (volume) => "$" + volume,
      tooltip: descriptions.default.tooltip_datafarming_5_round_consume,
    },
    {
      key: "prev3roundavgdcv",
      value: "Prev3 Avg DCV",
      display: (volume) => "$" + volume,
      tooltip: descriptions.default.tooltip_datafarming_3_round_consume,
    },
    {
      key: "prevroundvolume",
      value: "Prev DCV",
      display: (volume) => "$" + volume,
      tooltip: descriptions.default.tooltip_datafarming_previous_round_consume,
    },
    {
      key: "roundvolume",
      value: "Curr DCV",
      display: (volume) => "$" + volume,
      tooltip: descriptions.default.tooltip_datafarming_round_consume,
    },
    {
      key: "myallocation",
      value: "My Allocation",
      tooltip: descriptions.default.tooltip_datafarming_my_allocation,
    },
  ],
  apy: [
    { key: "network", value: "Network" },
    {
      key: "title",
      value: "Title",
      tooltip: descriptions.default.tooltip_datafarming_title,
    },
    { key: "symbol", value: "Symbol" },
    {
      key: "prev5roundavgapy",
      value: "Prev5 Avg APY",
      display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + "%",
      tooltip: descriptions.default.tooltip_datafarming_5_round_asset_APY,
    },
    {
      key: "prev3roundavgapy",
      value: "Prev3 Avg APY",
      display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + "%",
      tooltip: descriptions.default.tooltip_datafarming_3_round_asset_APY,
    },
    {
      key: "prevroundapy",
      value: "Prev APY",
      display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + "%",
      tooltip: descriptions.default.tooltip_datafarming_previous_round_asset_APY,
    },
    {
      key: "roundapr",
      value: "Curr APR",
      display: (roundAPR) =>
        parseFloat(roundAPR ? roundAPR * 100 : 0).toFixed(2) + "%",
      tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APR,
    },
    {
      key: "roundapy",
      value: "Curr APY",
      display: (apy) => parseFloat(apy ? apy * 100 : 0).toFixed(2) + "%",
      tooltip: descriptions.default.tooltip_datafarming_current_round_asset_APY,
    },
    {
      key: "roundyield",
      value: "Curr Yield",
      display: (roundYield) =>
        parseFloat(roundYield ? roundYield * 100 : 0).toFixed(2) + "%",
      tooltip:
        descriptions.default.tooltip_datafarming_current_round_asset_yield,
    },
    {
      key: "myallocation",
      value: "My Allocation",
      tooltip: descriptions.default.tooltip_datafarming_my_allocation,
    },
  ],
};

export const defaultColumns = {
  alloc: [
    "Title",
    "Prev5 Avg Alloc",
    "Prev3 Avg Alloc",
    "Rnd Alloc",
    "Curr Alloc",
    "My Allocation",
  ],
  dcv: [
    "Title",
    "Prev10 Avg DCV",
    "Prev5 Avg DCV",
    "Prev3 Avg DCV",
    "Prev DCV",
    "Curr DCV",
    "My Allocation",
  ],
  apy: [
    "Title",
    "Prev5 Avg APY",
    "Prev3 Avg APY",
    "Prev Rnd APY",
    "Curr APY",
    "Curr Yield",
    "My Allocation",
  ],
};

async function getDatasetsAvgs3Rounds(api, roundNumber) {
  let res;
  try {
    res = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          round: {
            $in: getRoundsDatafarm(roundNumber, 3),
          },
        },
        fields: [
          "nft_addr",
          {
            expression: {
              pattern: "avg(ve_allocated)",
            },
            alias: "3_round_avg_alloc",
          },
          {
            expression: {
              pattern: "avg(volume)",
            },
            alias: "3_round_avg_dcv",
          },
          {
            expression: {
              pattern: "avg(apy)",
            },
            alias: "3_round_avg_apy",
          },
        ],
        group: ["nft_addr"],
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

async function getDatasetsAvgs5Rounds(api, roundNumber) {
  let res;
  try {
    res = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          round: {
            $in: getRoundsDatafarm(roundNumber, 5),
          },
        },
        fields: [
          "nft_addr",
          {
            expression: {
              pattern: "avg(ve_allocated)",
            },
            alias: "5_round_avg_alloc",
          },
          {
            expression: {
              pattern: "avg(volume)",
            },
            alias: "5_round_avg_dcv",
          },
          {
            expression: {
              pattern: "avg(apy)",
            },
            alias: "5_round_avg_apy",
          },
        ],
        group: ["nft_addr"],
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

async function getDatasets(api, roundNumber) {
  let res;
  try {
    res = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          round: roundNumber,
        },
        sort: {
          volume: -1,
        },
      }),
    });
  } catch (error) {
    console.log(error);
    return [];
  }
  let data = await res.json();
  return data;
}

function getRow(dataInfo, key) {
  let userId;
  userAddress.subscribe((id) => (userId = id));
  const isowner = userId.toLowerCase() === dataInfo.owner_addr;

  return {
    id: key,
    title: dataInfo.name,
    network: getNetworkDataById(networksData, parseInt(dataInfo.chainID))?.name,
    symbol: dataInfo.symbol,
    owner: dataInfo.owner_addr,
    prevroundapy: dataInfo.prevRoundAPY,
    prevroundapr: dataInfo.prevRoundAPR,
    prevroundyield: dataInfo.prevRoundYield,
    roundapy: dataInfo.apy,
    roundapr: dataInfo.apr,
    roundyield: dataInfo.roundYield,
    prev3roundavgapy: dataInfo.prev3roundavgapy,
    prev5roundavgapy: dataInfo.prev5roundavgapy,
    prev3roundavgdcv: parseFloat(dataInfo.prev3roundavgdcv).toFixed(3),
    prev5roundavgdcv: parseFloat(dataInfo.prev5roundavgdcv).toFixed(3),
    prev3roundavgalloc: parseFloat(dataInfo.prev3roundavgalloc).toFixed(3),
    prev5roundavgalloc: parseFloat(dataInfo.prev5roundavgalloc).toFixed(3),
    nftaddress: dataInfo.nft_addr,
    ispurgatory: dataInfo.is_purgatory,
    did: dataInfo.did,
    chainId: dataInfo.chainID,
    currentallocation: parseFloat(dataInfo.ve_allocated_realtime).toFixed(3),
    roundallocation: parseFloat(dataInfo.ve_allocated).toFixed(3),
    myallocation: dataInfo.allocation,
    allocated: dataInfo.allocation,
    roundvolume: parseFloat(dataInfo.volume).toFixed(3),
    ownerallocation: parseFloat(dataInfo.ve_allocated_realtime_owner).toFixed(
      3
    ),
    myveocean: dataInfo.allocation,
    prevroundvolume: parseFloat(dataInfo.prevRoundVolume).toFixed(3),
    action: dataInfo.chainID != 23294 ? `https://market.oceanprotocol.com/asset/${dataInfo.did}` : 'https://predictoor.ai',
    publishersreward:
      dataInfo.ownerallocation > 0 || (isowner && dataInfo.allocation > 0),
  };
}

function filterPurgatoryDatasetsWithoutAllocations(datasets, allocations) {
  let purgatoryDatasets = datasets.filter((d) => d.is_purgatory === 1);
  let purgatoryDatasetsWithAllocations = [];
  allocations.forEach((a) => {
    purgatoryDatasets.forEach((d) => {
      if (a.nftAddress === d.nft_addr) purgatoryDatasetsWithAllocations.push(d);
    });
  });
  return purgatoryDatasetsWithAllocations;
}

export async function loadDatasets(nftsApi, allocations) {
  let curRound = getEpoch().id;
  //current round number is 0
  let [currentRoundDatasets, prevRoundDatasets, avgs3Rounds, avgs5Rounds] =
    await Promise.all([
      getDatasets(nftsApi, 0),
      getDatasets(nftsApi, curRound - 1),
      getDatasetsAvgs3Rounds(nftsApi, curRound),
      getDatasetsAvgs5Rounds(nftsApi, curRound),
    ]);

  let purgatoryDatasetsWithAllocation =
    filterPurgatoryDatasetsWithoutAllocations(
      currentRoundDatasets,
      allocations
    );
  currentRoundDatasets = currentRoundDatasets.filter(
    (d) => d.is_purgatory === 0
  );
  currentRoundDatasets =
    purgatoryDatasetsWithAllocation.concat(currentRoundDatasets);

  if (currentRoundDatasets.length === 0) {
    datasets.set([]);
    return;
  }
  let newDatasets = [];
  currentRoundDatasets.forEach((datasetInfo, key) => {
    datasetInfo.allocation =
      allocations.find(
        (allocation) => allocation.nftAddress === datasetInfo.nft_addr
      )?.allocated / 100 || 0;

    const prevRoundDataset = prevRoundDatasets.find(
      (ld) => ld.nft_addr === datasetInfo.nft_addr
    );
    datasetInfo.prevRoundAPY = prevRoundDataset?.apy;
    datasetInfo.prevRoundAPR = prevRoundDataset?.apr;
    datasetInfo.prevRoundYield = prevRoundDataset?.roundYield;
    datasetInfo.prevRoundVolume = prevRoundDataset?.volume;

    datasetInfo.prevRoundVolume =
      datasetInfo.prevRoundVolume > 0 ? datasetInfo.prevRoundVolume : 0.0;

    const avg3Round = avgs3Rounds.find(
      (ld) => ld.nft_addr === datasetInfo.nft_addr
    );
    const avg5Round = avgs5Rounds.find(
      (ld) => ld.nft_addr === datasetInfo.nft_addr
    );

    datasetInfo.prev3roundavgalloc = avg3Round?.["3_round_avg_alloc"] || 0;
    datasetInfo.prev3roundavgdcv = avg3Round?.["3_round_avg_dcv"] || 0;
    datasetInfo.prev3roundavgapy = avg3Round?.["3_round_avg_apy"] || 0;

    datasetInfo.prev5roundavgalloc = avg5Round?.["5_round_avg_alloc"] || 0;
    datasetInfo.prev5roundavgdcv = avg5Round?.["5_round_avg_dcv"] || 0;
    datasetInfo.prev5roundavgapy = avg5Round?.["5_round_avg_apy"] || 0;

    newDatasets.push(getRow(datasetInfo, key));
  });
  datasets.set(newDatasets);
}
