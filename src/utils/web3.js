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