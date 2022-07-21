export default [{"name": "CommitOwnership", "inputs": [{"name": "admin", "type": "address", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "ApplyOwnership", "inputs": [{"name": "admin", "type": "address", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Deposit", "inputs": [{"name": "provider", "type": "address", "indexed": true}, {"name": "value", "type": "uint256", "indexed": false}, {"name": "locktime", "type": "uint256", "indexed": true}, {"name": "type", "type": "int128", "indexed": false}, {"name": "ts", "type": "uint256", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Withdraw", "inputs": [{"name": "provider", "type": "address", "indexed": true}, {"name": "value", "type": "uint256", "indexed": false}, {"name": "ts", "type": "uint256", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Supply", "inputs": [{"name": "prevSupply", "type": "uint256", "indexed": false}, {"name": "supply", "type": "uint256", "indexed": false}], "anonymous": false, "type": "event"}, {"stateMutability": "nonpayable", "type": "constructor", "inputs": [{"name": "token_addr", "type": "address"}, {"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {"name": "_version", "type": "string"}], "outputs": []}, {"stateMutability": "nonpayable", "type": "function", "name": "commit_transfer_ownership", "inputs": [{"name": "addr", "type": "address"}], "outputs": [], "gas": 39445}, {"stateMutability": "nonpayable", "type": "function", "name": "apply_transfer_ownership", "inputs": [], "outputs": [], "gas": 41584}, {"stateMutability": "nonpayable", "type": "function", "name": "commit_smart_wallet_checker", "inputs": [{"name": "addr", "type": "address"}], "outputs": [], "gas": 37605}, {"stateMutability": "nonpayable", "type": "function", "name": "apply_smart_wallet_checker", "inputs": [], "outputs": [], "gas": 39632}, {"stateMutability": "view", "type": "function", "name": "get_last_user_slope", "inputs": [{"name": "addr", "type": "address"}], "outputs": [{"name": "", "type": "int128"}], "gas": 5001}, {"stateMutability": "view", "type": "function", "name": "user_point_history__ts", "inputs": [{"name": "_addr", "type": "address"}, {"name": "_idx", "type": "uint256"}], "outputs": [{"name": "", "type": "uint256"}], "gas": 2804}, {"stateMutability": "view", "type": "function", "name": "locked__end", "inputs": [{"name": "_addr", "type": "address"}], "outputs": [{"name": "", "type": "uint256"}], "gas": 2789}, {"stateMutability": "nonpayable", "type": "function", "name": "checkpoint", "inputs": [], "outputs": [], "gas": 37407624}, {"stateMutability": "nonpayable", "type": "function", "name": "deposit_for", "inputs": [{"name": "_addr", "type": "address"}, {"name": "_value", "type": "uint256"}], "outputs": [], "gas": 75001051}, {"stateMutability": "nonpayable", "type": "function", "name": "create_lock", "inputs": [{"name": "_value", "type": "uint256"}, {"name": "_unlock_time", "type": "uint256"}], "outputs": [], "gas": 75002620}, {"stateMutability": "nonpayable", "type": "function", "name": "increase_amount", "inputs": [{"name": "_value", "type": "uint256"}], "outputs": [], "gas": 75002041}, {"stateMutability": "nonpayable", "type": "function", "name": "increase_unlock_time", "inputs": [{"name": "_unlock_time", "type": "uint256"}], "outputs": [], "gas": 75002688}, {"stateMutability": "nonpayable", "type": "function", "name": "withdraw", "inputs": [], "outputs": [], "gas": 37587118}, {"stateMutability": "view", "type": "function", "name": "balanceOf", "inputs": [{"name": "addr", "type": "address"}], "outputs": [{"name": "", "type": "uint256"}]}, {"stateMutability": "view", "type": "function", "name": "balanceOf", "inputs": [{"name": "addr", "type": "address"}, {"name": "_t", "type": "uint256"}], "outputs": [{"name": "", "type": "uint256"}]}, {"stateMutability": "view", "type": "function", "name": "balanceOfAt", "inputs": [{"name": "addr", "type": "address"}, {"name": "_block", "type": "uint256"}], "outputs": [{"name": "", "type": "uint256"}], "gas": 824445}, {"stateMutability": "view", "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{"name": "", "type": "uint256"}]}, {"stateMutability": "view", "type": "function", "name": "totalSupply", "inputs": [{"name": "t", "type": "uint256"}], "outputs": [{"name": "", "type": "uint256"}]}, {"stateMutability": "view", "type": "function", "name": "totalSupplyAt", "inputs": [{"name": "_block", "type": "uint256"}], "outputs": [{"name": "", "type": "uint256"}], "gas": 1353788}, {"stateMutability": "nonpayable", "type": "function", "name": "changeController", "inputs": [{"name": "_newController", "type": "address"}], "outputs": [], "gas": 38055}, {"stateMutability": "view", "type": "function", "name": "token", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 2928}, {"stateMutability": "view", "type": "function", "name": "supply", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "gas": 2958}, {"stateMutability": "view", "type": "function", "name": "locked", "inputs": [{"name": "arg0", "type": "address"}], "outputs": [{"name": "amount", "type": "int128"}, {"name": "end", "type": "uint256"}], "gas": 5593}, {"stateMutability": "view", "type": "function", "name": "epoch", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "gas": 3018}, {"stateMutability": "view", "type": "function", "name": "point_history", "inputs": [{"name": "arg0", "type": "uint256"}], "outputs": [{"name": "bias", "type": "int128"}, {"name": "slope", "type": "int128"}, {"name": "ts", "type": "uint256"}, {"name": "blk", "type": "uint256"}], "gas": 9903}, {"stateMutability": "view", "type": "function", "name": "user_point_history", "inputs": [{"name": "arg0", "type": "address"}, {"name": "arg1", "type": "uint256"}], "outputs": [{"name": "bias", "type": "int128"}, {"name": "slope", "type": "int128"}, {"name": "ts", "type": "uint256"}, {"name": "blk", "type": "uint256"}], "gas": 10148}, {"stateMutability": "view", "type": "function", "name": "user_point_epoch", "inputs": [{"name": "arg0", "type": "address"}], "outputs": [{"name": "", "type": "uint256"}], "gas": 3323}, {"stateMutability": "view", "type": "function", "name": "slope_changes", "inputs": [{"name": "arg0", "type": "uint256"}], "outputs": [{"name": "", "type": "int128"}], "gas": 3253}, {"stateMutability": "view", "type": "function", "name": "controller", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 3168}, {"stateMutability": "view", "type": "function", "name": "transfersEnabled", "inputs": [], "outputs": [{"name": "", "type": "bool"}], "gas": 3198}, {"stateMutability": "view", "type": "function", "name": "name", "inputs": [], "outputs": [{"name": "", "type": "string"}], "gas": 13458}, {"stateMutability": "view", "type": "function", "name": "symbol", "inputs": [], "outputs": [{"name": "", "type": "string"}], "gas": 11211}, {"stateMutability": "view", "type": "function", "name": "version", "inputs": [], "outputs": [{"name": "", "type": "string"}], "gas": 11241}, {"stateMutability": "view", "type": "function", "name": "decimals", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "gas": 3318}, {"stateMutability": "view", "type": "function", "name": "future_smart_wallet_checker", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 3348}, {"stateMutability": "view", "type": "function", "name": "smart_wallet_checker", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 3378}, {"stateMutability": "view", "type": "function", "name": "admin", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 3408}, {"stateMutability": "view", "type": "function", "name": "future_admin", "inputs": [], "outputs": [{"name": "", "type": "address"}], "gas": 3438}]