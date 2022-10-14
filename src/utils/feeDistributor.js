import {ethers} from "ethers";
import * as feeDistributorABI from "./abis/feeDistributorABI";
import {getAddressByChainIdKey} from "../utils/address/address";

export const getTimeCursor = async(userAddress, provider) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      feeDistributorABI.default, 
      provider
    );
    const weekCursor = await contract.time_cursor_of(userAddress);
    return parseInt(BigInt(weekCursor));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getUserEpoch = async(userAddress, provider) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      feeDistributorABI.default, 
      provider
    );
    const userEpoch = await contract.user_epoch_of(userAddress);
    return parseInt(BigInt(userEpoch));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getLastTokenTime = async(provider) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veFeeDistributor"),
      feeDistributorABI.default, 
      provider
    );
    const calcGasLimit = await contract.estimateGas.last_token_time()
    const lastTokenTime = await contract.last_token_time({gasLimit: calcGasLimit + 1});
    return parseInt(BigInt(lastTokenTime));
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function claim(userAddress, signer) {
  try {
    // ABI function is overriden, specify which fn to use to avoid crashing
    const contract = new ethers.Contract(
          getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veFeeDistributor"),
          ["function claim(address _addr) returns (uint 256)"],
          signer
      );
      const resp = await contract.claim(userAddress);
      await resp.wait();
      console.log("Success claiming rewards, txReceipt here", resp);
  }catch (error) {
      console.log("Error claiming rewards :", error);
      throw error;
  }
}