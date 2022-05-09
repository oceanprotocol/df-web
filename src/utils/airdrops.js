import { getNetworkByChainId } from "../app.config";
const ethers = require("ethers");
require("dotenv").config();

export const airdrops = {
    "EthMainnet_OCEAN_OPF": {
        name: "OPF OCEAN",
        chainId: 0,
        chainName: "development",
        airdropAddress: "0x004FFD866E72e6795450b86018f7Dc97d7Bbe29A",
        tokenName: "OCEAN",
        tokenAddress: "0x93Ae7ef0Eb308D514FDEF755C7cb93dA83277727"
    },
    "EthMainnet_PSDN_H20Team": {
        name: "H20 PSDN",
        chainId: 0,
        chainName: "development",
        airdropAddress: "0x88EC959406A9db2c5Ce9be15E92D56415F00ED94",
        tokenName: "PSDN",
        tokenAddress: "0x133F17634B7B7414cefAd91E71c8b2B082e06179"
    }
};

export const claimABI = ["function claimable(address _to) public view returns (uint256)"];

export const getBalanceFromAirdrop = async (address, key) => {
    if (!address || !key) return null;
    const airdrop = airdrops[key];
    let balance = null;
    try {
        const chainId = airdrop.chainId;
        const network = getNetworkByChainId(chainId);
        if( network !== undefined ) {
            const airdropAddress = airdrop.airdropAddress;
            const provider = new ethers.providers.JsonRpcProvider(network.provider);
            const contract = new ethers.Contract(airdropAddress, claimABI, provider);
            balance = await contract.claimable(address);
            balance = balance > 0 ? ethers.utils.formatEther(balance) : 0
        }
    } catch (err) {
        console.error(err, network, networks);
    }

    return balance;
};

export const getAllBalances = async (address) => {
    if (!address) return [];
    const balances = [];

    for (key of Object.keys(airdrops)) {
        const airdrop = airdrops[key];
        const balance = await(getBalanceFromAirdrop(address, airdrop.airdropAddress));
        balances.push([key, balance]);
    }
    return balances;
};
