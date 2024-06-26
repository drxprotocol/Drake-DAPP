const ContractAddressConfig_ArbitrumFork = {
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
        IsolatedMarginPortfolioFactory: '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87',
        CrossMarginPortfolioFactory: '0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6',
        PriceAggregator: '0xE7eD6747FaC5360f88a2EFC03E00d25789F69291',
        Instrument: '0xcCB53c9429d32594F404d01fbe9E65ED1DCda8D9',
        CrossMarginPortfolioController: '0x30375B532345B01cB8c2AD12541b09E9Aa53A93d',
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

export default ContractAddressConfig_ArbitrumFork;
