import { ethers } from "ethers";
import { getJsonRpcProvider, getRpcUrlByChainId, getFairGasPrice, GASLIMIT_DEFAULT } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";
import Decimal from 'decimal.js';
import {networkSigner} from '../stores/web3'
import {BPapprove} from './tokens'
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

const allowance = async (
    datatokenAdress,
    owner,
    spender
) => {
  const datatoken = new ethers.Contract(tokenABI, datatokenAdress, {
    from: spender
  });

  const trxReceipt = await datatoken.methods.allowance(owner, spender).call()
  return ethers.utils.fromWei(trxReceipt)
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
  let result = null
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
      result = await pool
          .joinswapExternAmountIn(
              ethers.utils.parseEther(tokenAmountIn.toString()),
              ethers.utils.parseEther(minPoolAmountOut.toString())
          )
  } catch (e) {
      console.log(`ERROR: Failed to pay tokens in order to join the pool: ${e}`)
  }
  return result
}

const getReserve = async (poolAddress, datatokenAddress, signer) => {
  let amount = null
  try {
      const pool = new ethers.Contract(poolAddress, bpoolABI, signer);
      const result = await pool.getBalance(datatokenAddress);
      amount = ethers.utils.formatEther(result);
      console.log(amount)
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
  const txid = await BPapprove(
      account,
      datatokenAddress,
      poolAddress,
      amount,
      signer
  )
  if (!txid) {
      console.log('ERROR: Failed to call approve DT token')
      throw new Error('ERROR: Failed to call approve DT token')
  }

  console.log("resulting txid: ", txid);
  const result = await joinswapExternAmountIn(
      account,
      poolAddress,
      datatokenAddress,
      amount,
      '0',
      signer
  )
  return result
}

