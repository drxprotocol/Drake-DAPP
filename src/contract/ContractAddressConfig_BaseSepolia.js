const ContractAddressConfig_BaseSepolia = {
    etherscan: 'https://sepolia.basescan.org',
    etherscanAPI: 'https://api-sepolia.basescan.org',
    subgraph: 'https://api.studio.thegraph.com/query/69782/drx_exchange/v0.0.9.15.4.2',
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        USDC: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
        ARB: '0x91fcF4AAA4C42FdbF34Ba868B653b26C7c3c3F51',
        WETH: '0x874F29f131Cb0A49cCA9613c53D431c73f9C5991',
        WBTC: '0x2FDcB26e3b65446732cB1f77523E0fBCFd6DB519',
        USDT: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
        DAI: '0x16306593BE20EA1D499261081b8040e3F675FECE',
    },

    "TradingMeta": {
        "IsolatedMarginPortfolioFactory": "0xa92E98871cf6b185f936Da8b0e36FC3726786515",
        "CrossMarginPortfolioFactory": "0xEF5FaC5bB2bd4Bc7F3d414EA481CfcEb3a8A18bc",
        "Instrument": "0x7Bf575d308A4B25eE06B9463e87be9fbEf7b3100",
        "PriceAggregator": "0x5b9EB4499D68A78431fCD5a5B9b7dd83A8a70Ff2",
        "CrossMarginPortfolioController": "0xCAB9921D9656F87bcD1cE981DcEC6FedAd9fD495",
        "PortfolioLibrary": "0x2844C60b1Cb64A8deCFc73984bB8e698162aA43A",
        "PortfolioLibraryExternal": "0x42122cAF667A013d1B836dF99060337D96ead3dF",
        "RiskController": "0x801117840C0c7A6D84F92E28ba8FCBdeb0a7a0c3",
        "OIAndPnLManager": "0xf4646D41105F036EEfFd4dE4020199FF7CF22153",
        "CMPLiabilityManager": "0xDeB8E4BcBF5699D87fA892fe7DB73f794c5C1d9C",
        "CMPLiabilityController": "0xDeB8E4BcBF5699D87fA892fe7DB73f794c5C1d9C",
        "CMPLiabilityInterestManager": "0x231978c4Db0B25C67F99592f66da2df7CeA84645",
        "CMPAutoRepayManager": "0xA8289c1C5904d631FD62f298Ec981eA8A79a93a0",
        "Trading": "0x069e7dD38398e31c3F52B79F30D22acB50423887",
        "CLPriceVerifierHelper": "0x15D2d090B41b457ACe6A40F3B2c522425D67BEe1",
        "IMPController": "0x0b6BD6467ee3C8d4b1397bbD68b5bd707c8a9BBB",
        "CMPController": "0xCAB9921D9656F87bcD1cE981DcEC6FedAd9fD495",
        "FeeManager": "0x0960B5FBBec1AfB31D7A6D2024EE42c731c80d43",
        "SpreadManager": "0x81c3Ba724E4A8192023c6aCA0A85D1000931DA76",
        "Logger": "0x4097e02b404328C70e3933219d670B0B45768506"
    },
    "Earn": {
        "Vault": {
            "USDC": "0x0234a6c23Dc8FeEeCfC839A8C27255A9339514cf"
        },
        "FundingRateVault": {
            "USDC": "0xB2c46B6905Ab51688DEE3f3DF808242b2c8fe527"
        },
        "NFTManager": {
            "USDC": "0x28Ddb358B4AA68B29B06651499a2B7473BA7f426"
        }
    }
};

export default ContractAddressConfig_BaseSepolia;
