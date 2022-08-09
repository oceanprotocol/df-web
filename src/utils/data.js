export let filterDataByUserAllocation = (datasets, allocations) => {
    let filteredDatasets = []
    allocations.forEach((allocation) => {
            datasets.forEach((dataset) => {
            if(allocation.pool_addr === dataset.pooladdress){
                filteredDatasets.push(dataset)
            }
        })
    })
    return filteredDatasets
}

 export let calcMaxAllowedStakeInput = (poolReserve) => {
    return (poolReserve / 2).toFixed(3)
}