import { ethers } from 'ethers';

const RPC_URL_Mapping = {
    RPCForArbitrumMainnet: 'https://arb1.arbitrum.io/rpc',
    RPCForArbitrumMainnet_Write: 'https://arb1.arbitrum.io/rpc',
    RPCForArbitrumMainnetLocalForkNet: 'http://127.0.0.1:8545',
    RPCForArbitrumMainnetForkServerNet: 'https://fork-rpc.drx.exchange',
    RPCForArbitrumGoerliTestNet: 'https://goerli-rollup.arbitrum.io/rpc',
    RPCForArbitrumGoerliLocalForkNet: 'http://127.0.0.1:8545',
    RPCForArbitrumHardhatLocalForkNet: 'http://127.0.0.1:8545',
    RPCForArbitrumHardhatForkServerNet: 'https://fork-rpc.drx.exchange',
    RPCForArbitrumSepoliaTestNet: import.meta.env.VITE_RPC_ARBITRUM_SEPOLIA || 'https://sepolia-rollup.arbitrum.io/rpc',
    RPCForArbitrumSepoliaLocalForkNet: 'http://127.0.0.1:8545',
    RPCForBaseSepoliaTestNet: import.meta.env.VITE_RPC_BASE_SEPOLIA || 'https://sepolia.base.org',
};
const provider = window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : new ethers.providers.JsonRpcProvider(RPC_URL_Mapping.RPCForArbitrumMainnet);

const defaultMulticall3ContractOnArbitrum = {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 7654707,
};
const defaultMulticall3ContractOnArbitrumGoerli = {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 88114,
};
const defaultMulticall3ContractOnArbitrumSepolia = {
    address: '0xCAF26D128313f9B916417BABaca905534aEfd9ba',
    blockCreated: 2997784,
};
const defaultMulticall3ContractOnBaseSepolia = {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 1059647,
};

