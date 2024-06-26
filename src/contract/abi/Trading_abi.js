const Trading_abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_reqIdentifer",
                "type": "uint256"
            }
        ],
        "name": "OrderRequestFulfilled",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_pendingOrdId",
                "type": "uint256"
            }
        ],
        "name": "cancelPendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "enum TypeLibrary.Side",
                "name": "_ordSide",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_ordSize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_fulfillPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_reqIdentifer",
                "type": "uint256"
            }
        ],
        "name": "sendLimitOrderReq",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "enum TypeLibrary.Side",
                "name": "_ordSide",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_ordSize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_stopPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_reqIdentifer",
                "type": "uint256"
            }
        ],
        "name": "sendMarketOrderReq",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "enum TypeLibrary.Side",
                "name": "_ordSide",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_ordSize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_triggerPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_stopPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_reqIdentifer",
                "type": "uint256"
            }
        ],
        "name": "sendStopMarketOrderReq",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default Trading_abi;
