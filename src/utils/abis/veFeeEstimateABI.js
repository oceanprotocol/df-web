export default [
  {
    "inputs": [
      {
        "name": "_voting_escrow",
        "type": "address"
      },
      {
        "name": "_fee_distributor",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "gas": 440896,
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "estimateClaim",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "gas": 1151,
    "inputs": [],
    "name": "voting_escrow",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "gas": 1181,
    "inputs": [],
    "name": "fee_distributor",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]