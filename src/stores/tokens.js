import { writable, get } from "svelte/store";
import { balanceOf } from "../utils/tokens";
import { getVeOceanBalance } from "../utils/ve";
import { ethers } from "ethers";
import { getAddressByChainIdKey } from "../utils/address/address";

export let userBalances = writable({});
export let tokenContracts = writable({});
export let oceanPrice = writable();
export let ethPrice = writable();

const updateBalanceStore = (tokenAddress, newBalance) => {
  let newUserBalances = get(userBalances);
  newUserBalances[tokenAddress] = newBalance;
  userBalances.update(() => newUserBalances);
};

export const updateUserBalanceOcean = async (userAddress) => {
  const oceanContractAddress = getAddressByChainIdKey(
    import.meta.env.VITE_VE_SUPPORTED_CHAINID,
    "Ocean"
  );

  const balanceInWei = await balanceOf(
    get(userBalances),
    oceanContractAddress,
    userAddress
  );

  const balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));

  updateBalanceStore(oceanContractAddress, balance);
};

export const updateUserBalanceVeOcean = async (userAddress) => {
  const veOceanBalance = await getVeOceanBalance(userAddress);
  updateBalanceStore(
    getAddressByChainIdKey(
      import.meta.env.VITE_VE_SUPPORTED_CHAINID,
      "veOCEAN"
    ),
    veOceanBalance
  );
};

export const getOceanBalance = (chainId) => {
  if (!chainId || !getAddressByChainIdKey(chainId, "Ocean")) return undefined;

  return get(userBalances)[getAddressByChainIdKey(chainId, "Ocean")];
};
