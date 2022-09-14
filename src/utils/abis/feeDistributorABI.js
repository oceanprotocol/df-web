export default [
  {
    "name": "CommitAdmin",
    "inputs": [
      {
        "type": "address",
        "name": "admin",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "ApplyAdmin",
    "inputs": [
      {
        "type": "address",
        "name": "admin",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "ToggleAllowCheckpointToken",
    "inputs": [
      {
        "type": "bool",
        "name": "toggle_flag",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "CheckpointToken",
    "inputs": [
      {
        "type": "uint256",
        "name": "time",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "tokens",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "Claimed",
    "inputs": [
      {
        "type": "address",
        "name": "recipient",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "amount",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "claim_epoch",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "max_epoch",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "outputs": [],
    "inputs": [
      {
        "type": "address",
        "name": "_voting_escrow"
      },
      {
        "type": "uint256",
        "name": "_start_time"
      },
      {
        "type": "address",
        "name": "_token"
      },
      {
        "type": "address",
        "name": "_admin"
      },
      {
        "type": "address",
        "name": "_emergency_return"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "name": "checkpoint_token",
    "outputs": [],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 820723
  },
  {
    "name": "ve_for_at",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_user"
      },
      {
        "type": "uint256",
        "name": "_timestamp"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "gas": 249417
  },
  {
    "name": "checkpoint_total_supply",
    "outputs": [],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 10592405
  },
  {
    "name": "claim",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "name": "claim",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_addr"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "name": "claim_many",
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address[20]",
        "name": "_receivers"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 26281905
  },
  {
    "name": "burn",
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_coin"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 823450
  },
  {
    "name": "commit_admin",
    "outputs": [],
    "inputs": [
      {
        "type": "address",
        "name": "_addr"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 37898
  },
  {
    "name": "apply_admin",
    "outputs": [],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 39534
  },
  {
    "name": "toggle_allow_checkpoint_token",
    "outputs": [],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 38673
  },
  {
    "name": "kill_me",
    "outputs": [],
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 39587
  },
  {
    "name": "recover_balance",
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_coin"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function",
    "gas": 7778
  },
  {
    "name": "start_time",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1541
  },
  {
    "name": "time_cursor",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1571
  },
  {
    "name": "time_cursor_of",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "gas": 1816
  },
  {
    "name": "user_epoch_of",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "gas": 1846
  },
  {
    "name": "last_token_time",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1661
  },
  {
    "name": "tokens_per_week",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "uint256",
        "name": "arg0"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "gas": 1800
  },
  {
    "name": "voting_escrow",
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1721
  },
  {
    "name": "token",
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1751
  },
  {
    "name": "total_received",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1781
  },
  {
    "name": "token_last_balance",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1811
  },
  {
    "name": "ve_supply",
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "inputs": [
      {
        "type": "uint256",
        "name": "arg0"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "gas": 1950
  },
  {
    "name": "admin",
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1871
  },
  {
    "name": "future_admin",
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1901
  },
  {
    "name": "can_checkpoint_token",
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1931
  },
  {
    "name": "emergency_return",
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1961
  },
  {
    "name": "is_killed",
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ],
    "inputs": [],
    "stateMutability": "view",
    "type": "function",
    "gas": 1991
  }
]