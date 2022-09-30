export let filterDataByUserAllocation = (datasets, allocations) => {
    let filteredDatasets = []
    datasets.forEach((dataset) => {
        if(dataset.myallocation > 0){
            filteredDatasets.push(dataset)
            return
        }
        allocations.forEach((allocation) => {
            if(allocation.nftAddress === dataset.nftaddress){
                console.log(dataset)
                filteredDatasets.push(dataset)
            }
        })
    })
    return filteredDatasets
}

 export let calcMaxAllowedStakeInput = (poolReserve) => {
    return (poolReserve / 2).toFixed(3)
}