const ContractAddressConfig_ArbitrumSepolia = {
    etherscan: 'https://sepolia.arbiscan.io',
    etherscanAPI: 'https://api-sepolia.arbiscan.io',
    subgraph: 'https://api.studio.thegraph.com/query/69782/drx_exchange/v0.0.9.13.1.1',
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        USDC: '0x0379DcbD13a69d41021075b88cF65b6C7EE0429B',
        ARB: '0x91fcF4AAA4C42FdbF34Ba868B653b26C7c3c3F51',
        WETH: '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
        WBTC: '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
        USDT: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
        DAI: '0x16306593BE20EA1D499261081b8040e3F675FECE',
    },

    "TradingMeta": {
        "IsolatedMarginPortfolioFactory": "0x1E2835696B6d69DA8aE32609C8A6b5aE255dFA57",
        "CrossMarginPortfolioFactory": "0xaD09f067f4AAA7ff7F49d68185a40b0cD46071CC",
        "Instrument": "0xB30D33b2d70cFeb6D8134f3219223fd74adD6582",
        "PriceAggregator": "0x500A29A859177f2215F33d81A6Ee772c728F4c69",
        "CrossMarginPortfolioController": "0xD9D4147db2db3773ED7579FBeBA8A08Ad46BE6B2",
        "PortfolioLibrary": "0xb8d3f6c416BCE4f67D9d60bBAF42Ccc2DA095FCe",
        "PortfolioLibraryExternal": "0x5Bfebc8B828082A50011eF114b2504a54EA7e47b",
        "RiskController": "0xEb5465D87864776b76BdBC7aDde7D0BD0cC95292",
        "OIAndPnLManager": "0xeb49A63b4eaf61bffc84542E5F6ed0B1Ed85cE3C",
        "CMPLiabilityManager": "0xCFA208A9e0370dE92642BFA6c35eeA0A9AEFc650",
        "CMPLiabilityController": "0xCFA208A9e0370dE92642BFA6c35eeA0A9AEFc650",
        "CMPLiabilityInterestManager": "0x5E0a03fD8Eb400ac4c791ED5C763b28a18f524d4",
        "CMPAutoRepayManager": "0x3Ec40982c055dAA4b6f24695e57a45a0a0f10fd1",
        "Trading": "0x6CaA1B628751BDd352D5913E1d131D2DDD533d84",
        "CLPriceVerifierHelper": "0x561134eE7282229D5378bC7961646a2ecb74d757",
        "IMPController": "0xA4e6cF08DbF34dED3Ec3c9B19593AD311e14Bc08",
        "CMPController": "0xD9D4147db2db3773ED7579FBeBA8A08Ad46BE6B2",
        "FeeManager": "0x43F9A19f5813F467fB277f3fBC30a3901cBc7910",
        "SpreadManager": "0xE888807A0E7405915656fFAb2f27b54C9A28E787",
        "Logger": "0xB89183041e6B463F62eD00db23E8f0A897329fD5"
    },
    "Earn": {
        "Vault": {
            "DAI": "0x839bd00df04A9b7940dd8F3E07ef72FC05Bf6E8c",
            "USDT": "0xB704B22c59F16F44b443F0986A7B4F17267eec55",
            "WETH": "0x56a6FE927559f626E66aBcBc2c2F92316a108d65",
            "WBTC": "0x79a2684218595C79705aFF64154d8aD4284F45aA"
        },
        "NFTManager": {
            "DAI": "0x629a78988216599ff7C7740a099C639554157eF1",
            "USDT": "0xa2d7529DA0D7DccFcC192c5e0eAF339138893607",
            "WETH": "0x0a232254495a06493c88Cca04C369a6EE3047310",
            "WBTC": "0x4eBa5E3Bfd1d52938Ae6Df2e2D929256F260C2A5"
        }
    }
};

export default ContractAddressConfig_ArbitrumSepolia;