const ContractAddressConfig_ArbitrumSepolia_TestVersion = {
    etherscan: 'https://sepolia.arbiscan.io',
    etherscanAPI: 'https://api-sepolia.arbiscan.io',
    subgraph: 'https://api.studio.thegraph.com/query/69782/drx_exchange/v0.0.9.9.2.15',
    instruments: [
        {
            id: 1,
            name: `WETH-USDT-USDT`,
            tokens: {
                baseCcy: '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
                quoteCcy: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
                settleCcy: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
            },
        },
        {
            id: 2,
            name: `WETH-USD-WETH`,
            tokens: {
                baseCcy: '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
                quoteCcy: '0x0000000000000000000000000000000000000000',
                settleCcy: '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
            },
        },
        {
            id: 3,
            name: `WBTC-USDT-USDT`,
            tokens: {
                baseCcy: '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
                quoteCcy: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
                settleCcy: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
            },
        },
        {
            id: 4,
            name: `WBTC-USD-WBTC`,
            tokens: {
                baseCcy: '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
                quoteCcy: '0x0000000000000000000000000000000000000000',
                settleCcy: '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
            },
        },
    ],
    allSettleCcy: [
        '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
        '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
        '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
    ],
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        USDC: '0x0379DcbD13a69d41021075b88cF65b6C7EE0429B',
        ARB: '0x91fcF4AAA4C42FdbF34Ba868B653b26C7c3c3F51',
        WETH: '0x5528445f971bDF9908Cf363Be84afc9Df33dCFf1',
        WBTC: '0x9C7A44a7e59AACBCBdb5800C306318E430F7E28b',
        USDT: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
        DAI: '0x16306593BE20EA1D499261081b8040e3F675FECE',
    },
    chinlinkFeedId: {
        WETH: '0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b',
        WBTC: '0x00020ffa644e6c585a5bec0e25ca476b9538198259e22b6240957720dcba0e14',
        USDT: '0x000216e69b26a7c5716333fe0fddd1d2d468193b6ea9083ca926be71046f08b1',
    },

    "TradingMeta": {
        "IsolatedMarginPortfolioFactory": "0x5F05F02eCb133c4F4009b8BEbDb3dc8FDE708a7C",
        "CrossMarginPortfolioFactory": "0x4658F4893Df4875DDB50A9DA7F3A7a2Dd5d33A85",
        "Instrument": "0x71cdf45B20eC76e1e3d1a1B3F4f7912cD6c01461",
        "PriceAggregator": "0xE3a3291262E31f02fCE34FC0741681f193d46EB3",
        "CrossMarginPortfolioController": "0xDa8DAFe7b96d473D98073b78d70f1b995F89Bd2C",
        "PortfolioLibrary": "0xbccF082ab7EDffBF110Dcf8caD6c162bA7eD47e4",
        "PortfolioLibraryExternal": "0xa6dcfbc71240074f44D50f35701273a570c1c663",
        "RiskController": "0xe7e82C1AF18e9464e71F47F66813F55267FFC18E",
        "OIAndPnLManager": "0x6714A9905784B8537Ff067721267f805A4195458",
        "CMPLiabilityManager": "0x107dE5599Bdf61f89b3CcD16dB755B9e1Da34f7e",
        "CMPLiabilityController": "0x107dE5599Bdf61f89b3CcD16dB755B9e1Da34f7e",
        "CMPLiabilityInterestManager": "0x12b0a9e8ac22db970351Ad5f4021B43FbA34e0cd",
        "CMPAutoRepayManager": "0xa766ADB208c999B4477aCE0EcA65db7be59dff8C",
        "Trading": "0x617FC2e5EA19EFfa9ba02a68fa1d6F638efC9D47",
        "CLPriceVerifierHelper": "0x444EeEaAD6f77130F008740896dDE8C7b98580D8",
        "IMPController": "0x2d63E0Fda5188157f47111069C8B540B7a1Ad4DD",
        "CMPController": "0xDa8DAFe7b96d473D98073b78d70f1b995F89Bd2C",
        "FeeManager": "0x7b05934C28144205c0bEb0D323828d47211E9D3d",
        "SpreadManager": "0x34B0258847fA4d1F7630310912eEB5e9AA0bd089"
    },
    "Earn": {
        "Vault": {
            "DAI": "0x839bd00df04A9b7940dd8F3E07ef72FC05Bf6E8c",
            "USDT": "0x2Be19159D0003C91bc28E5005f3A66d849957234",
            "WETH": "0x1C752f81DE71434fe53863F3f360416A132c3458",
            "WBTC": "0xE134eB5d37e863891e4Bc673A0271874C3668c54"
        },
        "NFTManager": {
            "DAI": "0x629a78988216599ff7C7740a099C639554157eF1",
            "USDT": "0x6c922f9C2F1C81B6f24180385781AB79747BF886",
            "WETH": "0x0898443f93B278AaE32F55861fd561E5f5727aAD",
            "WBTC": "0x5E9c6c0Dd979E4bD7328e17c8E657e52f9fFc1D9"
        }
    }
};

export default ContractAddressConfig_ArbitrumSepolia_TestVersion;
