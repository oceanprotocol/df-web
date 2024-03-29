export const filterOptions = [
    { id: "0", text: "All datasets" },
    { id: "1", text: "My allocations" },
    { id: "2", text: "Publisher 2X stake" },
    { id: "3", text: "My published" },
]

export let filterDataByUserAllocation = (datasets, allocations) => {
    let filteredDatasets = []
    datasets.forEach((dataset) => {
        if(dataset.myallocation > 0){
            filteredDatasets.push(dataset)
            return
        }
        allocations.forEach((allocation) => {
            if(allocation.nftAddress === dataset.nftaddress){
                filteredDatasets.push(dataset)
            }
        })
    })
    return filteredDatasets
}

export let filterDataBy2xers = (datasets, ownerAddress) => {
    let filteredDatasets = []
    filteredDatasets = datasets.filter((d) => {
        return d.owner === ownerAddress.toLowerCase() && d.myallocation > 0 || d.ownerallocation > 0
    })
    return filteredDatasets
}

export let filterDataByOwner = (datasets, ownerAddress) => {
    let filteredDatasets = []
    filteredDatasets = datasets.filter((d) => d.owner === ownerAddress.toLowerCase())
    return filteredDatasets
}

 export let calcMaxAllowedStakeInput = (poolReserve) => {
    return (poolReserve / 2).toFixed(3)
}