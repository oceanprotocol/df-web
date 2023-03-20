export const filterOptions = [
    { id: "0", text: "All datasets" },
    { id: "1", text: "My allocations" },
    { id: "2", text: "2xers" },
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

export let assignRowsState = (datasets, ownerAddress) => {
    if (!ownerAddress) return datasets;
    return datasets.map((d) => {  
        const { id, owner, myallocation, ownerallocation } = d;
        // clean ID 
        const cleanID = typeof(id) === 'number' ? JSON.stringify(id) : id.split('_')[1];
        const isOwned = owner === ownerAddress?.toLowerCase();
        const hasAllocated = myallocation > 0;
        if (isOwned) {
            d.id = `owned_${cleanID}`
        }
        if (hasAllocated) {
            d.id = `allocated_${cleanID}`
        }
        if (ownerallocation > 0 || isOwned && myallocation > 0) {
            d.id = `2xers_${cleanID}`
        }
        return d;
    })
}