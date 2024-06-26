import React, { useContext, useEffect, useState } from 'react';
import {
    ArbitrumForkChain,
    ArbitrumGoerliChain,
    ArbitrumGoerliForkChain,
    ArbitrumHardhatForkChain,
    ArbitrumHardhatForkServerChain,
    ArbitrumSepoliaChain,
    ArbitrumSepoliaForkChain,
    BaseSepoliaTestChain,
    DefaultChain
} from "../../contract/ChainConfig";

export const TRADING_ORDER_SIZE_DECIMALS = 4;
export const RATIO_DECIMALS = 4;
export const RATIO_TO_SHOW_DECIMALS = 2;
export const USD_VALUE_DECIMALS = 8;
export const TOKEN_PRICE_DECIMALS = 8;

export const PORTFOLIO_TYPE = {
    Cross: 'Cross',
    Isolated: 'Isolated',
};

export const PORTFOLIO_TYPE_LABEL = {
    Cross: 'page.trading.common.trading.portfolio.cross',
    Isolated: 'page.trading.common.trading.portfolio.isolated',
};

export const PORTFOLIO_TYPE_OPTIONS = [
    { label: 'Isolated', value: 'Isolated'},
    { label: 'Cross', value: 'Cross'},
];

export const PORTFOLIO_TYPE_OPTIONS_CN = [
    { label: '逐仓', value: 'Isolated'},
    { label: '全仓', value: 'Cross'},
];

// export const GET_TEST_ETH_URL = 'https://faucet.triangleplatform.com/arbitrum/sepolia';
export const GET_TEST_ETH_URL = 'https://faucet.triangleplatform.com/base/sepolia';
export const DEFAULT_CLAIM_TEST_TOKEN_AMOUNT = '10000';

const AVAILABLE_ASSETS = {
    ETH: {
        name: 'ETH',
        testTokenIn: []
    },
    USD: {
        name: 'ETH',
        testTokenIn: []
    },
    USDT: {
        name: 'USDT',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '100000',
    },
    USDC: {
        name: 'USDC',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '100000',
    },
    DAI: {
        name: 'DAI',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '100000',
    },
    WETH: {
        name: 'WETH',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '100',
    },
    WBTC: {
        name: 'WBTC',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '5',
    },
    ARB: {
        name: 'ARB',
        testTokenIn: [
            ArbitrumGoerliChain.chainId,
            ArbitrumGoerliForkChain.chainId,
            ArbitrumHardhatForkChain.chainId,
            ArbitrumHardhatForkServerChain.chainId,
            ArbitrumSepoliaChain.chainId,
            ArbitrumSepoliaForkChain.chainId,
            BaseSepoliaTestChain.chainId,
        ],
        claimAmountForTesting: '10000',
    },
};

export const ENABLE_ASSETS = [
    AVAILABLE_ASSETS.ETH,
    AVAILABLE_ASSETS.USDC,
    AVAILABLE_ASSETS.WBTC,
    AVAILABLE_ASSETS.WETH,
    // AVAILABLE_ASSETS.DAI,
];




const DEFAULT_TRADING_ASSETS_MAP = {
    Isolated: [
        'USDT',
        'WETH',
        // 'DAI',
        'WBTC',
    ],
    Cross: [
        'USDT',
        'WETH',
        // 'DAI',
        'WBTC',
    ]
};

const TRADING_ASSETS_BASE_MAP = {
    Isolated: [
        'USDC',
        'WETH',
        'WBTC',
    ],
    Cross: [
        'USDC',
        'WETH',
        'WBTC',
    ]
};

const TRADING_ASSETS_ARBITRUM_MAP = {
    Isolated: [
        'USDT',
        'WETH',
        // 'DAI',
        'WBTC',
    ],
    Cross: [
        'USDT',
        'WETH',
        // 'DAI',
        'WBTC',
    ]
};

export const TRADING_ASSETS_MAP = DEFAULT_TRADING_ASSETS_MAP;

export const TRADING_ASSETS_CHAIN_MAP = {
    [DefaultChain.chainId]: DEFAULT_TRADING_ASSETS_MAP,
    [ArbitrumForkChain.chainId]: TRADING_ASSETS_ARBITRUM_MAP,
    [ArbitrumSepoliaChain.chainId]: TRADING_ASSETS_ARBITRUM_MAP,
    [ArbitrumSepoliaForkChain.chainId]: TRADING_ASSETS_ARBITRUM_MAP,
    [BaseSepoliaTestChain.chainId]: TRADING_ASSETS_BASE_MAP,
};