export default {
    provider,

    enableAAWallet: true,
    enableCoinbaseAAWallet: false,

    RPCForArbitrumMainnet: RPC_URL_Mapping.RPCForArbitrumMainnet,
    RPCForArbitrumMainnetLocalForkNet: RPC_URL_Mapping.RPCForArbitrumMainnetLocalForkNet,
    RPCForArbitrumMainnetForkServerNet: RPC_URL_Mapping.RPCForArbitrumMainnetForkServerNet,
    RPCForArbitrumGoerliTestNet: RPC_URL_Mapping.RPCForArbitrumGoerliTestNet,
    RPCForArbitrumGoerliLocalForkNet: RPC_URL_Mapping.RPCForArbitrumGoerliLocalForkNet,
    RPCForArbitrumHardhatLocalForkNet: RPC_URL_Mapping.RPCForArbitrumHardhatLocalForkNet,
    RPCForArbitrumHardhatForkServerNet: RPC_URL_Mapping.RPCForArbitrumHardhatForkServerNet,
    RPCForArbitrumSepoliaTestNet: RPC_URL_Mapping.RPCForArbitrumSepoliaTestNet,
    RPCForArbitrumSepoliaLocalForkNet: RPC_URL_Mapping.RPCForArbitrumSepoliaLocalForkNet,
    RPCForBaseSepoliaTestNet: RPC_URL_Mapping.RPCForBaseSepoliaTestNet,

    defaultChain: {
        id: 42161,
        code: '0xa4b1',
        name: 'Arbitrum Mainnet',
        chainId: 42161,
        chainName: 'Arbitrum Mainnet',
        isTestChain: false,
        isLocalChain: false,
        multicallAddress: '0x8a0bd1773139C6609e861B9ab68082587a3cD581',
        multicall2Address: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
        multicall3: defaultMulticall3ContractOnArbitrum,
        getExplorerAddressLink: (address) => `https://arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://arbiscan.io/tx/${transactionHash}`,
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumMainnet,
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://arbiscan.io/'],
        provider: RPC_URL_Mapping.RPCForArbitrumMainnet,
        partnerChainID: 1,
    },
    defaultChainForDev: {
        chainId: 421609,
        chainName: 'ARB Fork Server',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x8a0bd1773139C6609e861B9ab68082587a3cD581',
        multicall2Address: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
        multicall3: defaultMulticall3ContractOnArbitrum,
        getExplorerAddressLink: (address) => `https://arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumMainnetForkServerNet,
        blockExplorerUrl: 'https://arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForLocalForkNet: {
        chainId: 421610,
        chainName: 'Arbitrum Fork',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x8a0bd1773139C6609e861B9ab68082587a3cD581',
        multicall2Address: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
        multicall3: defaultMulticall3ContractOnArbitrum,
        getExplorerAddressLink: (address) => `https://arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumMainnetLocalForkNet,
        blockExplorerUrl: 'https://arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForGoerliTestNet: {
        chainId: 421613,
        chainName: 'Arbitrum Goerli',
        isTestChain: true,
        isLocalChain: false,
        multicallAddress: '0x001dc0E62bed74947Deb38D53c416dB4C61B9473',
        multicall2Address: '0x430806E43bAAc55DDADAfC06d9905955EB83e267',
        multicall3: defaultMulticall3ContractOnArbitrumGoerli,
        getExplorerAddressLink: (address) => `https://goerli.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://goerli.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumGoerliTestNet,
        blockExplorerUrl: 'https://goerli.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForLocalGoerliLocalForkNet: {
        chainId: 4216130,
        chainName: 'Arbitrum Goerli Fork',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x001dc0E62bed74947Deb38D53c416dB4C61B9473',
        multicall2Address: '0x430806E43bAAc55DDADAfC06d9905955EB83e267',
        multicall3: defaultMulticall3ContractOnArbitrumGoerli,
        getExplorerAddressLink: (address) => `https://goerli.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://goerli.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumGoerliLocalForkNet,
        blockExplorerUrl: 'https://goerli.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForHardHatLocalForkNet: {
        chainId: 31415,
        chainName: 'Hardhat Fork',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x001dc0E62bed74947Deb38D53c416dB4C61B9473',
        multicall2Address: '0x430806E43bAAc55DDADAfC06d9905955EB83e267',
        multicall3: defaultMulticall3ContractOnArbitrumGoerli,
        getExplorerAddressLink: (address) => `https://goerli.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://goerli.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumHardhatLocalForkNet,
        blockExplorerUrl: 'https://goerli.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForHardHatForkServerNet: {
        chainId: 314159,
        chainName: 'Hardhat Fork Server',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x001dc0E62bed74947Deb38D53c416dB4C61B9473',
        multicall2Address: '0x430806E43bAAc55DDADAfC06d9905955EB83e267',
        multicall3: defaultMulticall3ContractOnArbitrumGoerli,
        getExplorerAddressLink: (address) => `https://goerli.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://goerli.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumHardhatForkServerNet,
        blockExplorerUrl: 'https://goerli.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForSepoliaTestNet: {
        chainId: 421614,
        chainName: 'Arbitrum Sepolia',
        isTestChain: true,
        isLocalChain: false,
        multicallAddress: '0x06759Aa00cB9f12dA8d0c832f2D8BdBBA6F38499',
        multicall2Address: '0x5D807B252430b4377C0a2637d9B6c9f381B38c55',
        multicall3: defaultMulticall3ContractOnArbitrumSepolia,
        getExplorerAddressLink: (address) => `https://sepolia.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://sepolia.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumSepoliaTestNet,
        blockExplorerUrl: 'https://sepolia.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForLocalSepoliaForkNet: {
        chainId: 4216140,
        chainName: 'Arbitrum Sepolia Fork',
        isTestChain: true,
        isLocalChain: true,
        multicallAddress: '0x06759Aa00cB9f12dA8d0c832f2D8BdBBA6F38499',
        multicall2Address: '0x5D807B252430b4377C0a2637d9B6c9f381B38c55',
        multicall3: defaultMulticall3ContractOnArbitrumSepolia,
        getExplorerAddressLink: (address) => `https://sepolia.arbiscan.io/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://sepolia.arbiscan.io/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForArbitrumSepoliaLocalForkNet,
        blockExplorerUrl: 'https://sepolia.arbiscan.io',
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },
    chainConfigForBaseSepoliaTestNet: {
        chainId: 84532,
        chainName: 'Base Sepolia',
        isTestChain: true,
        isLocalChain: false,
        multicallAddress: '0x1b39523b4016f8898EE41aC1a6B2BD7186C6cdAE',
        multicall2Address: '0xF82D64357D9120a760e1E4C75f646C0618eFc2F3',
        multicall3: defaultMulticall3ContractOnBaseSepolia,
        getExplorerAddressLink: (address) => `https://sepolia.basescan.org/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://sepolia.basescan.org/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForBaseSepoliaTestNet,
        blockExplorerUrl: 'https://sepolia.basescan.org',
        nativeCurrency: {
            name: 'Base ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },

    walletConnectStrategy: {
        none: 'none',
        useDapp: 'useDapp',
        rainbowKit: 'rainbowkit',
    },

    aaRecoveryURI: 'https://recovery.zerodev.app/',

    tokenListURIUniswap: 'https://tokens.uniswap.org',

    emptyContractAddress: '0x0000000000000000000000000000000000000000',
    maxAmountOnChain: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',

    expandTokens: [],

    blockedRegions: [
        // United States,
        'US',

        // Syrian Arab Republic,
        'SY',

        // North Korea,
        'KP',

        // Iran,
        'IR',

        // Russia,
        'RU',

        // Puerto Rico,
        'PR',

        // Myanmar,
        'MM',

        // Ivory Coast,
        'CI',

        // China Mainland,
        'CN',

        // Hongkong
        'HK',

        // Cuba,
        'CU',

        // Congo,
        'CD',

        // Iraq,
        'IQ',

        // Libya,
        'LY',

        // Mali,
        'ML',

        // Nicaragua,
        'NI',

        // Somalia,
        'SO',

        // Sudan,
        'SD',

        // Yemen,
        'YE',

        // Zimbabwe,
        'ZW',

        // Belize
        'BZ',

    ],

    // defaultApproveAllowance: '1000000000000000000',
    defaultApproveAllowance: '10000000000000000000000000000',
    defaultApproveAllowanceTokenAmount: '10000000',
    // defaultApproveThreshold: '100000000000000000000000000',
    defaultApproveThreshold: '1000000000000000000000',

    defaultETHBalanceThreshold: '10000000000000000',

    maxNumberPickerValue: 9999999999,
    defaultDebounceWait: 1000,

    defaultSubgraphPageSize: 1000,
    defaultOrderHistoryPageSize: 20,
    defaultAssetHistoryPageSize: 20,

    defaultTimeoutToCloseTXWindow: 5000,
    defaultTimeoutToDoubleCheckOrderState: 30000,

    popupWindowWidth: 576,
    popupSmallWindowWidth: 420,
    popupWindowWidthForLiquidity: 620,

    comingSoon: false,
};
