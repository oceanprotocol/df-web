export let filterDataByUserAllocation = (datasets, allocations) => {
    let filteredDatasets = []
    allocations.forEach((allocation) => {
            datasets.forEach((dataset) => {
            if(allocation.nft_addr === dataset.nftaddress){
                filteredDatasets.push(dataset)
            }
        })
    })
    return filteredDatasets
}

 export let calcMaxAllowedStakeInput = (poolReserve) => {
    return (poolReserve / 2).toFixed(3)
}