export const STAKE_VAULT_ASSETS = [
    'USDC',
];
export const STAKE_VAULT_ASSETS_NAV_KEY = {
    'USDT': 'dusdt_vault',
    'USDC': 'dusdc_vault',
    'DAI': 'ddai_vault',
    'WETH': 'dweth_vault',
    'WBTC': 'dwbtc_vault',
};

export const DEFAULT_LEVERAGE = 5;

export const TRADING_ORDER_SIDE = {
    Long: 1,
    Short: 2,
};

export const TRADING_ORDER_SIDE_MAP = {
    0: `NULL`,
    1: `Long`,
    2: `Short`,
};

export const TRADING_ORDER_TYPE = {
    Limit: 'Limit',
    Market: 'Market',
    Stop: 'Stop',
    Liquidation: 'Liquidation',
};

export const TRADING_ORDER_TYPE_OPTIONS = [
    { label: TRADING_ORDER_TYPE.Market, value: TRADING_ORDER_TYPE.Market},
    { label: TRADING_ORDER_TYPE.Limit, value: TRADING_ORDER_TYPE.Limit},
    { label: TRADING_ORDER_TYPE.Stop, value: TRADING_ORDER_TYPE.Stop},
];

export const TRADING_REPAY_TYPE_OPTIONS = [
    {label: 'Portfolio', value: 'Portfolio'},
    {label: 'Wallet', value: 'Wallet'},
];

export const TRADING_ORDER_TYPE_MAP = {
    0: `NULL`,
    1: `Market`,
    2: `Limit`,
    3: `Stop`,
};

// enum OrderState {
//         NULL,
//         REQUESTED,
//         PENDING,
//         CANCELLED,
//         FULFILLED
//     }
export const TRADING_ORDER_STATE_MAP = {
    0: `NULL`,
    1: `REQUESTED`,
    2: `PENDING`,
    3: `CANCELLED`,
    4: `FULFILLED`,
};

// ActionLogged actionType:
    // 1. market order executed
    // 2. pending order appended
    // 3. pending order executed
    // 4. pending order cancelled
    // 5. position liquidation
    // 6. portfolio liquidation
    // 7. auto deleveraging
export const TRADING_ACTION_LOGGED_TYPE = {
    market_order_executed: 1,
    pending_order_appended: 2,
    pending_order_executed: 3,
    pending_order_cancelled: 4,
    position_liquidation: 5,
    portfolio_liquidation: 6,
    auto_deleveraging: 7,
};

export const AVAILABLE_INSTRUMENTS = {
    // USDC instruments
    'WBTC-USDC': {
        instrumentId: 0,
        tokenA: 'WBTC',
        tokenB: 'USDC',
        settleToken: 'USDC',
        tradingPair: 'BTCUSDC',
        tradingViewSymbol: 'BINANCE:BTCUSDC',
    },
    'WETH-USDC': {
        instrumentId: 1,
        tokenA: 'WETH',
        tokenB: 'USDC',
        settleToken: 'USDC',
        tradingPair: 'ETHUSDC',
        tradingViewSymbol: 'BINANCE:ETHUSDC',
    },
    'ARB-USDC': {
        instrumentId: 2,
        tokenA: 'ARB',
        tokenB: 'USDC',
        settleToken: 'USDC',
        tradingPair: 'ARB-USD',
        tradingViewSymbol: 'COINBASE:ARBUSD',
    },


    // USDT instruments
    'WBTC-USDT': {
        instrumentId: 1,
        tokenA: 'WBTC',
        tokenB: 'USDT',
        settleToken: 'USDT',
        tradingPair: 'BTCUSDT',
        tradingViewSymbol: 'BINANCE:BTCUSDT',
    },
    'WETH-USDT': {
        instrumentId: 2,
        tokenA: 'WETH',
        tokenB: 'USDT',
        settleToken: 'USDT',
        tradingPair: 'ETHUSDT',
        tradingViewSymbol: 'BINANCE:ETHUSDT',
    },
    'ARB-USDT': {
        instrumentId: 3,
        tokenA: 'ARB',
        tokenB: 'USDT',
        settleToken: 'USDT',
        tradingPair: 'ARB-USD',
        tradingViewSymbol: 'COINBASE:ARBUSD',
    },


    // DAI instruments
    'WBTC-DAI': {
        instrumentId: 4,
        tokenA: 'WBTC',
        tokenB: 'DAI',
        settleToken: 'DAI',
        tradingPair: 'BTCDAI',
        tradingViewSymbol: 'BINANCE:BTCDAI',
    },


    // USD instruments
    'WETH-USD': {
        instrumentId: 2,
        tokenA: 'WETH',
        tokenB: 'USD',
        settleToken: 'WETH',
        tradingPair: 'ETHUSDT',
        tradingViewSymbol: 'BINANCE:ETHUSD',
    },
    'WBTC-USD': {
        instrumentId: 4,
        tokenA: 'WBTC',
        tokenB: 'USD',
        settleToken: 'WBTC',
        tradingPair: 'BTCUSDT',
        tradingViewSymbol: 'BINANCE:BTCUSD',
    },
};

