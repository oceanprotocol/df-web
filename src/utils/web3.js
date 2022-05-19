const chainIdRPCs = {
    3 : "https://ropsten.infura.io/v3/05d2b0098cf44eb789387708af2527a1",
    4 : "https://rinkeby.infura.io/v3/05d2b0098cf44eb789387708af2527a1"
    // 56 : "https://bsc-dataseed.binance.org/",
    // 137 : "https://polygon-rpc.com",
    // 246 : "https://rpc.energyweb.org",
    // 1285 : "https://rpc.api.moonriver.moonbeam.network",
}

export function getNetworkDataById(
    data,
    networkId
) {
    if (!networkId) return
    const networkData = data.filter(
      (chain) => chain.chainId === networkId
    )
    return networkData[0]
}

export function getRpcUrlByChainId(chainId){
  return chainIdRPCs[chainId]
}
