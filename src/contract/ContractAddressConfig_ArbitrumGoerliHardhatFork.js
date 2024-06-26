const ContractAddressConfig_ArbitrumGoerliHardhatFork = {
    etherscan: 'https://goerli.arbiscan.io',
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        USDC: '0x10582b8a9fDcc50916f0B270cB3596BF02a29B9e',
        ARB: '0xdF3C95d3605860105e4ae56f2ab343A9E655AD44',
        WETH: '0x96c93F584fdAeb1ddC9CdBA23671A26EDbB45603',
        WBTC: '0x98342D90682Ef404b58e8E5daAC830D37dE85c14',
        USDT: '0x3aFe83A37A74F7AAAfDDe789c645CAa13dFb672a',
        DAI: '0x8E4a24cA240e03DC0A744336648067e22d483465',
    },

    TradingMeta: {
        IsolatedMarginPortfolioFactory: '0x1BE0aB96D59FD814A512cF7F3011247aB681e36E',
        CrossMarginPortfolioFactory: '0x5561dcD16a5D4a6669A489d5CC8225a0E34D11a2',
        PriceAggregator: '0x6E67aF551599C70D6511c42324Fb748DDBe48E08',
        Instrument: '0x91E0Cb20e5070BDC848D689e00EaE794052f4Fc4',
        CrossMarginPortfolioController: '0xf91C275028315431320b3ffab065F510A9234FF0',
        PortfolioLibrary: '0x751578d869C3ce790d90485E2eb9CdD287bf3B52',
        RiskController: '0xBbcB1348166eb28746e61A3A38358a83592EaB2C',
    },

    Earn: {
        Vault: {
            USDT: '0x68dF9bbd845839D926169A4623BdE15CE65D7957',
            DAI: '0x839bd00df04A9b7940dd8F3E07ef72FC05Bf6E8c',
        },
        NFTManager: {
            USDT: '0xaB5555D32BfAF310E0b749FC7A7279EE74bA5E76',
            DAI: '0x629a78988216599ff7C7740a099C639554157eF1',
        },
    },
};

export default ContractAddressConfig_ArbitrumGoerliHardhatFork;
