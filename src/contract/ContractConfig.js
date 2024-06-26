/**
 * @Author: DAPP
 * @Date:   2021-06-17 15:43:43
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-07-12 21:05:43
 */
import ApplicationConfig from '../ApplicationConfig';
import ContractAddressConfig_Mainnet from './ContractAddressConfig_Mainnet';
import ContractAddressConfig_Arbitrum from './ContractAddressConfig_Arbitrum';
import ContractAddressConfig_ArbitrumFork from './ContractAddressConfig_ArbitrumFork';

import ERC20Token_abi from './abi/ERC20Token_abi';
import TestERC20Token_abi from "./abi/TestERC20Token_abi";
import Instrument_abi from "./abi/Instrument_abi";
import PriceAggregator_abi from "./abi/PriceAggregator_abi";
import IsolatedMarginPortfolioFactory_abi from "./abi/IsolatedMarginPortfolioFactory_abi";
import IsolatedMarginPortfolio_abi from "./abi/IsolatedMarginPortfolio_abi";
import CrossMarginPortfolioFactory_abi from "./abi/CrossMarginPortfolioFactory_abi";
import CrossMarginPortfolio_abi from "./abi/CrossMarginPortfolio_abi";
import CrossMarginPortfolioController_abi from "./abi/CrossMarginPortfolioController_abi";
import ContractAddressConfig_ArbitrumGoerli from "./ContractAddressConfig_ArbitrumGoerli";
import ContractAddressConfig_ArbitrumGoerliFork from "./ContractAddressConfig_ArbitrumGoerliFork";
import ContractAddressConfig_ArbitrumGoerliFork_local from "./ContractAddressConfig_ArbitrumGoerliFork_local";
import ContractAddressConfig_ArbitrumSepolia from "./ContractAddressConfig_ArbitrumSepolia";
import ContractAddressConfig_ArbitrumSepolia_TestVersion from "./ContractAddressConfig_ArbitrumSepolia_TestVersion";
import ContractAddressConfig_BaseSepolia from "./ContractAddressConfig_BaseSepolia";
import ContractAddressConfig_BaseSepolia_TestVersion from "./ContractAddressConfig_BaseSepolia_TestVersion";
import PortfolioLibrary_abi from "./abi/PortfolioLibrary_abi";
import RiskController_abi from "./abi/RiskController_abi";
import ContractAddressConfig_ArbitrumGoerliHardhatFork from "./ContractAddressConfig_ArbitrumGoerliHardhatFork";
import Vault_abi from "./abi/Vault_abi";
import FundingRateVault_abi from "./abi/FundingRateVault_abi";
import VaultNFTManager_abi from "./abi/VaultNFTManager_abi";
import {getLocalStorage} from "../utils/LocalStorage";
import CMPLiabilityManager_abi from "./abi/CMPLiabilityManager_abi";
import Trading_abi from "./abi/Trading_abi";
import FeeManager_abi from "./abi/FeeManager_abi";
import CMPAutoRepayManager_abi from "./abi/CMPAutoRepayManager_abi";
import CMPController_abi from "./abi/CMPController_abi";
import OIAndPnLManager_abi from "./abi/OIAndPnLManager_abi";
import PortfolioLibraryExternal_abi from "./abi/PortfolioLibraryExternal_abi";

