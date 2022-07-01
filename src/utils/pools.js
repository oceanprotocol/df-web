export let filterPoolsByUserShares = (pools, shares) => {
    let filteredPools = []
    shares.forEach((share) => {
            pools.forEach((pool) => {
            if(share.pool_adr === pool.pool_adr){
                filteredPools.push(pool)
            }
        })
    })
    return filteredPools
}