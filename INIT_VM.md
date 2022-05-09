### Setting up local ganache
# modified
{
 "development": {
  "DTFactory": "0xf27084CD16ec7B1B17c495c9AA9BbD196c83cee9",
  "BFactory": "0xf95E74Ebc9f74fb172564863e67E22bb662d48e7",
  "FixedRateExchange": "0x2637104448b7A8489Dd527907e62796178147313",
  "Metadata": "0x08C005225Fa3c3aE3AA487800bcD28FdEc32f11d",
  "Ocean": "0xB4eEEbA76D96F11F3C644Bb80B556f4eA622f1D0",
  "poolTemplate": "0x8F730c1fC2618fefAac911486f4965d002491C4b",
  "Router": "0x8147bf0C5e331D19c541ee3EbA40a72837352A2e",
  "ERC20Template": {
   "1": "0x4b91A051c5b8B554890DEd40742E6B12B6852aB0",
   "2": "0xdB3D9Fdd708e80db78D3f858692988639F2A9c63"
  },
  "ERC721Template": {
   "1": "0xD3E463c46905a634B47ad8722f43D96b8F0e71e7"
  }
 }
}

### Data Overview
To get this organized you'll need a mixture of accessing basic data from ganache. You can activate the `df-py` venv, and then use `brownie console` to dir(addresses) to access this information too.

If you initialize ganache-cli locally, it will give you thi information right away in the form of various accounts, and their public/private keys.

To KISS, use account[0] as the Token and Airdrop contracts owner.
 
Consider the following initialization

### Initialize Ganache
Terminal #1 - Kickoff ganache-cli
```
ubuntu@ubuntu:ocean$ ganache-cli
Ganache CLI v6.12.2 (ganache-core: 2.13.2)

Available Accounts
==================
(0) 0x21FFcEA6FCA6AE68eF98dDBA92c322A4307e3f83 (100 ETH)
(1) 0xEc58Fabf6119bab94D162375Fc172839403A96f8 (100 ETH)
(2) 0x6545c7e9057d84BBF357735BB56280Ee921bc021 (100 ETH)
(3) 0xe49652a217E5F53DA28452f91416a1D810c1956F (100 ETH)
(4) 0x78ce32D461c2afE235AC166E89C066114990a2cF (100 ETH)
(5) 0x2550836b60b7C08A08495c29730c1dF50Ad17016 (100 ETH)
(6) 0x6b7a9d4C5fb14b70599fd5CB502bcDCd7D36239b (100 ETH)
(7) 0x426e88FB48139Bb9F84Ef62e9992b81DF90E8179 (100 ETH)
(8) 0x49f9d47D0cD5986F9301Eb5BBF4946dcF0300cfa (100 ETH)
(9) 0xDfD6D86f52BC8925455dC2CCCaE7f34074Fcc0FB (100 ETH)

Private Keys
==================
(0) 0x3770dfb370f2d4c33e31655094ca8a54b83f93c244915f0b4ecc3dcf1e9e1235
(1) 0xa1f29b6846c779d8b8271149bf6dd87b029118ec450d2cd8d759291aea594533
(2) 0xfaa1f2f8af2b91d328158fd8940fae7b6fb28e8fe6bccc5ee3b7bf020af2c5f7
(3) 0x94b2a0e02021e682a07768a5ea2e565aee6dfa4c1af058baac5e6e2b73da1560
(4) 0xc16531c407629dc044f803a79355363b3376fa72ae851b4b59aea5c7ee79235a
(5) 0x46fd991b1b2dd8b733d2ee6743dd8de7f28c7efdb8bc7b03ab5f0ea6478c286f
(6) 0xa5848ff774ab33e7bed7ed350515d68619e56f651d4e7e2c6e0614e4a3e0395c
(7) 0xee28ded89439ae55213ba7582ec1e48818b799673284a432a5aada592f3e5ed1
(8) 0xe25839d2113079d481397413c942dc1906bcbb0d736ac78b007bf33b1869f07e
(9) 0x091e683c711cf871011f06286f7590c39b110927d4cc146b183a7751197bf362
```

Terminal #2 - Kickoff df-py venv
```
source venv/bin/activate
```

DFTOOL_KEY=0x3770dfb370f2d4c33e31655094ca8a54b83f93c244915f0b4ecc3dcf1e9e1235   
DF1_TOKEN_ADDRESS=0xd83708Fd28C6e895f887AEC91da4bAC06C3D7642
DF1_AIRDROP_ADDRESS=0x7BB7D1a59E0055F723A075366273e32dC129E7cA
DF2_TOKEN_ADDRESS=0x21FFcEA6FCA6AE68eF98dDBA92c322A4307e3f83
DF2_AIRDROP_ADDRESS=0xDE06fe89D4f78cc0D27523B9099b7CBF8f3FdEB4

### How to Init DF WebApp Ganache/Development
1. Terminal #2 - Initialize the PK that will own the Tokens & Airdrop Contracts
2. Terminal #2 - Deploy the tokens and airdrop contracts. Configure airdrop-metadata.json with this information.
3. Terminal #1 - Copy 5 or more public addresses, and init the rewards.csv files inside this repository.
4. Terminal #2 - Dispense rewards
5. Give PKs to participants that should be able to test the app.
6. App needs to enable participants to login and sign via wallet connected into development network.... not sure how this works.
```
# 1. init account[0]
export DFTOOL_KEY=0x3770dfb370f2d4c33e31655094ca8a54b83f93c244915f0b4ecc3dcf1e9e1235
# 2. init tokens & airdrops
dftool newtoken development # copy to > DF1_TOKEN_ADDRESS  
dftool newtoken development # copy to > DF2_TOKEN_ADDRESS
dftool newairdrop development DF1_TOKEN_ADDRESS > DF1_AIRDROP_ADDRESS 
dftool newairdrop development DF2_TOKEN_ADDRESS > DF2_AIRDROP_ADDRESS
# 4. fund airdrop contracts
dftool dispense /utils/metadata/rewards/EthMainnet_OCEAN_OPF development DF1_AIRDROP_ADDRESS
dftool dispense /utils/metadata/rewards/EthMainnet_PSDN_H2OTeam development DF2_AIRDROP_ADDRESS
```
