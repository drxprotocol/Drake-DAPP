const Instrument_abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "instrument",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "instId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "baseCcy",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "quoteCcy",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "settleCcy",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
];
export default Instrument_abi;
