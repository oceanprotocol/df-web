const getPassiveAPY = (veSupply, epoch) => {
    const wpr_passive = epoch.passive / veSupply
    const weeks = 52
    const apr_passiv = wpr_passive * weeks
    const apy_passiv = (((1 + apr_passiv/weeks) ** weeks) - 1) * 100

    return apy_passiv
}

// Test #1
let veSupply = 1000;
let epoch =   {
    "id": 1,
    "date_start": "2022-06-16",
    "date_end": "2022-06-23",
    "passive": 10,
    "active": 10,
    "total": 20
}
let apy_passiv = getPassiveAPY(veSupply, epoch);
if( apy_passiv.toFixed(2) != 67.77 ) throw true;

// Test #2
veSupply = 50000;
epoch.passive = 100;
apy_passiv = getPassiveAPY(veSupply, epoch);
if( apy_passiv.toFixed(2) != 10.95 ) throw true;
