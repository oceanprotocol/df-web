import { writable } from "svelte/store";
import {getRpcUrlByChainId} from "../utils/web3";
import {ethers} from "ethers";
import * as airdropABI from "../utils/abis/airdropABI";
import * as feeDistributorABI from "../utils/abis/feeDistributorABI";
import * as dfRewardsABI from "../utils/abis/DFRewardsABI";

export let contracts = writable({});
export let airdrops = writable({});
export let rewards = writable();
export let veEstimate = writable(undefined);
export let veClaimables = writable(undefined);
export let dfEstimate = writable(undefined);
export let dfClaimables = writable(undefined);

const gasLimit = 1000000;

export const getTokenAddress = (chainId, tokenName, airdropsConfig) => {
    if (!chainId || !tokenName) return null;
    try {
        if (airdropsConfig[chainId]) {
            const tokenData = Object.entries(airdropsConfig[chainId].tokensData).filter(([k, v]) => v.symbol === tokenName );
            if( !tokenData || tokenData.length === 0 ) {
                console.log("Can't find tokenName in configuration: ", tokenName);
                return null;
            }
            return tokenData[0][0];
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}

export const updateClaimablesFromAirdrop = async (airdropData, chainId, address, rewards) => {
    if (!chainId || !address) return null;
    let tokens
    try {
        const rpcURL = await getRpcUrlByChainId(chainId);
        if( rpcURL ) {
            tokens = Object.keys(airdropData[chainId].tokensData)
            const provider = new ethers.providers.InfuraProvider(rpcURL);
            const contract = new ethers.Contract(airdropData[chainId].airdropAddress, airdropABI.default, provider);
            const claimableRewards = await contract.claimables(address, tokens)
            let claimableRewardsNumber = 0
            let estimatedRewardsNumber = 0
            rewards.forEach((reward) => {
                if(reward.chainID === chainId){
                    estimatedRewardsNumber+=1
                }
            })
            airdropData[chainId]['estimatedRewards'] = estimatedRewardsNumber
            for (let tokenAddress of tokens) {
                let totalEstimatedRewardsForToken = 0
                rewards.forEach((reward) => {
                    if(reward.chainID === chainId && airdropData[chainId].tokensData[tokenAddress].symbol === reward.token){
                        totalEstimatedRewardsForToken += reward.amt
                    }
                })
                airdropData[chainId]['tokensData'][tokenAddress]['estimated amount'] =  totalEstimatedRewardsForToken===0 ? totalEstimatedRewardsForToken : totalEstimatedRewardsForToken.toFixed(6)
            }
            for (let i = 0; i < claimableRewards.length; i++) {
                const rewardInEthers = ethers.utils.formatEther(BigInt(claimableRewards[i]).toString(10))
                airdropData[chainId].tokensData[tokens[i]]['claimable amount'] = rewardInEthers > 0.0 ? (Math.round(rewardInEthers * 1000000) / 1000000).toFixed(6) : 0.0
                claimableRewardsNumber += rewardInEthers > 0.0 ? 1 : 0
                airdropData[chainId]['claimableRewards'] = claimableRewardsNumber
            }
        }
    } catch (err) {
        for (let i = 0; i < tokens.length; i++) {
            airdropData[chainId].tokensData[tokens[i]]['estimated amount'] = 0.0
            airdropData[chainId].estimatedRewards = 0
            airdropData[chainId].claimableRewards = 0
        }
    }
}

export const updateAllClaimables = async (airdropData, selectedNetworks, userAddress, rewards) => {
    await Promise.all(JSON.parse(process.env.SUPPORTED_CHAIN_IDS).map(async function(chainId) {
        if( airdropData[chainId] ) {
            await updateClaimablesFromAirdrop(airdropData, chainId, userAddress, rewards);
        } else {
            console.log("Airdrop configuration is not proprely initialized. Please check .supportedChainIds and app configuration.")
        }
    }));

    airdrops.set(airdropData);
}

export const getDFRewards = async(userAddress, tokenAddress) => {
    try {
        const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
        const provider = new ethers.providers.InfuraProvider(rpcURL);
        const contract = new ethers.Contract(process.env.DF_REWARDS_CONTRACT, dfRewardsABI, provider);
        //   const estimateClaim = await contract.claimable(userAddress, tokenAddress);
        //   const estimateClaimFormatted = ethers.utils.formatEther(BigInt(estimateClaim).toString(10));
        //   return estimateClaimFormatted
        return 0
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function claimDFRewards(airdropData, chainId, userAddress, signer) {
    try {
        const tokenAddresses = Object.keys(airdropData[chainId].tokensData);
        let positiveClaimables = [];
        // TODO - Make sure that claim is only done on non-zero tokens
        for (let i = 0; i < tokenAddresses.length; i++) {
            if (Number(airdropData[chainId].tokensData[tokenAddresses[i]]['claimable amount']) > 0)
                positiveClaimables.push(tokenAddresses[i]);
        }

        if( positiveClaimables.length >= 0 ) {
            const contract = new ethers.Contract(
                airdropData[chainId].dfRewardsAddress,
                airdropABI.default,
                signer
            );
            const resp = await contract.claimMultiple(userAddress, positiveClaimables);
            await resp.wait();
            console.log("Success claiming rewards, txReceipt here");
        }
    } catch (error) {
        console.log("Error claiming rewards :", error);
        throw error;
    }
}

export async function claimVERewards(userAddress, signer) {
    try {
        const contract = new ethers.Contract(
            process.env.FEE_DISTRIBUTOR_CONTRACT,
            feeDistributorABI.default,
            signer
        );
        console.log(contract)
        const resp = await contract.claim([userAddress],{gasLimit: gasLimit});
        await resp.wait();
        console.log("Success claiming rewards, txReceipt here");
    }catch (error) {
        console.log("Error claiming rewards :", error);
        throw error;
    }
}
