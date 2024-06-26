const CMPAutoRepayManager_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isInNonBorrowMode",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
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
                "internalType": "uint256",
                "name": "_mode",
                "type": "uint256"
            }
        ],
        "name": "changeBorrowMode",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default CMPAutoRepayManager_abi;