export const ENABLE_INSTRUMENTS = [
    'WBTC-USDC',
    'WETH-USDC',
];

export const INSTRUMENT_ID_MAP = {
    [DefaultChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 2,
        'ARB-USDT': 3,
        'WBTC-DAI': 4,
    },
    [ArbitrumForkChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 2,
        'ARB-USDT': 3,
        'WBTC-DAI': 4,
    },

    [ArbitrumGoerliChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 1,
        'ARB-USDT': 3,
        'WETH-USD': 2,
    },
    [ArbitrumGoerliForkChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 2,
        'ARB-USDT': 3,
        'WBTC-DAI': 4,
    },
    [ArbitrumHardhatForkChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 2,
        'ARB-USDT': 3,
        'WBTC-DAI': 4,
    },
    [ArbitrumHardhatForkServerChain.chainId]: {
        'WBTC-USDT': 1,
        'WETH-USDT': 2,
        'ARB-USDT': 3,
        'WBTC-DAI': 4,
    },

    [ArbitrumSepoliaChain.chainId]: {
        'WETH-USDT': 1,
        'WETH-USD': 2,
        'WBTC-USDT': 3,
        'WBTC-USD': 4,
    },
    [ArbitrumSepoliaForkChain.chainId]: {
        'WETH-USDT': 1,
        'WETH-USD': 2,
        'WBTC-USDT': 3,
        'WBTC-USD': 4,
    },
    [BaseSepoliaTestChain.chainId]: {
        'WETH-USDC': 1,
        'WBTC-USDC': 2,
    },
};

export const DEFAULT_INSTRUMENT_CODE = 'WETH-USDC';
export const DEFAULT_INSTRUMENT_ID = INSTRUMENT_ID_MAP[DefaultChain.chainId][DEFAULT_INSTRUMENT_CODE];

export const SLIPPAGE_CACHE_KEY_TRADING = 'slippage_for_trading';

export const MAX_PENDING_ORDERS = 10;

export const INSTRUMENT_PRICE_ICON_MAP = {
    'DAI': 'i_price_dai',
    'USD': 'i_price_usd',
    'USDC': 'i_price_usdc',
    'USDT': 'i_price_usdt',
    'WETH': 'i_price_weth',
    'WBTC': 'i_price_wbtc',
};

// AssetTransferred _actionType:
// 1: Withdraw asset
// 2: Charged / retrieved asset as a result of order execution (including 3)
// 3: Charged / retrieved asset as a result of funding fee (part of 2)
// 4: Charged fee as earn vault reward
//    a. commission fee (excluding operation fee & referral reward)
//    b. borrowing fee
//    c. additional margin modification fee
// 5: Charged referral reward
// 6: Charged operational fee
// 7: (IMP only) Charged / retrieved asset as a result of additional margin modification
// 8: (CMP only) Collateral swapped
// 9: (CMP only) Liquidation
// 10: (CMP only) Liability paid
export const ASSET_HISTORY_TYPE_MAP = {
    [-1]: `Swap In`,
    0: `Deposit`,
    1: `Withdraw`,
    2: `Vault Txn`,
    // 7: `Margin Modification`,
    8: `Swap Out`,
    10: `User Repay`,
};

export const VAULT_ASSET_HISTORY_TYPE = {
    swap_in: -1,
    deposit: 0,
    withdraw: 1,
    vault_txn: 2,
    // margin_modification: 7,
    swap_out: 8,
    user_repay: 10,
};

export const EARN_STAKE_TYPE = {
    Lock: {
        label: 'Deposit & Lock',
        typeTxt: 'Locked',
        value: 1,
    },
    Unlock: {
        label: 'Deposit',
        typeTxt: 'Unlocked',
        value: 0,
    },
};

export const EARN_STAKE_TYPE_OPTIONS = [
    { label: 'Deposit', value: 'Deposit'},
    { label: 'Deposit & Lock', value: 'Deposit & Lock'},
];

export const EARN_STAKE_TYPE_OPTIONS_CN = [
    { label: '存入', value: 'Deposit'},
    { label: '存入并锁定', value: 'Deposit & Lock'},
];