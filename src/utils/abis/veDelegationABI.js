export default[
  {
    "name": "Approval",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_approved",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_operator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_approved",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "Transfer",
    "inputs": [
      {
        "name": "_from",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_to",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "BurnBoost",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_receiver",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "DelegateBoost",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_receiver",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "_amount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "_cancel_time",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "_expire_time",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "ExtendBoost",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_receiver",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "_amount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "_expire_time",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "_cancel_time",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "TransferBoost",
    "inputs": [
      {
        "name": "_from",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_to",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_token_id",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "_amount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "_expire_time",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "GreyListUpdated",
    "inputs": [
      {
        "name": "_receiver",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_delegator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "_status",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "stateMutability": "nonpayable",
    "type": "constructor",
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_symbol",
        "type": "string"
      },
      {
        "name": "_base_uri",
        "type": "string"
      },
      {
        "name": "_ve",
        "type": "address"
      }
    ],
    "outputs": []
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "_approved",
        "type": "address"
      },
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 44267
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 4187016
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_token_id",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "outputs": [],
    "gas": 4187016
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "_operator",
        "type": "address"
      },
      {
        "name": "_approved",
        "type": "bool"
      }
    ],
    "outputs": [],
    "gas": 39194
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 4166384
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "tokenURI",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "gas": 1169111
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "burn",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 4147693
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "_mint_for_testing",
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 489530
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "_burn_for_testing",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 513396
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "uint_to_string",
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "gas": 1153469
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "create_boost",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address"
      },
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_percentage",
        "type": "int256"
      },
      {
        "name": "_cancel_time",
        "type": "uint256"
      },
      {
        "name": "_expire_time",
        "type": "uint256"
      },
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 816892
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "extend_boost",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      },
      {
        "name": "_percentage",
        "type": "int256"
      },
      {
        "name": "_expire_time",
        "type": "uint256"
      },
      {
        "name": "_cancel_time",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 3958128
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "cancel_boost",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "gas": 3643242
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "batch_cancel_boosts",
    "inputs": [
      {
        "name": "_token_ids",
        "type": "uint256[256]"
      }
    ],
    "outputs": [],
    "gas": 932554721
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "set_delegation_status",
    "inputs": [
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_delegator",
        "type": "address"
      },
      {
        "name": "_status",
        "type": "bool"
      }
    ],
    "outputs": [],
    "gas": 42362
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "batch_set_delegation_status",
    "inputs": [
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_delegators",
        "type": "address[256]"
      },
      {
        "name": "_status",
        "type": "uint256[256]"
      }
    ],
    "outputs": [],
    "gas": 10044294
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "adjusted_balance_of",
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 17112
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "delegated_boost",
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3686
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "received_boost",
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3722
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "token_boost",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256"
      }
    ],
    "gas": 4098
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "token_expiry",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3151
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "token_cancel_time",
    "inputs": [
      {
        "name": "_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3211
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "calc_boost_bias_slope",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address"
      },
      {
        "name": "_percentage",
        "type": "int256"
      },
      {
        "name": "_expire_time",
        "type": "int256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256"
      },
      {
        "name": "",
        "type": "int256"
      }
    ],
    "gas": 18487
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "calc_boost_bias_slope",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address"
      },
      {
        "name": "_percentage",
        "type": "int256"
      },
      {
        "name": "_expire_time",
        "type": "int256"
      },
      {
        "name": "_extend_token_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "int256"
      },
      {
        "name": "",
        "type": "int256"
      }
    ],
    "gas": 18487
  },
  {
    "stateMutability": "pure",
    "type": "function",
    "name": "get_token_id",
    "inputs": [
      {
        "name": "_delegator",
        "type": "address"
      },
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 1439
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "commit_transfer_ownership",
    "inputs": [
      {
        "name": "_addr",
        "type": "address"
      }
    ],
    "outputs": [],
    "gas": 38295
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "accept_transfer_ownership",
    "inputs": [],
    "outputs": [],
    "gas": 38189
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "set_base_uri",
    "inputs": [
      {
        "name": "_base_uri",
        "type": "string"
      }
    ],
    "outputs": [],
    "gas": 182531
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "veOcean",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "gas": 3240
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3536
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "getApproved",
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "gas": 3415
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "gas": 3862
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "ownerOf",
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "gas": 3475
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "gas": 11408
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "gas": 11438
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "base_uri",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "gas": 18281
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3480
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "tokenByIndex",
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3625
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "tokenOfOwnerByIndex",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3851
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "token_of_delegator_by_index",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3881
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "total_minted",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 3866
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "account_expiries",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "gas": 4011
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "gas": 3660
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "future_admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "gas": 3690
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "grey_list",
    "inputs": [
      {
        "name": "arg0",
        "type": "address"
      },
      {
        "name": "arg1",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "gas": 4252
  }
]