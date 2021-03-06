export let filterPoolsByUserShares = (pools, shares) => {
    let filteredPools = []
    shares.forEach((share) => {
            pools.forEach((pool) => {
            if(share.pool_addr === pool.pooladdress){
                filteredPools.push(pool)
            }
        })
    })
    return filteredPools
}

 export let calcMaxAllowedStakeInput = (poolReserve) => {
    return (poolReserve / 2).toFixed(3)
}