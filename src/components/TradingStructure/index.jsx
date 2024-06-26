import React, { useContext, useEffect, useState } from 'react';
import {ERCToken} from "../ERCToken";
import {
    ASSET_HISTORY_TYPE_MAP,
    DEFAULT_INSTRUMENT_CODE,
    DEFAULT_INSTRUMENT_ID,
    DEFAULT_LEVERAGE, INSTRUMENT_PRICE_ICON_MAP,
    PORTFOLIO_TYPE,
    TRADING_ORDER_SIDE
} from "../TradingConstant";
import ContractConfig from "../../contract/ContractConfig";
import {
    Amount,
    DECIMAL_PLACES_STRATEGY_SAMLL,
    RATIO_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../../utils/TokenAmountConverter";
import {TradingOrderSize} from "../../contract/TokenContract";
import moment from 'moment';
import {defaultTimeFormat} from "../../utils/DateUtil";
import {generateAddressSummary} from "../../utils/StringFormat";

export class StateAmount {
    amount = new Amount(0);
    lessThanZero = false;
    equalsZero = true;

    constructor(amount, decimals, relative) {
        let _amount = new Amount(amount, decimals);
        this.amount = _amount;

        let bn = _amount.bigNumber;
        let _relative = relative === undefined ? 0 : relative;
        let ltz = bn.comparedTo(_relative) < 0;
        let ez = bn.comparedTo(_relative) === 0;
        this.lessThanZero = ltz;
        this.equalsZero = ez;
    }
}

export class Instrument {
    instrumentCode = DEFAULT_INSTRUMENT_CODE;
    instrumentLocalCode = DEFAULT_INSTRUMENT_CODE;
    instrumentId = DEFAULT_INSTRUMENT_ID;
    tokenA = new ERCToken({});
    tokenB = new ERCToken({});
    settleToken = new ERCToken({});
    priceIcon = 'i_price_usd';

    leverage = DEFAULT_LEVERAGE;

    // some information in exchange
    tradingPair = '';
    tradingViewSymbol = '';

    currentPrice = new Amount(0);

    constructor({
                    instrumentId = DEFAULT_INSTRUMENT_ID,
                    instrumentCode = '',
                    instrumentLocalCode = '',
                    tokenA = new ERCToken({}),
                    tokenB = new ERCToken({}),
                    settleToken = new ERCToken({}),
                    leverage = DEFAULT_LEVERAGE,
                    tradingPair = '',
                    tradingViewSymbol = '',
                    currentPrice = new Amount(0),
                }) {
        this.instrumentCode = instrumentCode || `${tokenA.name}-${tokenB.name}`;
        this.instrumentLocalCode = instrumentLocalCode || `${tokenA.localName}-${tokenB.localName}`;
        this.instrumentId = instrumentId;
        this.tokenA = tokenA;
        this.tokenB = tokenB;
        this.settleToken = settleToken;
        this.priceIcon = INSTRUMENT_PRICE_ICON_MAP[tokenB.name] || 'i_price_usd';
        this.leverage = leverage;
        this.tradingPair = tradingPair;
        this.tradingViewSymbol = tradingViewSymbol;
        this.currentPrice = currentPrice;
    }

    updateCurrentPrice(currentPrice) {
        this.currentPrice = currentPrice;
    }

    updateLeverage(leverage) {
        this.leverage = leverage;
    }
}

export class Portfolio {
    portfolioType = PORTFOLIO_TYPE.Isolated;
    address = '';
    instrument = new Instrument({});
    contract = undefined;

    constructor({
                    portfolioType = PORTFOLIO_TYPE.Isolated,
                    address = '',
                    instrument = new Instrument({}),
                }) {
        this.portfolioType = portfolioType;
        this.address = address;
        this.instrument = instrument;

        if(portfolioType === PORTFOLIO_TYPE.Isolated){
            this.contract = {
                ...ContractConfig.TradingMeta.IsolatedMarginPortfolio,
                theAddress: address,
            }
        } else {
            this.contract = {
                ...ContractConfig.TradingMeta.CrossMarginPortfolio,
                theAddress: address,
            }
        }
    }
}

export class Position {
    instrument = new Instrument({});
    portfolio = new Portfolio({});
    positionId = 0;
    tradingSide = TRADING_ORDER_SIDE.Long;
    tradingSideTxt = 'Long';
    orderSizeAmount = new TokenAmount(0, TradingOrderSize);
    avgPx = new TokenAmount(0);
    markPrice = new Amount(0);
    liqPrice = new TokenAmount(0);
    marginAmount = new TokenAmount(0);
    marginRatioAmount = new TokenAmount(0);
    additionalMarginAmount = new TokenAmount(0);
    plAmount = new TokenAmount(0);
    plRatioAmount = new Amount(0);
    plLTZero = false;   // less than 0
    plEZero = true;     // equals 0
    pendingBorrowingFeeAmount = new TokenAmount(0);
    pendingBorrowingFeeLTZero = false;   // less than 0
    pendingBorrowingFeeEZero = true;     // equals 0
    pendingFundingFeeAmount = new TokenAmount(0);
    pendingFundingFeeLTZero = false;   // less than 0
    pendingFundingFeeEZero = true;     // equals 0

    constructor({
                    instrument = new Instrument({}),
                    portfolio = new Portfolio({}),
                    positionId = 0,
                    tradingSide = TRADING_ORDER_SIDE.Long,
                    orderSizeAmount = new TokenAmount(0, TradingOrderSize),
                    avgPx = new TokenAmount(0),
                    markPrice = new Amount(0),
                    marginAmount = new TokenAmount(0),
                    additionalMarginAmount = new TokenAmount(0),
                }) {
        this.instrument = instrument;
        this.portfolio = portfolio;
        this.positionId = positionId;
        this.tradingSide = tradingSide;
        this.tradingSideTxt = tradingSide === TRADING_ORDER_SIDE.Long ? 'Long' : 'Short';
        this.orderSizeAmount = orderSizeAmount;
        this.avgPx = avgPx;
        this.markPrice = markPrice;
        this.marginAmount = marginAmount;
        this.additionalMarginAmount = additionalMarginAmount;
    }

    update({
               liqPrice = new TokenAmount(0),
               marginRatioAmount = new TokenAmount(0),
               plAmount = new TokenAmount(0),
               pendingBorrowingFeeAmount = new TokenAmount(0),
               pendingFundingFeeAmount = new TokenAmount(0),
           }){
        this.liqPrice = liqPrice;

        this.marginRatioAmount = marginRatioAmount;
        this.plAmount = plAmount;

        if(this.marginAmount.amountOnChain.value && this.marginAmount.amountOnChain.value !== '0'){
            let plRatio = plAmount.amountOnChain.bigNumber.times(100).div(this.marginAmount.amountOnChain.bigNumber);
            let _plRatioAmount = new Amount(plRatio, RATIO_SHOW_DECIMALS, DECIMAL_PLACES_STRATEGY_SAMLL);
            this.plRatioAmount = _plRatioAmount;

            this.plLTZero = plAmount.amountOnChain.bigNumber.comparedTo(0) < 0;
            this.plEZero = plAmount.amountOnChain.bigNumber.comparedTo(0) === 0;
        }else{
            let _plRatioAmount = new Amount(0, RATIO_SHOW_DECIMALS, DECIMAL_PLACES_STRATEGY_SAMLL);
            this.plRatioAmount = _plRatioAmount;
            this.plLTZero = false;
            this.plEZero = true;
        }

        this.pendingBorrowingFeeAmount = pendingBorrowingFeeAmount;
        this.pendingBorrowingFeeLTZero = pendingBorrowingFeeAmount.amountOnChain.bigNumber.comparedTo(0) < 0;
        this.pendingBorrowingFeeEZero = pendingBorrowingFeeAmount.amountOnChain.bigNumber.comparedTo(0) === 0;

        this.pendingFundingFeeAmount = pendingFundingFeeAmount;
        this.pendingFundingFeeLTZero = pendingFundingFeeAmount.amountOnChain.bigNumber.comparedTo(0) < 0;
        this.pendingFundingFeeEZero = pendingFundingFeeAmount.amountOnChain.bigNumber.comparedTo(0) === 0;
    }
}

export class PendingOrder {
    orderId = 0;
    instrument = new Instrument({});
    tradingSide = TRADING_ORDER_SIDE.Long;
    tradingSideTxt = 'Long';
    orderTime = moment();
    orderTimeUnix = 0;
    orderTimeFormat = '';
    orderSizeAmount = new TokenAmount(0, TradingOrderSize);
    orderPrice = new TokenAmount(0);
    orderPriceTxt = '';
    orderValueInUSD = new Amount(0);
    status = '';
    orderType = '';

    constructor({
                    orderId = 0,
                    instrument = new Instrument({}),
                    tradingSide = TRADING_ORDER_SIDE.Long,
                    orderTimeUnix = 0,
                    orderSizeAmount = new TokenAmount(0, TradingOrderSize),
                    orderPrice = new TokenAmount(0),
                    orderPriceTxt = '',
                    orderValueInUSD = new Amount(0),
                    status = '',
                    orderType = ''
                }) {
        this.orderId = orderId;
        this.instrument = instrument;
        this.tradingSide = tradingSide;
        this.tradingSideTxt = tradingSide === TRADING_ORDER_SIDE.Long ? 'Long' : 'Short';
        this.orderTimeUnix = orderTimeUnix;
        this.orderTime = moment(orderTimeUnix * 1000);
        this.orderTimeFormat = defaultTimeFormat(this.orderTime);
        this.orderSizeAmount = orderSizeAmount;
        this.orderPrice = orderPrice;
        this.orderPriceTxt = orderPriceTxt;
        this.orderValueInUSD = orderValueInUSD;
        this.status = status;
        this.orderType = orderType;
    }
}

export class OrderHistory {
    orderId = 0;
    actionType = 0;
    portfolioAddress = '';
    instrument = new Instrument({});
    tradingSide = TRADING_ORDER_SIDE.Long;
    tradingSideTxt = 'Long';
    leverage = DEFAULT_LEVERAGE;
    pendingOrdId = 0;
    orderTime = moment();
    orderTimeUnix = 0;
    orderTimeFormat = '';
    orderSizeAmount = new TokenAmount(0, TradingOrderSize);
    triggerPrice = new TokenAmount(0);
    triggerPriceTxt = '';
    fulfillPrice = new TokenAmount(0);
    orderPrice = new TokenAmount(0);
    orderPriceTxt = '';
    orderValueInUSD = new Amount(0);
    orderVolume = new Amount(0);
    status = '';
    orderType = '';
    orderHistoryType = '';
    posId = 0;
    pnl = new StateAmount(0);

    constructor({
                    orderId = 0,
                    actionType = 0,
                    portfolioAddress = '',
                    instrument = new Instrument({}),
                    tradingSide = TRADING_ORDER_SIDE.Long,
                    leverage = DEFAULT_LEVERAGE,
                    pendingOrdId = 0,
                    orderTimeUnix = 0,
                    orderSizeAmount = new TokenAmount(0, TradingOrderSize),
                    triggerPrice = new TokenAmount(0),
                    triggerPriceTxt = '',
                    fulfillPrice = new TokenAmount(0),
                    orderPrice = new TokenAmount(0),
                    orderPriceTxt = '',
                    orderValueInUSD = new Amount(0),
                    orderVolume = new Amount(0),
                    status = '',
                    orderType = '',
                    orderHistoryType = '',
                    posId = 0,
                    pnl = new StateAmount(0),
                }) {
        this.orderId = orderId;
        this.actionType = actionType;
        this.portfolioAddress = portfolioAddress;
        this.instrument = instrument;
        this.tradingSide = tradingSide;
        this.tradingSideTxt = tradingSide === TRADING_ORDER_SIDE.Long ? 'Long' : 'Short';
        this.leverage = leverage || DEFAULT_LEVERAGE;
        this.pendingOrdId = pendingOrdId;
        this.orderTimeUnix = orderTimeUnix;
        this.orderTime = moment(orderTimeUnix * 1000);
        this.orderTimeFormat = defaultTimeFormat(this.orderTime);
        this.orderSizeAmount = orderSizeAmount;
        this.triggerPrice = triggerPrice;
        this.triggerPriceTxt = triggerPriceTxt;
        this.fulfillPrice = fulfillPrice;
        this.orderPrice = orderPrice;
        this.orderPriceTxt = orderPriceTxt;
        this.orderValueInUSD = orderValueInUSD;
        this.orderVolume = orderVolume;
        this.status = status;
        this.orderType = orderType;
        this.orderHistoryType = orderHistoryType;
        this.posId = posId;
        this.pnl = pnl;
    }
}

export class TradingAsset {
    instrument = new Instrument({});
    portfolio = new Portfolio({});
    token = new ERCToken({});
    equity = new TokenValueInUSD(0);
    available = new TokenAmount(0);
    inUse = new TokenAmount(0);
    pnl = new TokenAmount(0);
    plLTZero = false;   // less than 0
    liability = new TokenAmount(0);
    liabilityGTZero = false;   // less than 0

    constructor({
                    instrument = new Instrument({}),
                    portfolio = new Portfolio({}),
                    token = new ERCToken({}),
                    equity = new TokenValueInUSD(0),
                    available = new TokenAmount(0),
                    inUse = new TokenAmount(0),
                    pnl = new TokenAmount(0),
                    liability = new TokenAmount(0)
                }) {
        this.instrument = instrument;
        this.portfolio = portfolio;
        this.token = token;
        this.equity = equity;
        this.available = available;
        this.inUse = inUse;
        this.pnl = pnl;
        this.plLTZero = pnl.amountOnChain.bigNumber.comparedTo(0) < 0;
        this.liability = liability;
        this.liabilityGTZero = liability.amountOnChain.bigNumber.comparedTo(0) > 0;
    }
}

export class InstrumentTradingTicker {
    priceChangePercent = new Amount(0);
    highPrice = new Amount(0);
    lowPrice = new Amount(0);
    isGoUp = true;

    constructor({
                    priceChangePercent = new Amount(0),
                    highPrice = new Amount(0),
                    lowPrice = new Amount(0),
                }) {
        this.priceChangePercent = priceChangePercent;
        this.isGoUp = priceChangePercent.bigNumber.comparedTo(0) >= 0;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
    }
}

const TradingLeaderboardRankIconMap = {
    1: 'i_rank_1',
    2: 'i_rank_2',
    3: 'i_rank_3',
};
export class TradingLeaderboardData {
    rank = 0;
    rankIcon = '';
    tradingAddress = '';
    tradingAddressOri = '';
    trades = new Amount(0);
    winrate = new StateAmount(0, 2, 50);
    pnl = new StateAmount(0);

    constructor({
                    rank = 0,
                    tradingAddress = '',
                    trades = new Amount(0),
                    winrate = new StateAmount(0, 2, 50),
                    pnl = new StateAmount(0),
                }) {
        this.rank = rank;
        this.rankIcon = TradingLeaderboardRankIconMap[rank] || '';
        this.tradingAddressOri = tradingAddress;
        this.tradingAddress = generateAddressSummary(tradingAddress, 6);
        this.trades = trades;
        this.winrate = winrate;
        this.pnl = pnl;
    }

    update({
               rank = 0,
           }){
        this.rank = rank;
        this.rankIcon = TradingLeaderboardRankIconMap[rank] || '';
    }
}

export class AssetsHistoryData {
    contractAddress = '';
    asset = new ERCToken({});
    actionType = 0;
    actionTypeTxt = '';
    actionTime = moment();
    actionTimeUnix = 0;
    actionTimeFormat = '';
    actionAmount = new TokenAmount(0, TradingOrderSize);
    lock = false;

    constructor({
                    contractAddress = '',
                    asset = new ERCToken({}),
                    actionType = 0,
                    actionTimeUnix = 0,
                    actionAmount = new TokenAmount(0, TradingOrderSize),
                    lock = false,
                }) {
        this.contractAddress = contractAddress;
        this.asset = asset;
        this.actionType = actionType;
        this.actionTypeTxt = ASSET_HISTORY_TYPE_MAP[actionType];
        this.actionTimeUnix = actionTimeUnix;
        this.actionTime = moment(actionTimeUnix * 1000);
        this.actionTimeFormat = defaultTimeFormat(this.actionTime);
        this.actionAmount = actionAmount;
        this.lock = lock;
    }

    updateActionType(actionType){
        this.actionType = actionType;
        this.actionTypeTxt = ASSET_HISTORY_TYPE_MAP[actionType];
    }
}