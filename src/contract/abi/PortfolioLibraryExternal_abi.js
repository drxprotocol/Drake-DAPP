const PortfolioLibraryExternal_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_imp",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            }
        ],
        "name": "getIMPPosLiqudationPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "liqPrice",
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
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ordSideUint256",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_fulfillPrice",
                "type": "uint256"
            }
        ],
        "name": "getMaxLimitOrderSizeEst",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "maxSize",
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
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ordSideUint256",
                "type": "uint256"
            }
        ],
        "name": "getMaxMarketOrderSizeEst",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "maxSize",
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
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ordSideUint256",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_triggerPirce",
                "type": "uint256"
            }
        ],
        "name": "getMaxStopMarketOrderSizeEst",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "maxSize",
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
                "name": "_portfolio",
                "type": "address"
            }
        ],
        "name": "getOpenPosPosIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
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
            }
        ],
        "name": "getPosMargin",
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
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_closePx",
                "type": "uint256"
            }
        ],
        "name": "getUnPnL",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
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
            }
        ],
        "name": "getUnPnLEst",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
export default PortfolioLibraryExternal_abi;
