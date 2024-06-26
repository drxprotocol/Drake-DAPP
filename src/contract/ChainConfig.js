import ApplicationConfig from '../ApplicationConfig';
import {http} from "viem";

export const ArbitrumGoerliChain = ApplicationConfig.chainConfigForGoerliTestNet;
export const ArbitrumGoerliForkChain = ApplicationConfig.chainConfigForLocalGoerliLocalForkNet;
export const ArbitrumHardhatForkChain = ApplicationConfig.chainConfigForHardHatLocalForkNet;
export const ArbitrumHardhatForkServerChain = ApplicationConfig.chainConfigForHardHatForkServerNet;
export const ArbitrumSepoliaChain = ApplicationConfig.chainConfigForSepoliaTestNet;
export const ArbitrumSepoliaForkChain = ApplicationConfig.chainConfigForLocalSepoliaForkNet;
export const BaseSepoliaTestChain = ApplicationConfig.chainConfigForBaseSepoliaTestNet;
export const ArbitrumForkChain = ApplicationConfig.chainConfigForLocalForkNet;
export const ArbitrumForkServerChain = ApplicationConfig.defaultChainForDev;
// export const DefaultChain = ApplicationConfig.defaultChain;
export const DefaultChain = ApplicationConfig.chainConfigForBaseSepoliaTestNet;

// export const SupportedCustomChains = [ArbitrumForkChain, ArbitrumForkServerChain, ArbitrumGoerliForkChain, ArbitrumHardhatForkChain, ArbitrumHardhatForkServerChain, ArbitrumSepoliaForkChain];
export const SupportedCustomChains = [ArbitrumForkChain, ArbitrumSepoliaForkChain, ArbitrumForkServerChain];
export const SupportedExtraChains = [ArbitrumSepoliaChain, BaseSepoliaTestChain];
// export const SupportedChains = [DefaultChain, ...SupportedExtraChains, ...SupportedCustomChains];
export const SupportedChains = [DefaultChain];

export const DemoTradingChains = [ArbitrumGoerliChain.chainId, ArbitrumGoerliForkChain.chainId, ArbitrumHardhatForkChain.chainId, ArbitrumHardhatForkServerChain.chainId, ArbitrumSepoliaChain.chainId, ArbitrumSepoliaForkChain.chainId, BaseSepoliaTestChain.chainId];

export const isSupportedChain = (chainId) => {
    let filter = SupportedChains.filter(chainConfig => {
        return chainConfig.chainId === chainId;
    });

    return filter.length > 0;
};

export const querySupportedChain = (chainId) => {
    let filter = SupportedChains.filter(chainConfig => {
        return chainConfig.chainId === chainId;
    });

    return filter.length > 0 ? filter[0] : null;
};

export function toMainnetChainId(chainId) {
    let _chainId = chainId;
    switch (chainId) {
        case 421613:
        case 4216130:
        case 421610:
        case 421609:
        case 31415:
        case 314159:
        case 421614:
        case 4216140:
            _chainId = 42161;
            break;
        case 10:
            _chainId = 1;
            break;
        default:
            _chainId = 42161;
    }
    return _chainId;
}

export const ChainIdMap = {
    ethereum: 1,
    arbitrum: 42161,
    'arbitrum-one': 42161,
    'arbitrum-fork': 421610,
    'arbitrum-fork-server': 421609,
};

export const ChainLocalNameMap = {
    1: {
        dappLocalName: 'Ethereum',
        coingeckoLocalName: 'ethereum',
        chainCode: 'ethereum',
    },
    42161: {
        dappLocalName: 'Arbitrum',
        coingeckoLocalName: 'arbitrum-one',
        chainCode: 'arbitrum-one',
    },
    421610: {
        dappLocalName: 'Arbitrum Fork',
        coingeckoLocalName: 'arbitrum-one',
        chainCode: 'arbitrum-one',
    },
    421609: {
        dappLocalName: 'ARB Fork Server',
        coingeckoLocalName: 'arbitrum-one',
        chainCode: 'arbitrum-one',
    },
    [ArbitrumSepoliaChain.chainId]: {
        dappLocalName: 'Arbitrum Sepolia',
        coingeckoLocalName: 'arbitrum-sepolia',
        chainCode: 'arbitrum-sepolia',
    },
    [ArbitrumSepoliaForkChain.chainId]: {
        dappLocalName: 'ARB Sepolia Fork',
        coingeckoLocalName: 'arbitrum-sepolia',
        chainCode: 'arbitrum-sepolia',
    },
    [BaseSepoliaTestChain.chainId]: {
        dappLocalName: 'Base Sepolia',
        coingeckoLocalName: 'base-sepolia',
        chainCode: 'base-sepolia',
    },
};

export const convertToWagmiChain = (chainConfig) => {
    let chain = {
        id: chainConfig.chainId,
        name: chainConfig.chainName,
        network: chainConfig.chainName,
        nativeCurrency: chainConfig.nativeCurrency,
        rpcUrls: {
            default: {
                http: [chainConfig.rpcUrl]
            },
            public: {
                http: [chainConfig.rpcUrl]
            }
        },
        blockExplorers: {
            etherscan: {name: "etherscan", url: chainConfig.blockExplorerUrl},
            default: {name: "etherscan", url: chainConfig.blockExplorerUrl}
        },
        contracts: {
            multicall3: chainConfig.multicall3
        }
    };

    return chain;
};

export const buildSupportedWagmiChains = () => {
    let chains = SupportedChains.map(config => {
        return convertToWagmiChain(config);
    });
    return chains;
};

export const buildSupportedWagmiChainsTransports = () => {
    let transports = {};
    SupportedChains.forEach(config => {
        transports[config.chainId] = http();
    });
    return transports;
};

export const checkBaseNetwork = (chainId) => {
    return chainId === BaseSepoliaTestChain.chainId;
};