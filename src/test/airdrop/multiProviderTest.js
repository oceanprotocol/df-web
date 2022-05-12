const ethers = require('ethers');
const airdropABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"tos","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"Allocated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_tos","type":"address[]"},{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"allocate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claimables","outputs":[{"internalType":"uint256[]","name":"result","type":"uint256[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"claimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claimMultiple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"claimFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"}],"name":"withdrawERCToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const airdrops = {
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
        abi: airdropABI
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
        abi: airdropABI
    },
};

const rinProvider = ethers.getDefaultProvider('rinkeby');
const ropProvider = ethers.getDefaultProvider('ropsten');

const getAllClaimables = async () => {
    const ropContract = new ethers.Contract(airdrops[3].airdropAddress, airdrops[3].abi, ropProvider);
    const ropClaimables = await ropContract.claimables("0x50bAAc6597fdF30A34BA1fF29a342FE4d3536e49", airdrops[3].tokens);
    console.log("Ropsten Claimables 0 are: ", ropClaimables[0]);
    console.log("Ropsten Claimables 1 are: ", ropClaimables[1]);
    console.log("Ropsten BigNumber 0 is: ", BigInt(ropClaimables[0]).toString(10));
    console.log("Ropsten BigNumber 1 is: ", BigInt(ropClaimables[1]).toString(10));
    console.log("Ropsten BigNumber Ether Format 0 is: ", ethers.utils.formatEther(BigInt(ropClaimables[0]).toString(10)));
    console.log("Ropsten BigNumber Ether Format 1 is: ", ethers.utils.formatEther(BigInt(ropClaimables[1]).toString(10)));

    const rinContract = new ethers.Contract(airdrops[4].airdropAddress, airdrops[4].abi, rinProvider);
    const rinClaimables = await rinContract.claimables("0x50bAAc6597fdF30A34BA1fF29a342FE4d3536e49", airdrops[4].tokens);
    console.log("Rinkeby Claimables 0 are: ", rinClaimables[0]);
    console.log("Rinkeby Claimables 1 are: ", rinClaimables[1]);
    console.log("Rinkeby BigNumber 0 is: ", BigInt(rinClaimables[0]).toString(10));
    console.log("Rinkeby BigNumber 1 is: ", BigInt(rinClaimables[1]).toString(10));
    console.log("Rinkeby BigNumber Ether Format 0 is: ", ethers.utils.formatEther(BigInt(rinClaimables[0]).toString(10)));
    console.log("Rinkeby BigNumber Ether Format 1 is: ", ethers.utils.formatEther(BigInt(rinClaimables[1]).toString(10)));

}

getAllClaimables()
