const CLPriceVerifierHelper_abi = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "_pendingOrdId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_ordInstBaseCcyReport",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_allSettleCcyReports",
                        "type": "bytes[]"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_openPosBaseCcyReports",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct CLPriceVerifierHelper.ExecuteCMPPendingOrderParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "executeCMPPendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_pendingOrdId",
                "type": "uint256"
            },
            {
                "internalType": "bytes[]",
                "name": "_reports",
                "type": "bytes[]"
            }
        ],
        "name": "executeIMPPendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "_posId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_allSettleCcyReports",
                        "type": "bytes[]"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_openPosBaseCcyReports",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct CLPriceVerifierHelper.LiquidateCMPPosByPosIdParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "liquidateCMPPosByPosId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_posId",
                "type": "uint256"
            },
            {
                "internalType": "bytes[]",
                "name": "_reports",
                "type": "bytes[]"
            }
        ],
        "name": "liquidateIMPPosByPosId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "_cmp",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_allSettleCcyReports",
                        "type": "bytes[]"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "_openPosBaseCcyReports",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct CLPriceVerifierHelper.LiquidateCMPPortfParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "liquidateCMPPortf",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default CLPriceVerifierHelper_abi;
