const BigNumber = require ('bignumber.js');
const Decimal = require ('decimal.js');
const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config()

const ethers = require('ethers');
const airdropABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"tos","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"Allocated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_tos","type":"address[]"},{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"allocate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claimables","outputs":[{"internalType":"uint256[]","name":"result","type":"uint256[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"claimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claimMultiple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"tokenAddresses","type":"address[]"}],"name":"claim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"claimFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"_token","type":"address"}],"name":"withdrawERCToken","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const bpoolABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"amt","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ConsumeMarketFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"oldBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"Gulped","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"bptAmount","type":"uint256"}],"name":"LOG_BPT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"bptAmount","type":"uint256"}],"name":"LOG_BPT_SS","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LOG_CALL","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"LOG_EXIT","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"LOG_JOIN","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"baseTokenAmountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseTokenWeight","type":"uint256"},{"indexed":true,"internalType":"address","name":"datatoken","type":"address"},{"indexed":false,"internalType":"uint256","name":"datatokenAmountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"datatokenWeight","type":"uint256"}],"name":"LOG_SETUP","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"inBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newSpotPrice","type":"uint256"}],"name":"LOG_SWAP","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"OPCWallet","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"OPCFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"marketAddress","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PublishMarketFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"address","name":"newMarketCollector","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapFee","type":"uint256"}],"name":"PublishMarketFeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"LPFeeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oceanFeeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"marketFeeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"consumeMarketFeeAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenFeeAddress","type":"address"}],"name":"SWAP_FEES","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SwapFeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"amt","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BONE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BPOW_PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EXIT_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"INIT_POOL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BOUND_TOKENS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BPOW_BASE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_IN_RATIO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_OUT_RATIO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_TOTAL_WEIGHT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WEIGHT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BALANCE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BOUND_TOKENS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BPOW_BASE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_WEIGHT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_opcCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_publishMarketCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_swapPublishMarketFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"whom","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"data","type":"uint256[4]"},{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"internalType":"uint256","name":"_consumeMarketSwapFee","type":"uint256"}],"name":"calcInGivenOut","outputs":[{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"tokenAmountInBalance","type":"uint256"},{"components":[{"internalType":"uint256","name":"LPFee","type":"uint256"},{"internalType":"uint256","name":"oceanFeeAmount","type":"uint256"},{"internalType":"uint256","name":"publishMarketFeeAmount","type":"uint256"},{"internalType":"uint256","name":"consumeMarketFee","type":"uint256"}],"internalType":"struct BMath.swapfees","name":"_swapfees","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"data","type":"uint256[4]"},{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"_consumeMarketSwapFee","type":"uint256"}],"name":"calcOutGivenIn","outputs":[{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"internalType":"uint256","name":"balanceInToAdd","type":"uint256"},{"components":[{"internalType":"uint256","name":"LPFee","type":"uint256"},{"internalType":"uint256","name":"oceanFeeAmount","type":"uint256"},{"internalType":"uint256","name":"publishMarketFeeAmount","type":"uint256"},{"internalType":"uint256","name":"consumeMarketFee","type":"uint256"}],"internalType":"struct BMath.swapfees","name":"_swapfees","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"}],"name":"calcPoolInSingleOut","outputs":[{"internalType":"uint256","name":"poolAmountIn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"}],"name":"calcPoolOutSingleIn","outputs":[{"internalType":"uint256","name":"poolAmountOut","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"poolAmountOut","type":"uint256"}],"name":"calcSingleInPoolOut","outputs":[{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"poolAmountIn","type":"uint256"}],"name":"calcSingleOutPoolIn","outputs":[{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"collectMarketFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collectOPC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"communityFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"decreaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"poolAmountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"}],"name":"exitswapPoolAmountIn","outputs":[{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"internalType":"uint256","name":"_consumeMarketSwapFee","type":"uint256"}],"name":"getAmountInExactOut","outputs":[{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"lpFeeAmount","type":"uint256"},{"internalType":"uint256","name":"oceanFeeAmount","type":"uint256"},{"internalType":"uint256","name":"publishMarketSwapFeeAmount","type":"uint256"},{"internalType":"uint256","name":"consumeMarketSwapFeeAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"_consumeMarketSwapFee","type":"uint256"}],"name":"getAmountOutExactIn","outputs":[{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"internalType":"uint256","name":"lpFeeAmount","type":"uint256"},{"internalType":"uint256","name":"oceanFeeAmount","type":"uint256"},{"internalType":"uint256","name":"publishMarketSwapFeeAmount","type":"uint256"},{"internalType":"uint256","name":"consumeMarketSwapFeeAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBaseTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getController","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentMarketFees","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentOPCFees","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentTokens","outputs":[{"internalType":"address[]","name":"tokens","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDatatokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getDenormalizedWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFinalTokens","outputs":[{"internalType":"address[]","name":"tokens","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getId","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getMarketFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getNormalizedWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOPCFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"_consumeMarketSwapFee","type":"uint256"}],"name":"getSpotPrice","outputs":[{"internalType":"uint256","name":"spotPrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSwapFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalDenormalizedWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"gulp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"increaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"controller","type":"address"},{"internalType":"address","name":"factory","type":"address"},{"internalType":"uint256[]","name":"swapFees","type":"uint256[]"},{"internalType":"bool","name":"publicSwap","type":"bool"},{"internalType":"bool","name":"finalized","type":"bool"},{"internalType":"address[2]","name":"tokens","type":"address[2]"},{"internalType":"address[2]","name":"feeCollectors","type":"address[2]"}],"name":"initialize","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"t","type":"address"}],"name":"isBound","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isInitialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPublicSwap","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"minPoolAmountOut","type":"uint256"}],"name":"joinswapExternAmountIn","outputs":[{"internalType":"uint256","name":"poolAmountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"publishMarketFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapFee","type":"uint256"}],"name":"setSwapFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"datatokenAddress","type":"address"},{"internalType":"uint256","name":"datatokenAmount","type":"uint256"},{"internalType":"uint256","name":"datatokenWeight","type":"uint256"},{"internalType":"address","name":"baseTokenAddress","type":"address"},{"internalType":"uint256","name":"baseTokenAmount","type":"uint256"},{"internalType":"uint256","name":"baseTokenWeight","type":"uint256"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[3]","name":"tokenInOutMarket","type":"address[3]"},{"internalType":"uint256[4]","name":"amountsInOutMaxFee","type":"uint256[4]"}],"name":"swapExactAmountIn","outputs":[{"internalType":"uint256","name":"tokenAmountOut","type":"uint256"},{"internalType":"uint256","name":"spotPriceAfter","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[3]","name":"tokenInOutMarket","type":"address[3]"},{"internalType":"uint256[4]","name":"amountsInOutMaxFee","type":"uint256[4]"}],"name":"swapExactAmountOut","outputs":[{"internalType":"uint256","name":"tokenAmountIn","type":"uint256"},{"internalType":"uint256","name":"spotPriceAfter","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newCollector","type":"address"},{"internalType":"uint256","name":"_newSwapFee","type":"uint256"}],"name":"updatePublishMarketFee","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const tokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

const GASLIMIT_DEFAULT = 1000000;
const POOL_MAX_AMOUNT_IN_LIMIT = 0.25 // maximum 1/4 of the pool reserve
const POOL_MAX_AMOUNT_OUT_LIMIT = 0.25 // maximum 1/4 of the pool reserve

const airdrops = {
    3: {
        airdropAddress: "0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16",
        tokensData:{
            "0x5e8DCB2AfA23844bcc311B00Ad1A0C30025aADE9": {
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
        tokensData:{
            "0x8967BCF84170c91B0d24D4302C2376283b0B3a07": {
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
const rinSigner = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, rinProvider);

const tokenAddress = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07";
const holdingsAddress = "0x50bAAc6597fdF30A34BA1fF29a342FE4d3536e49";
const bpoolAddress = "0x92fce550a77ffd6a7ae6ced8c04b0e1ba988ef7b";


// Load Providers
const url = `https://rinkeby.infura.io/v3/4b9c931a4f26483aaf53db3ed884549e`;
const web3 = new Web3(url);

function getGasFeeMultiplier(chainId) {
    const gasFeeMultiplier = {
        1: 1.05,
        3: 1,
        4: 1,
        56: 1.05,
        246: 1.05,
        1285: 1.05
    }
    return gasFeeMultiplier[chainId] !== undefined ? gasFeeMultiplier[chainId] : 1;
}

const getFairGasPrice = async  () => {
    const x = new BigNumber(await web3.eth.getGasPrice())
    const gasFeeMultiplier = getGasFeeMultiplier(4);
    return x
        .multipliedBy(gasFeeMultiplier)
        .integerValue(ethers.BigNumber.ROUND_DOWN)
        .toString(10);
}

// dfrewards
const getAllClaimables = async () => {
    // const
    const ropContract = new ethers.Contract(airdrops[3].airdropAddress, airdrops[3].abi, ropProvider);
    const ropClaimables = await ropContract.claimables(holdingsAddress, airdrops[3].tokens);
    console.log("Ropsten Claimables 0 are: ", ropClaimables[0]);
    console.log("Ropsten Claimables 1 are: ", ropClaimables[1]);
    console.log("Ropsten BigNumber 0 is: ", BigInt(ropClaimables[0]).toString(10));
    console.log("Ropsten BigNumber 1 is: ", BigInt(ropClaimables[1]).toString(10));
    console.log("Ropsten BigNumber Ether Format 0 is: ", ethers.utils.formatEther(BigInt(ropClaimables[0]).toString(10)));
    console.log("Ropsten BigNumber Ether Format 1 is: ", ethers.utils.formatEther(BigInt(ropClaimables[1]).toString(10)));

    const rinContract = new ethers.Contract(airdrops[4].airdropAddress, airdrops[4].abi, rinProvider);
    const rinClaimables = await rinContract.claimables(holdingsAddress, airdrops[4].tokens);
    console.log("Rinkeby Claimables 0 are: ", rinClaimables[0]);
    console.log("Rinkeby Claimables 1 are: ", rinClaimables[1]);
    console.log("Rinkeby BigNumber 0 is: ", BigInt(rinClaimables[0]).toString(10));
    console.log("Rinkeby BigNumber 1 is: ", BigInt(rinClaimables[1]).toString(10));
    console.log("Rinkeby BigNumber Ether Format 0 is: ", ethers.utils.formatEther(BigInt(rinClaimables[0]).toString(10)));
    console.log("Rinkeby BigNumber Ether Format 1 is: ", ethers.utils.formatEther(BigInt(rinClaimables[1]).toString(10)));
}

// pool
const calcPoolOutFromSingleIn = async () => {
    const amountIn = 1;
    const amountEth = ethers.utils.parseEther(amountIn.toString());
    console.log("Amount in ether: ", amountEth);

    // Rinkeby Ocean
    const baseTokenAddress = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07";
    const bpoolAddress = "0x92fce550a77ffd6a7ae6ced8c04b0e1ba988ef7b";

    const bpool = new ethers.Contract(bpoolAddress, bpoolABI, rinProvider);
    const poolOut = await bpool.calcPoolOutSingleIn(baseTokenAddress, amountEth);
    const poolOutWei = BigInt(poolOut).toString(10);
    const poolOutEth = ethers.utils.formatEther(poolOutWei);

    console.log("BPT out wei: ", poolOutWei);
    console.log("BPT out eth: ", poolOutEth);

    return poolOut;
}

// token
const DTallowance = async (datatokenAddress, owner, spender) => {
    try {
        const datatoken = new web3.eth.Contract(tokenABI, datatokenAddress, {from: spender});
        const trxReceipt = await datatoken.methods.allowance(owner, spender).call();
        return this.web3.utils.fromWei(trxReceipt);
    } catch (e) {
        console.log(e);
    }
}

// datatoken
const DTapprove = async (datatokenAdress, spender, amount, address) => {
    const datatoken = new web3.eth.Contract(tokenABI, datatokenAdress, {
        from: address
    });

    const gasLimitDefault = GASLIMIT_DEFAULT
    let estGas
    try {
        estGas = await datatoken.methods
            .approve(spender, web3.utils.toWei(amount))
            .estimateGas({ from: address }, (err, estGas) => (err ? gasLimitDefault : estGas))
    } catch (e) {
        estGas = gasLimitDefault
    }
    const trxReceipt = await datatoken.methods
        .approve(spender, web3.utils.toWei(amount))
        .send({
            from: address,
            gas: estGas + 1,
            gasPrice: await getFairGasPrice()
        })
    return trxReceipt
}

// pool
const getReserve = async (poolAddress, tokenAddress) => {
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

// pool
const getMaxAddLiquidity = async (poolAddress, tokenAddress) => {
    const balance = await getReserve(poolAddress, tokenAddress);
    if (parseFloat(balance) > 0) {
        return new Decimal(balance).mul(POOL_MAX_AMOUNT_IN_LIMIT).toString()
    } else return '0'
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
    spender,
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

// pool
const addDTLiquidity = async (account, datatokenAddress, poolAddress, amount) => {
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

// getAllClaimables()
// calcPoolOutFromSingleIn()
addDTLiquidity(rinSigner.address, tokenAddress, bpoolAddress, 1..toString());
