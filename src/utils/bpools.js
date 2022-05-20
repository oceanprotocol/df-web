import {getRpcUrlByChainId} from "./web3";
import {ethers} from 'ethers';
import * as BPoolABI from './BPoolABI'

export const getCurrentTokens = async (chainId, poolInfo) => {
    if (!chainId || !airdropInfo) return null;
    try {
        const contract = getPoolContract(chainId, poolInfo.pool_adr);
        if( contract ) {
            const currentTokens = await contract.getCurrentTokens();

            console.log("Current tokens are: ", currentTokens);
            return currentTokens;
        }
    } catch (err) {
        console.error(err);
    }
}

export const getFinalTokens = async (chainId, poolInfo) => {
    if (!chainId || !airdropInfo) return null;
    try {
        const contract = getPoolContract(chainId, poolInfo.pool_adr);
        if( contract ) {
            const finalTokens = await contract.getFinalTokens();

            console.log("Final tokens are: ", finalTokens);
            return finalTokens;
        }
    } catch (err) {
        console.error(err);
    }
}

export const calcPoolOutSingleIn = async (chainId, poolInfo, amountIn) => {
    if (!chainId || !airdropInfo) return null;
    try {
        const contract = getPoolContract(chainId, poolInfo.pool_adr);
        if( contract ) {
            const poolOut = await contract.calcPoolOutSingleIn(poolInfo.tokens, amountIn);

            console.log("Total BPT out from singleIn : ", poolOut);
            return poolOut;
        }
    } catch (err) {
        console.error(err);
    }
}
