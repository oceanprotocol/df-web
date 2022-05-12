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
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0": {
                symbol: 'OCEAN',
                rewards: 0
            },
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792": {
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
    if (!chainId || !airdrop || !address) return null;
    let claimables = [];
    try {
        const network = await getNetworkByChainId(chainId);
        if( network !== undefined ) {
            // TODO - Improve provider/initialization inside of stores/web3.js
            // TODO - Get or initial provider as required to make this work
            console.log("Network: ", network)
            const provider = new ethers.providers.JsonRpcProvider(network.provider);
            // TODO - Initialize contracts only once
            // TODO - Pass in signer to be able to R+W
            const contract = new ethers.Contract(airdrop.airdropAddress, airdrop.abi, provider);
            const claimableRewards = await contract.claimables(address, airdrop.tokens)
            for(reward of claimableRewards)
                claimables.push(reward > 0 ? ethers.utils.formatEther(reward) : 0)
        }
    } catch (err) {
        console.error(err);
    }

    return claimables;
}

export const getAllClaimables = async (address, selectedChains) => {
    if (!address) return [];
    const claimables = {};
    const filteredChains = supportedChainIds.filter(x => selectedChains.indexOf(x) >= 0)

    filteredChains.map(async function(chainId) {
        const airdrop = airdrops[chainId];
        console.log("airdrop: ", airdrop)

        for (const token in airdrop.tokens) {
            const airdropClaimables = await getClaimablesFromAirdrop(chainId, airdrop.airdropAddress, address);

            console.log("Airdrop claimables: ", airdropClaimables)
            if (!claimables[chainId])
                claimables[chainId] = {};

            claimables[chainId] = airdropClaimables;
        }
    })

    return claimables;
}
