import { writable, get } from "svelte/store";
import {balanceOf} from "../utils/tokens"
import {getVeOceanBalance} from "../utils/ve"
import {ethers} from "ethers"
import {getAddressByChainIdKey} from "../utils/address/address";

export let userBalances = writable({});
export let tokenContracts = writable({});

const updateBalanceStore = (tokenAddress, newBalance) => {
  let newUserBalances = get(userBalances);
    newUserBalances[tokenAddress] = newBalance;
    userBalances.update(() => newUserBalances);
}

export const updateUserBalanceOcean = async (userAddress, provider) => {
  const oceanContractAddress = getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "Ocean");

  const balanceInWei = await balanceOf(
    get(userBalances),
    process.env.VE_SUPPORTED_CHAINID,
    oceanContractAddress,
    userAddress,
    provider,
  );

  const balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
  console.log("chainId", process.env.VE_SUPPORTED_CHAINID);
  console.log("OCEAN address", oceanContractAddress);
  console.log("User address", userAddress);
  console.log("User account OCEAN balance is", balance);

  updateBalanceStore(
    oceanContractAddress, 
    balance
  );
}

export const updateUserBalanceVeOcean = async (userAddress, provider) => {
  const veOceanBalance = await getVeOceanBalance(userAddress, provider)
  updateBalanceStore(
    getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"),
    veOceanBalance
  )
}

export const getOceanBalance = (chainId) => {
  console.log("getOceanBalance chainId", chainId)
  console.log("getOceanBalance userBalances", get(userBalances))
  console.log("getOceanBalance getAddressByChainIdKey", getAddressByChainIdKey(chainId, "Ocean"))
  if(!getAddressByChainIdKey(chainId, "Ocean")) return undefined
  return get(userBalances)[
    getAddressByChainIdKey(chainId, "Ocean").toLowerCase()
  ]
}
  