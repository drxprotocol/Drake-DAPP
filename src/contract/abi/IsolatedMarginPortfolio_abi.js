const IsolatedMarginPortfolio_abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint8",
                "name": "_type",
                "type": "uint8"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "_amountOut",
                "type": "int256"
            }
        ],
        "name": "AssetTransferred",
        "type": "event"
    },
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DEFAULT_LEVERAGE",
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
        "inputs": [],
        "name": "PORTFOLIO_TYPE",
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
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "addMargin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "additionalMargin",
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
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum TypeLibrary.OrderType",
                                "name": "ordType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum TypeLibrary.OrderState",
                                "name": "ordState",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "portfolio",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "instId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "enum TypeLibrary.Side",
                                "name": "ordSide",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "ordSize",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "fulfillPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "stopPrice",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct TypeLibrary.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pendingOrdId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "triggerPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct TypeLibrary.PendingOrder",
                "name": "_pendingOrder",
                "type": "tuple"
            }
        ],
        "name": "appendPendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_pendingOrderId",
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
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_leverage",
                "type": "uint256"
            }
        ],
        "name": "changeLeverage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum TypeLibrary.OrderType",
                                "name": "ordType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum TypeLibrary.OrderState",
                                "name": "ordState",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "portfolio",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "instId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "enum TypeLibrary.Side",
                                "name": "ordSide",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "ordSize",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "fulfillPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "stopPrice",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct TypeLibrary.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct TypeLibrary.MarketOrder",
                "name": "_marketOrder",
                "type": "tuple"
            }
        ],
        "name": "executeMarketOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_pendingOrderId",
                "type": "uint256"
            }
        ],
        "name": "executePendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factory",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            }
        ],
        "name": "getAvailableAmt",
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
            }
        ],
        "name": "getLeverage",
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
        "inputs": [],
        "name": "getMyPosInstIds",
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
                "internalType": "uint256",
                "name": "_pendingOrdId",
                "type": "uint256"
            }
        ],
        "name": "getPendingOrder",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum TypeLibrary.OrderType",
                                "name": "ordType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum TypeLibrary.OrderState",
                                "name": "ordState",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "portfolio",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "instId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "enum TypeLibrary.Side",
                                "name": "ordSide",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "ordSize",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "fulfillPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "stopPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "ordLeverage",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct TypeLibrary.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pendingOrdId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "triggerPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "appendedTimestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct TypeLibrary.PendingOrder",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPendingOrderIds",
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
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            }
        ],
        "name": "getPosByInstId",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "enum TypeLibrary.PosState",
                        "name": "posState",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "posId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "instId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum TypeLibrary.Side",
                        "name": "posSide",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "posSize",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "avgPx",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct TypeLibrary.Position",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getTotalFrozenAmt",
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
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "leverage",
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
                "name": "_posId",
                "type": "uint256"
            }
        ],
        "name": "liquidatePosByPosId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
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
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "reduceMargin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "name": "_triggerPirce",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_stopPrice",
                "type": "uint256"
            }
        ],
        "name": "sendStopMarketOrderReq",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "frozenAmt",
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
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "withdrawAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getAvailableBal",
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
                "name": "",
                "type": "address"
            }
        ],
        "name": "frozenBalance",
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
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amt",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default IsolatedMarginPortfolio_abi;