const contractOnArbitrumSepolia = import.meta.env.VITE_ENABLE_TEST_CONTRACT_VERSION === 'true' ? ContractAddressConfig_ArbitrumSepolia_TestVersion : ContractAddressConfig_ArbitrumSepolia;
const contractOnBaseSepolia = import.meta.env.VITE_ENABLE_TEST_CONTRACT_VERSION === 'true' ? ContractAddressConfig_BaseSepolia_TestVersion : ContractAddressConfig_BaseSepolia;
const ChainAddressMap = {
    0: {
        name: 'Mainnet',
        addressConfig: ContractAddressConfig_Mainnet,
    },
    1: {
        name: 'Mainnet',
        addressConfig: ContractAddressConfig_Mainnet,
    },
    42161: {
        name: 'Arbitrum',
        addressConfig: ContractAddressConfig_Arbitrum,
    },
    '0xa4b1': {
        name: 'Arbitrum',
        addressConfig: ContractAddressConfig_Arbitrum,
    },
    421610: {
        name: 'ArbitrumFork',
        addressConfig: ContractAddressConfig_ArbitrumFork,
    },
    '0x66eea': {
        name: 'ArbitrumFork',
        addressConfig: ContractAddressConfig_ArbitrumFork,
    },
    421609: {
        name: 'ARB Fork Server',
        addressConfig: ContractAddressConfig_ArbitrumFork,
    },
    '0x66ee9': {
        name: 'ARB Fork Server',
        addressConfig: ContractAddressConfig_ArbitrumFork,
    },
    421613: {
        name: 'ARB Goerli',
        addressConfig: ContractAddressConfig_ArbitrumGoerli,
    },
    '0x66eed': {
        name: 'ARB Goerli',
        addressConfig: ContractAddressConfig_ArbitrumGoerli,
    },
    4216130: {
        name: 'Goerli Fork',
        addressConfig: ContractAddressConfig_ArbitrumGoerliFork,
        // addressConfig: ContractAddressConfig_ArbitrumGoerliFork_local,
    },
    '0x405542': {
        name: 'Goerli Fork',
        addressConfig: ContractAddressConfig_ArbitrumGoerliFork,
        // addressConfig: ContractAddressConfig_ArbitrumGoerliFork_local,
    },
    31415: {
        name: 'Hardhat Fork',
        addressConfig: ContractAddressConfig_ArbitrumGoerliHardhatFork,
    },
    '0x7ab7': {
        name: 'Hardhat Fork',
        addressConfig: ContractAddressConfig_ArbitrumGoerliHardhatFork,
    },
    314159: {
        name: 'Hardhat Fork Server',
        addressConfig: ContractAddressConfig_ArbitrumGoerliHardhatFork,
    },
    '0x4cb2f': {
        name: 'Hardhat Fork Server',
        addressConfig: ContractAddressConfig_ArbitrumGoerliHardhatFork,
    },
    421614: {
        name: 'ARB Sepolia',
        addressConfig: contractOnArbitrumSepolia,
    },
    '0x66eee': {
        name: 'ARB Sepolia',
        addressConfig: contractOnArbitrumSepolia,
    },
    4216140: {
        name: 'Sepolia Fork',
        addressConfig: contractOnArbitrumSepolia,
        // addressConfig: ContractAddressConfig_ArbitrumSepoliaFork_local,
    },
    '0x40554c': {
        name: 'Sepolia Fork',
        addressConfig: contractOnArbitrumSepolia,
        // addressConfig: ContractAddressConfig_ArbitrumSepoliaFork_local,
    },
    84532: {
        name: 'Base Sepolia',
        addressConfig: contractOnBaseSepolia,
    },
    '0x14a34': {
        name: 'Base Sepolia',
        addressConfig: contractOnBaseSepolia,
    },
};

const CONTRACT_ADDRESS_CACHE_KEY = 'contract_address_local_cache';
const getChainAddress = (chainId) => {
    let _chainId = chainId || ApplicationConfig.defaultChain.id;
    let config = ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig;

    let cachedConfig = getLocalStorage(`${CONTRACT_ADDRESS_CACHE_KEY}_${chainId}`);
    if(cachedConfig){
        let mergedConfig = {
            ...cachedConfig,
            config
        };
        // console.debug(
        //     `config =>`, config,
        //     `cachedConfig =>`, cachedConfig,
        //     `mergedConfig =>`, mergedConfig,
        // );
        config = mergedConfig;
    }
    return config;
};

