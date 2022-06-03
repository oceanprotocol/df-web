import { ethers } from "ethers";
import { getJsonRpcProvider, getRpcUrlByChainId, getFairGasPrice, GASLIMIT_DEFAULT } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";

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
  const datatoken = new web3.eth.Contract(tokenABI, datatokenAdress, {
    from: spender
  });

  const trxReceipt = await datatoken.methods.allowance(owner, spender).call()
  return web3.utils.fromWei(trxReceipt)
}

// From ocean.js
export const approve = async (
    account,
    datatokenAddress,
    spender,
    amount,
    force = false
) => {
  const datatoken = new web3.eth.Contract(tokenABI, datatokenAddress, {
    from: account
  });

  if (!force) {
    const currentAllowence = await allowance(datatokenAddress, account, spender)
    if (
        new Decimal(web3.utils.toWei(currentAllowence)).greaterThanOrEqualTo(amount)
    ) {
      return currentAllowence
    }
  }
  let result = null
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
    estGas = await datatoken.methods
        .approve(spender, amount)
        .estimateGas({ from: account }, (err, estGas) => (err ? gasLimitDefault : estGas))
  } catch (e) {
    estGas = gasLimitDefault
  }

  try {
    result = await datatoken.methods.approve(spender, amount).send({
      from: account,
      gas: estGas + 1,
      gasPrice: await getFairGasPrice()
    })
  } catch (e) {
    console.log(`ERRPR: Failed to approve spender to spend tokens : ${e.message}`)
  }
  return result
}





const joinswapExternAmountIn = async (
  account,
  poolAddress,
  tokenIn,
  tokenAmountIn,
  minPoolAmountOut
) => {
  const pool = new web3.eth.Contract(bpoolABI, poolAddress);
  let result = null
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
      estGas = await pool.methods
          .joinswapExternAmountIn(
              web3.utils.toWei(tokenAmountIn),
              web3.utils.toWei(minPoolAmountOut)
          )
          .estimateGas({ from: account }, (err, estGas) => (err ? gasLimitDefault : estGas))
  } catch (e) {
      estGas = gasLimitDefault
  }
  try {
      result = await pool.methods
          .joinswapExternAmountIn(
              web3.utils.toWei(tokenAmountIn),
              web3.utils.toWei(minPoolAmountOut)
          )
          .send({
              from: account,
              gas: estGas + 1,
              gasPrice: await getFairGasPrice()
          })
  } catch (e) {
      console.log(`ERROR: Failed to pay tokens in order to join the pool: ${e.message}`)
  }
  return result
}

const BPallowance = async (
  datatokenAdress,
  owner,
  spender
) => {
  const datatoken = new web3.eth.Contract(tokenABI, datatokenAdress, {
      from: spender
  });

  const trxReceipt = await datatoken.methods.allowance(owner, spender).call()
  return web3.utils.fromWei(trxReceipt)
}

const BPapprove = async (
  account,
  datatokenAddress,
  spender, //bpool is spender
  amount,
  force = false
) => {
  const datatoken = new web3.eth.Contract(tokenABI, datatokenAddress, {
      from: account
  });

  if (!force) {
      const currentAllowence = await BPallowance(datatokenAddress, account, spender)
      if (
          new Decimal(web3.utils.toWei(currentAllowence)).greaterThanOrEqualTo(amount)
      ) {
          return currentAllowence
      }
  }
  let result = null
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
      estGas = await datatoken.methods
          .approve(spender, amount)
          .estimateGas({ from: account }, (err, estGas) => (err ? gasLimitDefault : estGas))
  } catch (e) {
      estGas = gasLimitDefault
  }

  try {
      result = await datatoken.methods
          .approve(spender, amount)
          .send({
          from: account,
          gas: estGas + 1,
          gasPrice: await getFairGasPrice()
      })
  } catch (e) {
      console.log(`ERRPR: Failed to approve spender to spend tokens : ${e.message}`)
  }
  return result
}

const getReserve = async (poolAddress, datatokenAddress) => {
  let amount = null
  try {
      const pool = new web3.eth.Contract(bpoolABI, poolAddress);
      const result = await pool.methods.getBalance(datatokenAddress).call();
      amount = web3.utils.fromWei(result);
  } catch (e) {
      console.log(`ERROR: Failed to get how many tokens are in the pool: ${e.message}`)
  }
  return amount
}

const getMaxAddLiquidity = async (poolAddress, datatokenAddress) => {
  const balance = await getReserve(poolAddress, datatokenAddress);
  if (parseFloat(balance) > 0) {
      return new Decimal(balance).mul(POOL_MAX_AMOUNT_IN_LIMIT).toString()
  } else return '0'
}

export const addDTLiquidity = async (account, datatokenAddress, poolAddress, amount, signer) => {
  const maxAmount = await getMaxAddLiquidity(poolAddress, datatokenAddress);
  if (new Decimal(amount).greaterThan(maxAmount)) {
      console.log('ERROR: Too much reserve to add')
      return null
  }

  const txid = await BPapprove(
      account,
      datatokenAddress,
      poolAddress,
      web3.utils.toWei(amount)
  )
  if (!txid) {
      console.log('ERROR: Failed to call approve DT token')
      throw new Error('ERROR: Failed to call approve DT token')
  }

  const result = await joinswapExternAmountIn(
      account,
      poolAddress,
      datatokenAddress,
      amount,
      '0'
  )
  return result
}

