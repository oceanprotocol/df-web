export let filterPoolsByUserShares = (pools, shares) => {
    let filteredPools = []
    console.log(pools)
    console.log(shares)
    shares.forEach((share) => {
            pools.forEach((pool) => {
            if(share.pool_addr === pool.pooladdress){
                filteredPools.push(pool)
            }
        })
    })
    return filteredPools
}