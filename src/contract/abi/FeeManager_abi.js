const FeeManager_abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            }
        ],
        "name": "getBorrowingAPR",
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
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "enum TypeLibrary.Side",
                "name": "_side",
                "type": "uint8"
            }
        ],
        "name": "getFundingFeeAPRbySide",
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
                "name": "_posId",
                "type": "uint256"
            }
        ],
        "name": "getPosPendingBorrowingFee",
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
                "name": "_posId",
                "type": "uint256"
            }
        ],
        "name": "getPosPendingFundingFee",
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
];
export default FeeManager_abi;