const ContractConfig = {
    etherscan: (chainId) => {
        let _chainId = chainId || ApplicationConfig.defaultChain.id;
        return ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig.etherscan;
    },
    etherscanAPI: (chainId) => {
        let _chainId = chainId || ApplicationConfig.defaultChain.id;
        return ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig.etherscanAPI;
    },
    subgraph: (chainId) => {
        let _chainId = chainId || ApplicationConfig.defaultChain.id;
        return ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig.subgraph;
    },
    asset: {
        ERC20: {
            name: 'ERC20 Token',
            abi: ERC20Token_abi,
        },
        TestERC20: {
            name: 'ERC20 Token',
            abi: TestERC20Token_abi,
        },
        /**
         * get asset config. e.g.:
         *      ContractConfig.asset.getAsset('SPA')
         *      ContractConfig.asset.getAsset('ETH-SPA@Uniswap')
         * @param name
         */
        getAsset: (name) => {
            if (name.indexOf('@') > 0) {
                let dexName = name.split('@')[1];
                return ContractConfig.asset[`LP_${dexName}`];
            } else {
                return ContractConfig.asset[name];
            }
        },
    },

    TradingMeta: {
        Instrument: {
            name: 'Instrument',
            abi: Instrument_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.Instrument;
            },
        },
        IsolatedMarginPortfolioFactory: {
            name: 'IsolatedMarginPortfolioFactory',
            abi: IsolatedMarginPortfolioFactory_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.IsolatedMarginPortfolioFactory;
            },
        },
        IsolatedMarginPortfolio: {
            name: 'IsolatedMarginPortfolio',
            abi: IsolatedMarginPortfolio_abi,
        },
        CrossMarginPortfolioController: {
            name: 'CrossMarginPortfolioController',
            abi: CrossMarginPortfolioController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CrossMarginPortfolioController;
            },
        },
        CrossMarginPortfolioFactory: {
            name: 'CrossMarginPortfolioFactory',
            abi: CrossMarginPortfolioFactory_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CrossMarginPortfolioFactory;
            },
        },
        CrossMarginPortfolio: {
            name: 'CrossMarginPortfolio',
            abi: CrossMarginPortfolio_abi,
        },
        PriceAggregator: {
            name: 'PriceAggregator',
            abi: PriceAggregator_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.PriceAggregator;
            },
        },
        PortfolioLibrary: {
            name: 'PortfolioLibrary',
            abi: PortfolioLibrary_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.PortfolioLibrary;
            },
        },
        PortfolioLibraryExternal: {
            name: 'PortfolioLibraryExternal',
            abi: PortfolioLibraryExternal_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.PortfolioLibraryExternal;
            },
        },
        RiskController: {
            name: 'RiskController',
            abi: RiskController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.RiskController;
            },
        },
        CMPLiabilityManager: {
            name: 'CMPLiabilityManager',
            abi: CMPLiabilityManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPLiabilityManager;
            },
        },
        CMPAutoRepayManager: {
            name: 'CMPAutoRepayManager',
            abi: CMPAutoRepayManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPAutoRepayManager;
            },
        },
        Trading: {
            name: 'Trading',
            abi: Trading_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.Trading;
            },
        },
        FeeManager: {
            name: 'FeeManager',
            abi: FeeManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.FeeManager;
            },
        },
        CMPController: {
            name: 'CMPController',
            abi: CMPController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPController;
            },
        },
        OIAndPnLManager: {
            name: 'OIAndPnLManager',
            abi: OIAndPnLManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.OIAndPnLManager;
            },
        },
    },

    Earn: {
        Vault: {
            name: 'Vault',
            abi: Vault_abi,
            address(chainId, vaultToken) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.Earn?.Vault[vaultToken];
            },
        },
        FundingRateVault: {
            name: 'FundingRateVault',
            abi: FundingRateVault_abi,
            address(chainId, vaultToken) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.Earn?.FundingRateVault[vaultToken];
            },
        },
        NFTManager: {
            name: 'NFTManager',
            abi: VaultNFTManager_abi,
            address(chainId, vaultToken) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.Earn?.NFTManager[vaultToken];
            },
        },
    },
};

export default ContractConfig;
