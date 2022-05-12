const chainIdRPCs = {
  4 : "https://rinkeby.infura.io/v3/05d2b0098cf44eb789387708af2527a1"
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