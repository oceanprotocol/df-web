import {supportedChainIds, getNetworkByChainId} from "../app.config";
import {ethers} from 'ethers';
import * as airdropABI from './airdropABI'
export const airdrops = {
    3: {
        airdropAddress: "0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792"
        ],
        tokensData:{
            0xe6239d757c064c237dF31e08EbdD582f0608aCE0: {
                symbol: 'OCEAN',
                rewards: 0
            },
            0x01be23585060835e02b77ef475b0cc51aa1e0709: {
                symbol: 'PSDN',
                rewards: 0
            }
        },
        abi: airdropABI.default
    },
    4: {
        airdropAddress: "0x4751774A124D02f1611dFe17f4d697dDdF932Fd5",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0xc6913d3eCed79021a39E6955015313B22B72b76E"
        ],
        tokensData:{
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0": {
                symbol: 'OCEAN',
                rewards: 0
            },
            "0xc6913d3eCed79021a39E6955015313B22B72b76E": {
                symbol: 'PSDN',
                rewards: 0
            }
        },
        abi: airdropABI.default
    },
};

export const getClaimablesFromAirdrop = async (chainId, airdrop, address) => {
    if (!chainid || !airdrop || !address) return null;
    let claimables = [];
    try {
        const network = getNetworkByChainId(chainId);
        if( network !== undefined ) {
            const provider = new ethers.providers.JsonRpcProvider(network.provider);
            // TODO - Initialize contracts only once
            // TODO - Pass in signer to be able to R+W
            const contract = new ethers.Contract(airdrop.airdropAddress, airdrop.abi, provider);
            const claimableRewards = await contract.claimables(address, airdrop.tokens)
            for(reward of claimableRewards)
                claimables.push(reward > 0 ? ethers.utils.formatEther(reward) : 0)
        }
    } catch (err) {
        console.error(err, network, networks);
    }

    return claimables;
}

export const getAllClaimables = async (address, selectedChains) => {
    if (!address) return [];
    const claimables = {};

    const filteredChains = supportedChainIds.filter(x => x in selectedChains)
    for (chainId of filteredChains) {
        if( airdrops[chainId] ) {
            const airdrop = airdrops[chainId];
            for (token of airdrop.tokens) {
                const airdropClaimables = await getClaimablesFromAirdrop(chainId, airdrop.airdropAddress, address, token);
                if (!claimables[chainId])
                    claimables[chainId] = {};

                claimables[chainId] = airdropClaimables;
            }
        }
    }

    return claimables;
}
