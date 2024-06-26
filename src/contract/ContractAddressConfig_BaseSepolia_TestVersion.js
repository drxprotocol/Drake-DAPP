const ContractAddressConfig_BaseSepolia_TestVersion = {
    etherscan: 'https://sepolia.arbiscan.io',
    etherscanAPI: 'https://api-sepolia.arbiscan.io',
    subgraph: 'https://api.studio.thegraph.com/query/69782/drx_exchange/v0.0.9.9.1.18',
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
        "IsolatedMarginPortfolioFactory": "0xCe6A85e2194BDEcd639983893Aa571a824E04d44",
        "CrossMarginPortfolioFactory": "0x42c612564Dc4D536520401638d9B903009445957",
        "Instrument": "0xA1432FBa9b3CC2eE190483327117a707773a4A18",
        "PriceAggregator": "0xdaCdB8baAF47f8F8da816Da5E292e3CC169BeF56",
        "CrossMarginPortfolioController": "0x77e552f6acbAbb249c9C738259f4fb412187754B",
        "PortfolioLibrary": "0x61754201d216267C9a504750793e999704762217",
        "PortfolioLibraryExternal": "0xa668B5b6895791919dC98A77f49569DA96e867f0",
        "RiskController": "0xF2f87DCC633b492D63F1cCB9D31392b3B2F09e48",
        "OIAndPnLManager": "0x9E7bE500Eab41075cc4A1490841C4067439252CD",
        "CMPLiabilityManager": "0x5Ec9a8D0C2729a617a1784E6b2f3e255e8c0b9D3",
        "CMPLiabilityController": "0x5Ec9a8D0C2729a617a1784E6b2f3e255e8c0b9D3",
        "CMPLiabilityInterestManager": "0xeF4fc7140268901a8AE99420c7B74856E56067Ac",
        "CMPAutoRepayManager": "0x6E55c4642E1B37590D7A9AAc3194c7A12B4A5D42",
        "Trading": "0x6BB0e6602294680EB7CA3aE554dC1aBF5BeF7170",
        "CLPriceVerifierHelper": "0xE8Bd846CCF0Dc3b0F9056c5cC7833bbfD868D3e2",
        "IMPController": "0x0EEc98d4cF007e404e9B963313A5fE47e5c5A45D",
        "CMPController": "0x77e552f6acbAbb249c9C738259f4fb412187754B",
        "FeeManager": "0xc0Cb3895C96AF623Ce79E1d30A0c4e9F2809F7ED",
        "SpreadManager": "0x35D3645019Ff79D0C5E931eb96c216a3a4bA3ed8",
        "Logger": "0x6BCc41d5A1d341C46eF1f9b425fC436067022B8b"
    },
    "Earn": {
        "Vault": {
            "DAI": "0x839bd00df04A9b7940dd8F3E07ef72FC05Bf6E8c",
            "USDT": "0x5e93c288994B10840CdfA7b99a730CD07c45B3F4",
            "WETH": "0x2a2eDFBbeD0E3a7B8F0c00f6Af3AD3eE9485Ef00",
            "WBTC": "0xAE688F15020B28BD35D8EE0a724bb50ABBa63aF4"
        },
        "NFTManager": {
            "DAI": "0x629a78988216599ff7C7740a099C639554157eF1",
            "USDT": "0x309c44da12Eb691B4B4dcD31e7ABdd7F403895cf",
            "WETH": "0x1B5ED7Ae538bC7A395888b24257643cdc290A06d",
            "WBTC": "0xEf2f32d460142C8e37917d3b10B131985574cF27"
        }
    }
};

export default ContractAddressConfig_BaseSepolia_TestVersion;
