import { ethers } from "ethers";
import { web3, getJsonRpcProvider, getRpcUrlByChainId, getFairGasPrice, GASLIMIT_DEFAULT } from "./web3";
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

// OLD - TODO - Reconcile if needed
// export const joinSwapExternAmountIn = async (chainId, poolInfo, amountIn, minPoolAmountOut, userAddress, signer) => {
//   if (!chainId || !poolInfo) return null;
//   console.log(chainId, poolInfo, amountIn, minPoolAmountOut, signer)
//   try {
//     const contract = new ethers.Contract(
//         poolInfo.poolAddress,
//         BPoolABI.default,
//         signer
//     );
//
//     if( contract ) {
//       const gasLimitDefault = GASLIMIT_DEFAULT;
//       let result;
//       await contract
//         .estimateGas
//         .joinswapExternAmountIn(ethers.utils.parseEther(amountIn.toString()), ethers.utils.parseEther(minPoolAmountOut.toString()))
//         .then(res => {
//           result = res;
//       });
//       console.log("Estimated gas results is: ", result);
//     }
//
//     return contract
//         .joinswapExternAmountIn(ethers.utils.parseEther(amountIn.toString()), ethers.utils.parseEther(minPoolAmountOut.toString()))
//         .send({
//           from: userAddress,
//           gas: estGas + 1,
//           gasPrice: await getFairGasPrice(chainId)
//         });
//   } catch (err) {
//     console.error(err);
//   }
// }

// From ocean.js
export const getReserve = async (poolAddress, tokenAddress) => {
  let amount = null
  try {
    const pool = new web3.eth.Contract(bpoolABI, poolAddress);
    const result = await pool.methods.getBalance(tokenAddress).call();
    amount = web3.utils.fromWei(result);
  } catch (e) {
    this.logger.error(`ERROR: Failed to get how many tokens \
      are in the pool: ${e.message}`)
  }
  return amount
}

// From ocean.js
export const getMaxAddLiquidity = async (poolAddress, tokenAddress) => {
  const balance = await getReserve(poolAddress, tokenAddress);
  if (parseFloat(balance) > 0) {
    return new Decimal(balance).mul(POOL_MAX_AMOUNT_IN_LIMIT).toString()
  } else return '0'
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

// From ocean.js
export const joinswapExternAmountIn = async (
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
            tokenIn,
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
            tokenIn,
            web3.utils.toWei(tokenAmountIn),
            web3.utils.toWei(minPoolAmountOut)
        )
        .send({
          from: account,
          gas: estGas + 1,
          gasPrice: await getFairGasPrice()
        })
  } catch (e) {
    this.logger.error(`ERROR: Failed to pay tokens in order to \
      join the pool: ${e.message}`)
  }
  return result
}

// From ocean.js
export const addDTLiquidity = async (account, datatokenAddress, poolAddress, amount) => {
  const maxAmount = await getMaxAddLiquidity(poolAddress, datatokenAddress);
  if (new Decimal(amount).greaterThan(maxAmount)) {
    console.log('ERROR: Too much reserve to add')
    return null
  }

  const txid = await approve(
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

