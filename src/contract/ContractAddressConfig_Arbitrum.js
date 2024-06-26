const ContractAddressConfig_Arbitrum = {
    etherscan: 'https://arbiscan.io',
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        WETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        ARB: '0x912ce59144191c1204e64559fe8253a0e49e6548',
        USDT: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    },

    TradingMeta: {
        IsolatedMarginPortfolioFactory: '',
        CrossMarginPortfolioFactory: '',
        PriceAggregator: '',
        Instrument: '',
        CrossMarginPortfolioController: '',
        PortfolioLibrary: '',
        RiskController: '',
    },

    Earn: {
        Vault: {
            USDT: '',
            DAI: '',
        },
        NFTManager: {
            USDT: '',
            DAI: '',
        },
    },
};

export default ContractAddressConfig_Arbitrum;
