import ApplicationConfig from '../ApplicationConfig';
import { getLocalStorage, saveToLocalStorage } from '../utils/LocalStorage';
import ContractAddressConfig_Arbitrum from './ContractAddressConfig_Arbitrum';
import ContractAddressConfig_Mainnet from './ContractAddressConfig_Mainnet';
import ETHLogo from '../components/Coin/img/token_eth.svg';
import USDLogo from '../components/Coin/img/token_usd.svg';
import WETHLogo from '../components/Coin/img/token_weth.svg';
import WBTCLogo from '../components/Coin/img/token_btc_1.svg';
import USDCLogo from '../components/Coin/img/token_usdc.svg';
import ARBLogo from '../components/Coin/img/token_arb.svg';
import USDTLogo from '../components/Coin/img/token_usdt.svg';
import DAILogo from '../components/Coin/img/token_dai.svg';

import {
    RATIO_DECIMALS,
    RATIO_TO_SHOW_DECIMALS,
    TRADING_ORDER_SIZE_DECIMALS,
    USD_VALUE_DECIMALS
} from "../components/TradingConstant";
import ContractAddressConfig_ArbitrumGoerli from "./ContractAddressConfig_ArbitrumGoerli";
import ContractAddressConfig_ArbitrumGoerliFork from "./ContractAddressConfig_ArbitrumGoerliFork";
import ContractAddressConfig_ArbitrumSepolia from "./ContractAddressConfig_ArbitrumSepolia";
import ContractAddressConfig_BaseSepolia from "./ContractAddressConfig_BaseSepolia";
import BigNumber from "bignumber.js";

const TOKEN_LOCAL_STORAGE_KEY = 'DAPP_TOKENS_IN_LOCAL_STORAGE';

export function getToken(_token, _chainId) {
    if (!_token) {
        return {};
    }

    let token = _token.toLocaleLowerCase();
    let chainId = _chainId || ApplicationConfig.defaultChain.id;
    let tokens = getLocalStorage(TOKEN_LOCAL_STORAGE_KEY);
    if (!tokens || !tokens[chainId] || !tokens[chainId][token]) {
        console.error(`The token[name=${_token}, chainId=${_chainId}] is not found!`);
        return (tokens && tokens[ApplicationConfig.defaultChain.id][token]) || {};
    }

    return tokens[chainId][token];
}

export function cacheToken({token, localName='', address, chainId, decimals=18, minAmountDecimals, priceDecimals=3, isNative=false}) {
    if (!token || !address) {
        console.error(`The token name and address can not be empty!`);
        return;
    }

    let _token = token.toLocaleLowerCase();
    let _localName = localName || token;
    let _decimals = decimals || 18;
    let _chainId = chainId || ApplicationConfig.defaultChain.id;

    let _exponent = minAmountDecimals === undefined ? _decimals : minAmountDecimals;
    let exponent = new BigNumber(10).pow(_exponent);
    let _minAmountDecimals = new BigNumber(1).div(exponent).toFixed();

    let contractConfig = {
        name: token,
        localName: _localName,
        address: address,
        chainId: _chainId,
        decimals: _decimals,
        minAmountDecimals: _minAmountDecimals,
        priceDecimals: priceDecimals,
        isNative: isNative ? true : false,
    };

    let cache = getLocalStorage(TOKEN_LOCAL_STORAGE_KEY) || {};
    let chainCache = cache[_chainId] || {};
    chainCache[_token] = contractConfig;
    chainCache[address.toLocaleLowerCase()] = contractConfig;
    cache[_chainId] = chainCache;

    saveToLocalStorage(TOKEN_LOCAL_STORAGE_KEY, cache);
}

