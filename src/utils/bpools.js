import { ethers } from "ethers";
import { getJsonRpcProvider, GASLIMIT_DEFAULT } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";
import Decimal from 'decimal.js';
const POOL_MAX_AMOUNT_IN_LIMIT = 0.25

const bpoolABI = BPoolABI.default

// TODO - Store/Access contracts (also destroy/manage objects, i.e. svelte comp destroys)
export async function getPoolContract(chainId, address) {
  const provider = await getJsonRpcProvider(chainId);
  return new ethers.Contract(address, BPoolABI.default, provider);
}

// OLD - Not from ocean.js
export const calcPoolOutSingleIn = async (chainId, poolInfo, amountIn) => {
  if (!chainId || !poolInfo) return null;
  try {
    const contract = await getPoolContract(chainId, poolInfo.poolAddress);
    if( contract ) {
      return contract.calcPoolOutSingleIn(poolInfo.basetokenAddress, ethers.utils.parseEther(amountIn.toString()));
    }
  } catch (err) {
    console.error(err);
  }
}

const joinswapExternAmountIn = async (
  account,
  poolAddress,
  tokenIn,
  tokenAmountIn,
  minPoolAmountOut,
  signer
) => {
  const pool = new ethers.Contract(poolAddress, bpoolABI, signer);
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
      estGas = await pool
          .estimateGas
          .joinswapExternAmountIn(
              ethers.utils.parseEther(tokenAmountIn.toString()),
              ethers.utils.parseEther(minPoolAmountOut.toString())
          );
  } catch (e) {
      estGas = gasLimitDefault
  }
  try {
      // TODO - Add Price & Send() - Make sure it's completing w/ events in response
      // let gasPrice = getFairGasPrice();
      let tx = await pool
          .joinswapExternAmountIn(
              ethers.utils.parseEther(tokenAmountIn.toString()),
              ethers.utils.parseEther(minPoolAmountOut.toString())
          );
      return tx;
  } catch (e) {
      console.log(`ERROR: Failed to pay tokens in order to join the pool: ${e}`)
  }

  return null;
}

const getReserve = async (poolAddress, datatokenAddress, signer) => {
  let amount = null
  try {
      const pool = new ethers.Contract(poolAddress, bpoolABI, signer);
      const result = await pool.getBalance(datatokenAddress);
      amount = ethers.utils.formatEther(result);
  } catch (e) {
      console.log(`ERROR: Failed to get how many tokens are in the pool: ${e.message}`)
  }
  return amount
}

const getMaxAddLiquidity = async (poolAddress, datatokenAddress, signer) => {
  const balance = await getReserve(poolAddress, datatokenAddress, signer);
  if (parseFloat(balance) > 0) {
      return new Decimal(balance).mul(POOL_MAX_AMOUNT_IN_LIMIT).toString()
  } else return '0'
}

export const addDTLiquidity = async (account, datatokenAddress, poolAddress, amount, signer) => {
    const maxAmount = await getMaxAddLiquidity(poolAddress, datatokenAddress ,signer);
    if (new Decimal(amount).greaterThan(maxAmount)) {
      console.log('ERROR: Too much reserve to add')
      return null
    }
    console.log("addDTLiquidity signer: ", signer);
    console.log("addDTLiquidity amount: ", amount);

    const tx = await joinswapExternAmountIn(
      account,
      poolAddress,
      datatokenAddress,
      amount,
      '0',
      signer
    )
    return tx;
}

