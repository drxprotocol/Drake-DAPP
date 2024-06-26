const PriceAggregator_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_currency",
                "type": "address"
            }
        ],
        "name": "getPriceEst",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
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
                "name": "_baseCcy",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_quoteCcy",
                "type": "address"
            }
        ],
        "name": "getRelativePriceEst",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
];
export default PriceAggregator_abi;