export function cacheDefaultTokens() {
    let arbitrum = 42161;
    let arbitrumFork = 421610;
    let arbitrumForkServer = 421609;
    let arbitrumGoerli = 421613;
    let arbitrumGoerliFork = 4216130;
    let arbitrumHardhatFork = 31415;
    let arbitrumHardhatForkServer = 314159;
    let arbitrumSepolia = 421614;
    let arbitrumSepoliaFork = 4216140;
    let baseSepolia = 84532;
    let mainnet = 1;
    let mainnetFork = 10;


    cacheToken({token:'ETH', address:ContractAddressConfig_Arbitrum.asset.ETH, chainId:arbitrum, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_Arbitrum.asset.ETH, chainId:arbitrumFork, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_Arbitrum.asset.ETH, chainId:arbitrumForkServer, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumGoerli.asset.ETH, chainId:arbitrumGoerli, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ETH, chainId:arbitrumGoerliFork, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ETH, chainId:arbitrumHardhatFork, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ETH, chainId:arbitrumHardhatForkServer, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumSepolia.asset.ETH, chainId:arbitrumSepolia, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_ArbitrumSepolia.asset.ETH, chainId:arbitrumSepoliaFork, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_BaseSepolia.asset.ETH, chainId:baseSepolia, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_Mainnet.asset.ETH, chainId:mainnet, minAmountDecimals:2, priceDecimals:2, isNative:true});
    cacheToken({token:'ETH', address:ContractAddressConfig_Mainnet.asset.ETH, chainId:mainnetFork, minAmountDecimals:2, priceDecimals:2, isNative:true});

    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrum, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumFork, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumForkServer, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumGoerli, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumGoerliFork, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumHardhatFork, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumHardhatForkServer, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumSepolia, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:arbitrumSepoliaFork, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:baseSepolia, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:mainnet, isNative:true});
    cacheToken({token:'USD', address:ApplicationConfig.emptyContractAddress, chainId:mainnetFork, isNative:true});

    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_Arbitrum.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrum});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_Arbitrum.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumFork});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_Arbitrum.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumForkServer});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumGoerli.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumGoerli});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumGoerliFork});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumHardhatFork});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumHardhatForkServer});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumSepolia.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumSepolia});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_ArbitrumSepolia.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:arbitrumSepoliaFork});
    cacheToken({token:'WETH', localName:'ETH', address:ContractAddressConfig_BaseSepolia.asset.WETH, minAmountDecimals:2, priceDecimals:2, chainId:baseSepolia});

    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_Arbitrum.asset.WBTC, chainId:arbitrum, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_Arbitrum.asset.WBTC, chainId:arbitrumFork, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_Arbitrum.asset.WBTC, chainId:arbitrumForkServer, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumGoerli.asset.WBTC, chainId:arbitrumGoerli, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WBTC, chainId:arbitrumGoerliFork, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WBTC, chainId:arbitrumHardhatFork, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.WBTC, chainId:arbitrumHardhatForkServer, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumSepolia.asset.WBTC, chainId:arbitrumSepolia, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_ArbitrumSepolia.asset.WBTC, chainId:arbitrumSepoliaFork, decimals:8, minAmountDecimals:3, priceDecimals:1});
    cacheToken({token:'WBTC', localName:'BTC', address:ContractAddressConfig_BaseSepolia.asset.WBTC, chainId:baseSepolia, decimals:8, minAmountDecimals:3, priceDecimals:1});

    cacheToken({token:'USDC', address:ContractAddressConfig_Arbitrum.asset.USDC, chainId:arbitrum, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_Arbitrum.asset.USDC, chainId:arbitrumFork, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_Arbitrum.asset.USDC, chainId:arbitrumForkServer, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumGoerli.asset.USDC, chainId:arbitrumGoerli, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDC, chainId:arbitrumGoerliFork, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDC, chainId:arbitrumHardhatFork, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDC, chainId:arbitrumHardhatForkServer, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumSepolia.asset.USDC, chainId:arbitrumSepolia, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_ArbitrumSepolia.asset.USDC, chainId:arbitrumSepoliaFork, decimals:6});
    cacheToken({token:'USDC', address:ContractAddressConfig_BaseSepolia.asset.USDC, chainId:baseSepolia, decimals:6});

    cacheToken({token:'ARB', address:ContractAddressConfig_Arbitrum.asset.ARB, chainId:arbitrum, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_Arbitrum.asset.ARB, chainId:arbitrumFork, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_Arbitrum.asset.ARB, chainId:arbitrumForkServer, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumGoerli.asset.ARB, chainId:arbitrumGoerli, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ARB, chainId:arbitrumGoerliFork, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ARB, chainId:arbitrumHardhatFork, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumGoerliFork.asset.ARB, chainId:arbitrumHardhatForkServer, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumSepolia.asset.ARB, chainId:arbitrumSepolia, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_ArbitrumSepolia.asset.ARB, chainId:arbitrumSepoliaFork, minAmountDecimals:-1, priceDecimals:4});
    cacheToken({token:'ARB', address:ContractAddressConfig_BaseSepolia.asset.ARB, chainId:baseSepolia, minAmountDecimals:-1, priceDecimals:4});

    cacheToken({token:'USDT', address:ContractAddressConfig_Arbitrum.asset.USDT, chainId:arbitrum, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_Arbitrum.asset.USDT, chainId:arbitrumFork, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_Arbitrum.asset.USDT, chainId:arbitrumForkServer, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumGoerli.asset.USDT, chainId:arbitrumGoerli, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDT, chainId:arbitrumGoerliFork, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDT, chainId:arbitrumHardhatFork, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumGoerliFork.asset.USDT, chainId:arbitrumHardhatForkServer, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumSepolia.asset.USDT, chainId:arbitrumSepolia, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_ArbitrumSepolia.asset.USDT, chainId:arbitrumSepoliaFork, decimals:6});
    cacheToken({token:'USDT', address:ContractAddressConfig_BaseSepolia.asset.USDT, chainId:baseSepolia, decimals:6});

    cacheToken({token:'DAI', address:ContractAddressConfig_Arbitrum.asset.DAI, chainId:arbitrum});
    cacheToken({token:'DAI', address:ContractAddressConfig_Arbitrum.asset.DAI, chainId:arbitrumFork});
    cacheToken({token:'DAI', address:ContractAddressConfig_Arbitrum.asset.DAI, chainId:arbitrumForkServer});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumGoerli.asset.DAI, chainId:arbitrumGoerli});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumGoerliFork.asset.DAI, chainId:arbitrumGoerliFork});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumGoerliFork.asset.DAI, chainId:arbitrumHardhatFork});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumGoerliFork.asset.DAI, chainId:arbitrumHardhatForkServer});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumSepolia.asset.DAI, chainId:arbitrumSepolia});
    cacheToken({token:'DAI', address:ContractAddressConfig_ArbitrumSepolia.asset.DAI, chainId:arbitrumSepoliaFork});
    cacheToken({token:'DAI', address:ContractAddressConfig_BaseSepolia.asset.DAI, chainId:baseSepolia});
}

