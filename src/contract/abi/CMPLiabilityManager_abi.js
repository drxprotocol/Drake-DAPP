const CMPLiabilityManager_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getLiability",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_cmp",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_payer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "payDebt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_settleCcy",
                "type": "address"
            }
        ],
        "name": "totalLiabilityAmt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_cmp",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "addLiability",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_cmp",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_payer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "payLiability",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default CMPLiabilityManager_abi;