export const TokenLogosMap = {
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': ETHLogo,
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': WETHLogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.WETH.toLocaleLowerCase()]: WETHLogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.WETH.toLocaleLowerCase()]: WETHLogo,
    [ContractAddressConfig_BaseSepolia.asset.WETH.toLocaleLowerCase()]: WETHLogo,

    [ApplicationConfig.emptyContractAddress.toLocaleLowerCase()]: USDLogo,

    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': USDCLogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.USDC.toLocaleLowerCase()]: USDCLogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.USDC.toLocaleLowerCase()]: USDCLogo,
    [ContractAddressConfig_BaseSepolia.asset.USDC.toLocaleLowerCase()]: USDCLogo,

    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': WBTCLogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.WBTC.toLocaleLowerCase()]: WBTCLogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.WBTC.toLocaleLowerCase()]: WBTCLogo,
    [ContractAddressConfig_BaseSepolia.asset.WBTC.toLocaleLowerCase()]: WBTCLogo,

    '0x912ce59144191c1204e64559fe8253a0e49e6548': ARBLogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.ARB.toLocaleLowerCase()]: ARBLogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.ARB.toLocaleLowerCase()]: ARBLogo,
    [ContractAddressConfig_BaseSepolia.asset.ARB.toLocaleLowerCase()]: ARBLogo,

    [ContractAddressConfig_Arbitrum.asset.USDT.toLocaleLowerCase()]: USDTLogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.USDT.toLocaleLowerCase()]: USDTLogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.USDT.toLocaleLowerCase()]: USDTLogo,
    [ContractAddressConfig_BaseSepolia.asset.USDT.toLocaleLowerCase()]: USDTLogo,

    [ContractAddressConfig_Arbitrum.asset.DAI.toLocaleLowerCase()]: DAILogo,
    [ContractAddressConfig_ArbitrumGoerli.asset.DAI.toLocaleLowerCase()]: DAILogo,
    [ContractAddressConfig_ArbitrumSepolia.asset.DAI.toLocaleLowerCase()]: DAILogo,
    [ContractAddressConfig_BaseSepolia.asset.DAI.toLocaleLowerCase()]: DAILogo,
};

export const TradingOrderSize = {
    name: 'TradingOrderSize',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 42161,
    decimals: TRADING_ORDER_SIZE_DECIMALS,
    isNative: false,
};

export const Ratio = {
    name: 'Ratio',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 42161,
    decimals: RATIO_DECIMALS,
    isNative: false,
};

export const RatioToShow = {
    name: 'RatioToShow',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 42161,
    decimals: RATIO_TO_SHOW_DECIMALS,
    isNative: false,
};

export const ValueInUSD = {
    name: 'ValueInUSD',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 42161,
    decimals: USD_VALUE_DECIMALS,
    isNative: false,
};

export const WrappedTokens = [
    {
        wrappedName: 'WETH',
        wrappedLogo: WETHLogo,
        nativeName: 'ETH',
        nativeLogo: ETHLogo,
    },
];

export const checkWrappedToken = (token) => {
    let filter = WrappedTokens.filter((wrappedToken) => {
        return wrappedToken.wrappedName === token;
    });

    return filter.length > 0;
};
