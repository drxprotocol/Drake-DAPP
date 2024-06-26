import React, { useContext, useEffect, useState, useMemo } from 'react';
import DefaultLogo from '../components/Coin/img/token_default.svg';
import { ERCToken } from '../components/ERCToken';
import {getLocalStorage, saveToLocalStorage} from "../utils/LocalStorage";
import {
    ASSET_HISTORY_TYPE_MAP,
    AVAILABLE_INSTRUMENTS,
    DEFAULT_CLAIM_TEST_TOKEN_AMOUNT,
    DEFAULT_INSTRUMENT_CODE,
    DEFAULT_INSTRUMENT_ID,
    DEFAULT_LEVERAGE,
    ENABLE_ASSETS,
    ENABLE_INSTRUMENTS,
    INSTRUMENT_ID_MAP,
    PORTFOLIO_TYPE,
    RATIO_DECIMALS, TRADING_ACTION_LOGGED_TYPE,
    TRADING_ORDER_SIDE,
    TRADING_ORDER_STATE_MAP, TRADING_ORDER_TYPE,
    TRADING_ORDER_TYPE_MAP, VAULT_ASSET_HISTORY_TYPE
} from "../components/TradingConstant";
import WebThreeContext from "../components/WebThreeProvider/WebThreeContext";
import {getToken, TradingOrderSize, ValueInUSD} from "../contract/TokenContract";
import {DappTokenLogosMap} from "./useTokenInfo";
import {
    AssetsHistoryData,
    Instrument,
    InstrumentTradingTicker,
    OrderHistory,
    Portfolio,
    StateAmount
} from "../components/TradingStructure";
import {useConfiguredContract, useContractCalls} from "../components/ContractHooks";
import ContractConfig from "../contract/ContractConfig";
import {DefaultChain, isSupportedChain} from "../contract/ChainConfig";
import {
    Amount,
    COMPACT_PRICE_SHOW_DECIMALS,
    DEFAULT_VALUE_IN_USD_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../utils/TokenAmountConverter";
import {useBlockNumber, useEtherBalance} from "@usedapp/core";
import ApplicationConfig from "../ApplicationConfig";
import {usePriceFromOracle, useTokenPriceFromOracle, useTokenPricesFromOracle} from "../components/TokenPrice";
import BigNumber from "bignumber.js";
import Axios from "axios";
import moment from "moment";

const AVAILABLE_INSTRUMENTS_CACHE_KEY = 'AVAILABLE_INSTRUMENTS';

const fetchInstrumentsFromLocalCache = (chainId) => {
    let instruments = getLocalStorage(`${AVAILABLE_INSTRUMENTS_CACHE_KEY}_${chainId}`) || [];
    return instruments;
};

export const useEnableTokens = () => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId || DefaultChain.chainId;
    const queryParams = {chainId};
    const etherBalance = useEtherBalance(web3Context.account, queryParams);
    const ethToken = buildToken('ETH', chainId);
    const {loaded: ethPriceLoaded, price: ethPrice} = useTokenPriceFromOracle('WETH');
    const ethValueInUSD = useMemo(() => {
        if(etherBalance && ethPriceLoaded && ethPrice){
            return new TokenValueInUSD(etherBalance, ethToken, ethPrice?.bigNumber || 0, false, 3, chainId);
        }

        return new TokenValueInUSD(0, ethToken, 0, false, 3, chainId);
    }, [etherBalance, ethPriceLoaded]);

    const tokens = useMemo(() => {
        return ENABLE_ASSETS.filter((tokenConfig) => {
            return tokenConfig?.name !== 'ETH';
        }).map((tokenConfig) => {
            let isTestToken = tokenConfig?.testTokenIn.includes(chainId);
            let token = buildToken(tokenConfig?.name, chainId, isTestToken);
            token.updateClaimAmount(tokenConfig?.claimAmountForTesting || DEFAULT_CLAIM_TEST_TOKEN_AMOUNT);
            return token;
        }) ?? [];
    }, [chainId]);

    const tokenBalanceCalls = useMemo(() => {
        if(web3Context.account && tokens.length){
            return tokens.map((token) => {
                let tokenContract = {
                    ...ContractConfig.asset.ERC20,
                    theAddress: token?.address,
                };

                return {
                    contract: tokenContract,
                    callMethod: 'balanceOf',
                    args: [web3Context.account]
                };
            });
        }

        return [];
    }, [web3Context, tokens]);

    const {loaded: tokenPricesLoaded, prices: tokenPrices} = useTokenPricesFromOracle(tokens);
    const tokenBalanceResult = useContractCalls(tokenBalanceCalls) ?? [];
    const [tokenAmounts, setTokenAmounts] = useState([]);
    useEffect(() => {
        // console.debug(`ethValueInUSD =>`, ethValueInUSD, `tokenBalanceResult =>`, tokenBalanceResult, `tokenBalanceCalls =>`, tokenBalanceCalls);

        if(ethValueInUSD && tokenPricesLoaded && tokenPrices.length && tokenBalanceResult && tokenBalanceResult.length && tokenBalanceResult[0] && tokenBalanceResult[0].length){
            let _tokenAmounts = [];
            _tokenAmounts.push(ethValueInUSD);

            tokenBalanceResult.forEach((balanceResponse, index) => {
                let balance = balanceResponse[0];
                let token = tokens[index];
                let price = tokenPrices[index] || new Amount(0);

                let tokenValueInUSD = new TokenValueInUSD(balance, token, price.bigNumber, false, 3, chainId);
                // console.debug(`tokenValueInUSD =>`, tokenValueInUSD);
                _tokenAmounts.push(tokenValueInUSD);
            });

            // console.debug(`tokenAmounts =>`, _tokenAmounts);
            setTokenAmounts(_tokenAmounts);
        }
    }, [ethValueInUSD, tokenBalanceResult, chainId, tokenPricesLoaded, tokenPrices]);


    return tokenAmounts;
};

export const buildToken = (name, chainId, isTestToken) => {
    let tokenBaseInfo = getToken(name, chainId);
    let logo = DappTokenLogosMap[tokenBaseInfo?.address && tokenBaseInfo?.address.toLocaleLowerCase()] || DefaultLogo;
    let token = new ERCToken({
        ...tokenBaseInfo,
        logoURI: logo,
        native: tokenBaseInfo?.isNative,
        testToken: isTestToken === true,
    });

    return token;
};

export const mockOrderHistory = (portfolio) => {
    let orders = [];

    let instrument = portfolio?.instrument;

    let orderId = 1;
    let orderType = 'Buy';
    let status = 'Canceled';
    let tradingSide = 1;
    let orderTimeUnix = 1683252152;
    let orderSizeAmount = new TokenAmount('10000', TradingOrderSize);
    let triggerPrice = new TokenAmount('28000000000', instrument?.settleToken, false, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
    let orderPrice = new TokenAmount('28000000000', instrument?.settleToken, false, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
    let orderPriceTxt = 'Market';
    let orderValueInUSD = new Amount(orderSizeAmount.amount.bigNumber.times(orderPrice.amount.bigNumber));
    let posId = 0;

    let order = new OrderHistory({
        orderId,
        instrument,
        tradingSide,
        orderTimeUnix,
        orderSizeAmount,
        triggerPrice,
        orderPrice,
        orderPriceTxt,
        orderValueInUSD,
        status,
        orderType,
        posId,
    });

    orders.push(order);
    return orders;
};

const convertSubgraphData = (allOfInstrumentsMap, subgraphData) => {
    let instrumentId = subgraphData['_allOrder_order_instId'];
    let instrument = new Instrument({
        ...allOfInstrumentsMap[instrumentId],
    });

    // ActionLogged actionType:
    // 1. market order executed
    // 2. pending order appended
    // 3. pending order executed
    // 4. pending order cancelled
    // 5. position liquidation
    // 6. portfolio liquidation
    // @dev _posId is set to non-zero only for 5 position liquidation
    let actionType = subgraphData.actionType;

    let orderId = subgraphData.id;
    let portfolioAddress = subgraphData['_portfolio'];
    let orderType = TRADING_ORDER_TYPE_MAP[subgraphData['_allOrder_order_ordType']];
    let orderHistoryType = (actionType === 5 || actionType === 6) ? TRADING_ORDER_TYPE.Liquidation : orderType;
    let status = (actionType === 5 || actionType === 6) ? 'Liquidated' : TRADING_ORDER_STATE_MAP[subgraphData['_allOrder_order_ordState']];
    let tradingSide = subgraphData['_allOrder_order_ordSide'];
    let leverage = parseInt(subgraphData['_allOrder_order_ordLeverage'], 10);
    let pendingOrdId = parseInt(subgraphData['_allOrder_pendingOrdId'], 10);
    let orderTimeUnix = subgraphData['blockTimestamp'];
    let orderSizeAmount = new TokenAmount(subgraphData['_allOrder_order_ordSize'], TradingOrderSize);
    let triggerPrice = new TokenAmount(subgraphData['_allOrder_triggerPrice'], instrument?.settleToken, false, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
    let triggerPriceTxt = (actionType === 5 || actionType === 6) ? '--' : triggerPrice.amount.formativeValue;
    let fulfillPrice = new TokenAmount(subgraphData['_allOrder_order_fulfillPrice'], instrument?.settleToken, false, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
    let orderPrice = orderType !== TRADING_ORDER_TYPE.Limit ? fulfillPrice : triggerPrice;
    let orderPriceTxt = orderType !== TRADING_ORDER_TYPE.Stop ? 'Market' : orderPrice.amount.formativeValue;
    let orderValue = orderSizeAmount.amount.bigNumber.times(orderPrice.amount.bigNumber);
    let orderValueInUSD = new Amount(orderValue);
    let orderVolumeBn = orderValue.times(leverage);
    let orderVolume = new Amount(orderVolumeBn);
    let posId = subgraphData['_posId'];

    let pnl = new StateAmount(0);

    let order = new OrderHistory({
        orderId,
        actionType,
        portfolioAddress,
        instrument,
        tradingSide,
        leverage,
        pendingOrdId,
        orderTimeUnix,
        orderSizeAmount,
        triggerPrice,
        triggerPriceTxt,
        fulfillPrice,
        orderPrice,
        orderPriceTxt,
        orderValueInUSD,
        orderVolume,
        status,
        orderType,
        orderHistoryType,
        posId,
        pnl,
    });

    // console.debug(`order =>`, order);

    return order;
};

const mockSubgraphOrderHistory = (orderHistoryResponse) => {
    let record = {
        "id": "0xd90515ae5026be2192b93333c040c49fa1883f7a8559048acf532147836f885911000000",
        "actionType": 5,
        "_portfolio": "0x6a9c07c875893959308ca50081c079f5533c1390",
        "_allOrder_order_ordType": 0,
        "_posId": "3",
        "blockNumber": "46214839",
        "blockTimestamp": "1716255251",
        "transactionHash": "0xd90515ae5026be2192b93333c040c49fa1883f7a8559048acf532147836f8859",
        "_allOrder_triggerPrice": "0",
        "_allOrder_pendingOrdId": "0",
        "_allOrder_order_stopPrice": "0",
        "_allOrder_order_portfolio": "0x0000000000000000000000000000000000000000",
        "_allOrder_order_ordState": 0,
        "_allOrder_order_ordSize": "1000",
        "_allOrder_order_ordSide": 0,
        "_allOrder_order_ordLeverage": "0",
        "_allOrder_order_instId": "1",
        "_allOrder_order_fulfillPrice": "0",
        "_allOrder_appendedTimestamp": "0"
    };

    let _orderHistoryResponse = [
        record,
        ...orderHistoryResponse
    ];
    return _orderHistoryResponse;
};

const buildOrderHistory = (allOfInstrumentsMap, orderHistoryResponse) => {
    let orders = [];
    let needToCheckExist = [TRADING_ACTION_LOGGED_TYPE.pending_order_appended, TRADING_ACTION_LOGGED_TYPE.pending_order_cancelled, TRADING_ACTION_LOGGED_TYPE.pending_order_executed];
    let existPendingOrderIds = [];

    let _orderHistoryResponse = orderHistoryResponse;
    // _orderHistoryResponse = mockSubgraphOrderHistory(_orderHistoryResponse);

    _orderHistoryResponse.forEach((subgraphData, index) => {
        let order = convertSubgraphData(allOfInstrumentsMap, subgraphData);
        if(needToCheckExist.includes(order.actionType)){
            if(!existPendingOrderIds.includes(order.pendingOrdId)){
                orders.push(order);
                existPendingOrderIds.push(order.pendingOrdId);
            }
        } else {
            orders.push(order);
        }
    });
    return orders;
};

const buildSubgraphQueryCondition = (conditions) => {
    let query = '';
    conditions.forEach(condition => {
        query = `${condition?.key}:"${condition?.value}",${query}`;
    });
    query = `{${query}}`;
    return query;
};

export const fetchOrderHistoryEventFromSubgraph = ({chainId, portfolioAddress = '', reqIdentifier = 0, startTimestamp = 0, first = 1000,}) => {
    return new Promise((resolve, reject) => {
        let url = ContractConfig.subgraph(chainId);

        let conditions = [];
        if(portfolioAddress){
            conditions.push({
                key: '_portfolio',
                value: portfolioAddress,
            });
        }
        if(reqIdentifier){
            conditions.push({
                key: '_reqIdentifier',
                value: reqIdentifier,
            });
        }
        if(startTimestamp){
            conditions.push({
                key: 'blockTimestamp_gte',
                value: startTimestamp,
            });
        }
        let queryConditions = buildSubgraphQueryCondition(conditions);


        let query = {
            query: `{
              actionLoggeds(
                first: ${first}
                where: ${queryConditions}
                orderBy: blockTimestamp
                orderDirection: desc
              ) {
                id
                actionType
                _portfolio
                _allOrder_order_ordType
                _allOrder_appendedTimestamp
                _allOrder_order_fulfillPrice
                _allOrder_order_instId
                _allOrder_order_ordLeverage
                _allOrder_order_ordSide
                _allOrder_order_ordSize
                _allOrder_order_ordState
                _allOrder_order_portfolio
                _allOrder_order_stopPrice
                _allOrder_pendingOrdId
                _allOrder_triggerPrice
                _posId
                _reqIdentifier
                blockTimestamp
              }
            }`,
        };

        // console.debug(`order history: request url =>`, url, `query =>`, query);

        Axios
            .post(url, query)
            .then((response) => {
                // console.debug(`order history: request url =>`, url, `response =>`, response);

                let _events = response?.data?.data?.actionLoggeds || [];
                resolve(_events);
                // console.debug(`order history:`, _events);
            })
            .catch((e) => {
                console.log(e);
                resolve([]);
            });
    });
};

export const useAllPortfolioAddress = () => {
    const web3Context = useContext(WebThreeContext);

    const [isolatedActivated, setIsolatedActivated] = useState(false);
    const [impAddress, setIMPAddress] = useState('');
    const [crossActivated, setCrossActivated] = useState(false);
    const [cmpAddress, setCPMAddress] = useState('');

    const getPortfolioCalls = useMemo(() => {
        let calls = [];

        if (web3Context.account) {
            calls = [
                {
                    contract: ContractConfig.TradingMeta.IsolatedMarginPortfolioFactory,
                    callMethod: 'isolatedMarginPortfolio',
                    args: [web3Context.account]
                },
                {
                    contract: ContractConfig.TradingMeta.CrossMarginPortfolioFactory,
                    callMethod: 'crossMarginPortfolio',
                    args: [web3Context.account]
                }
            ];
        }

        return calls;
    }, [web3Context]);
    const getPortfolioCallsResult = useContractCalls(getPortfolioCalls) ?? [];
    useEffect(() => {
        if (getPortfolioCallsResult && getPortfolioCallsResult.length && getPortfolioCallsResult[0] && getPortfolioCallsResult[1]) {
            if (getPortfolioCallsResult[0].length && getPortfolioCallsResult[0][0]) {
                // console.debug(`isolatedMarginPortfolio =>`, getPortfolioCallsResult[0][0]);
                setIsolatedActivated(getPortfolioCallsResult[0][0] !== ApplicationConfig.emptyContractAddress);
                setIMPAddress(getPortfolioCallsResult[0][0]);
            } else {
                setIsolatedActivated(false);
                setIMPAddress('');
            }

            if (getPortfolioCallsResult[1].length && getPortfolioCallsResult[1][0]) {
                // console.debug(`crossMarginPortfolio =>`, getPortfolioCallsResult[1][0]);
                setCrossActivated(getPortfolioCallsResult[1][0] !== ApplicationConfig.emptyContractAddress);
                setCPMAddress(getPortfolioCallsResult[1][0]);
            } else {
                setCrossActivated(false);
                setCPMAddress('');
            }

            // console.debug(
            //     `isolatedActivated`, isolatedActivated,
            //     `impAddress`, impAddress,
            //     `crossActivated`, crossActivated,
            //     `cmpAddress`, cmpAddress,
            // );
        }
    }, [getPortfolioCallsResult]);

    return {
        isolatedActivated, impAddress, crossActivated, cmpAddress
    };
};


export const useInstruments = (..._instrumentCodes) => {
    let instrumentCodes = _instrumentCodes && _instrumentCodes.length && _instrumentCodes[0] instanceof Array ? _instrumentCodes[0] : _instrumentCodes;

    const web3Context = useContext(WebThreeContext);
    const chainIdInContext = web3Context.chainId;
    const chainId = isSupportedChain(chainIdInContext) ? chainIdInContext : DefaultChain.chainId;
    const instrumentsCache = fetchInstrumentsFromLocalCache(chainId);

    const availableInstruments =
        useMemo(() => {
            if (instrumentsCache && instrumentsCache.length && instrumentsCache.length >= instrumentCodes.length) {
                return instrumentsCache;
            }

            let _instruments = ENABLE_INSTRUMENTS.map((instrumentCode) => {
                let instrumentConfig = AVAILABLE_INSTRUMENTS[instrumentCode];

                let instrumentId = instrumentConfig.instrumentId;
                // override the instrumentId for the particular Chain
                if(INSTRUMENT_ID_MAP[chainId] && INSTRUMENT_ID_MAP[chainId][instrumentCode]){
                    instrumentId = INSTRUMENT_ID_MAP[chainId][instrumentCode];
                }

                let tokenA = buildToken(instrumentConfig.tokenA, chainId);
                let tokenB = buildToken(instrumentConfig.tokenB, chainId);
                let settleToken = buildToken(instrumentConfig.settleToken, chainId);
                let tradingPair = instrumentConfig.tradingPair;
                let tradingViewSymbol = instrumentConfig.tradingViewSymbol;

                return new Instrument({
                    instrumentId, tokenA, tokenB, settleToken, tradingViewSymbol, tradingPair
                });
            });

            saveToLocalStorage(`${AVAILABLE_INSTRUMENTS_CACHE_KEY}_${chainId}`, _instruments, 24 * 60 * 60 * 1000);

            return _instruments;
        }, [instrumentsCache, chainId]) ?? [];

    const instruments =
        useMemo(() => {
            // console.debug(`useInstruments => `, instrumentCodes);

            if (availableInstruments.length) {
                let _instruments = availableInstruments.filter((instrument) => {
                    return instrumentCodes.includes(instrument.instrumentCode);
                });

                // console.debug(`useInstruments => `, _instruments);
                return _instruments;
            }

            return [];
        }, [availableInstruments, instrumentCodes]) ?? [];

    return _instrumentCodes && _instrumentCodes.length === 1 && !(_instrumentCodes[0] instanceof Array) && instruments.length
        ? instruments[0]
        : instruments;
};

export const useInstrument = (_instrumentCode) => {
    const instrumentCode = _instrumentCode === undefined ? DEFAULT_INSTRUMENT_CODE : _instrumentCode;
    const instrument = useInstruments(instrumentCode);
    return instrument;
};


const fetchBinanceTradingTicker = (instrument) => {
    const buildInstrumentTradingTicker = (tickerData) => {
        let highPrice = new Amount(tickerData?.highPrice, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
        let lowPrice = new Amount(tickerData?.lowPrice, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
        let priceChangePercent = new Amount(tickerData?.priceChangePercent);

        let instrumentTradingTicker = new InstrumentTradingTicker({
            priceChangePercent,
            highPrice,
            lowPrice,
        });
        return instrumentTradingTicker;
    };

    return new Promise((resolve, reject) => {
        // https://api.binance.com/api/v3/exchangeInfo
        // https://binance-docs.github.io/apidocs/spot/en/#exchange-information
        let tickerURL = `/binance-api/api/v3/ticker/24hr?symbol=${instrument?.tradingPair}`;
        Axios.get(tickerURL)
            .then((response) => {
                // console.debug(`fetchCoinBaseTradingTicker response =>`, response);

                let data = response?.data;
                let instrumentTradingTicker = buildInstrumentTradingTicker(data);
                resolve(instrumentTradingTicker);
            })
            .catch((error) => {
                console.log(error);
                resolve(new InstrumentTradingTicker({}));
            });
    });
};

const fetchCoinBaseTradingTicker = (instrument) => {
    const buildInstrumentTradingTicker = (tickerData) => {
        let highPrice = new Amount(tickerData?.high, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
        let lowPrice = new Amount(tickerData?.low, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);

        let open = new BigNumber(tickerData?.open);
        let last = new BigNumber(tickerData?.last);
        let change = last.minus(open).times(100).div(open);
        let priceChangePercent = new Amount(change);

        let instrumentTradingTicker = new InstrumentTradingTicker({
            priceChangePercent,
            highPrice,
            lowPrice,
        });
        return instrumentTradingTicker;
    };

    return new Promise((resolve, reject) => {
        let tickerURL = `https://api.exchange.coinbase.com/products/${instrument?.tradingPair}/stats`;
        Axios.get(tickerURL)
            .then((response) => {
                // console.debug(`fetchCoinBaseTradingTicker response =>`, response);

                let data = response?.data;
                let instrumentTradingTicker = buildInstrumentTradingTicker(data);
                resolve(instrumentTradingTicker);
            })
            .catch((error) => {
                console.log(error);
                resolve(new InstrumentTradingTicker({}));
            });
    });
};

const doFetchInstrumentTradingTicker = (instrument) => {
    return new Promise((resolve, reject) => {
        let tickerFetcher = fetchBinanceTradingTicker;

        let tradingViewSymbol = instrument?.tradingViewSymbol;
        let exchange = tradingViewSymbol.split(':')[0];
        switch (exchange) {
            case 'COINBASE':
                tickerFetcher = fetchCoinBaseTradingTicker;
                break;
            case 'BINANCE':
                tickerFetcher = fetchBinanceTradingTicker;
                break;
        }

        tickerFetcher(instrument).then(ticker => {
            // console.debug(`doFetchInstrumentTradingTicker =>`, ticker);

            resolve(ticker);
        });
    });
};

const useFetchInstrumentTradingTicker = (instrument) => {
    const [ticker, setTicker] = useState(new InstrumentTradingTicker({}));
    const blockHeight = useBlockNumber();

    useEffect(() => {
        if(instrument?.tradingPair && instrument?.instrumentId){
            doFetchInstrumentTradingTicker(instrument).then(_ticker => {
                setTicker(_ticker);
            });
        }
    }, [instrument?.tradingPair, blockHeight]);

    return ticker;
};

export const useInstrumentMetrics = (instrument) => {
    const currentPriceAmount = usePriceFromOracle(instrument?.tokenA, instrument?.tokenB, instrument?.settleToken, instrument?.tokenA?.priceDecimals || COMPACT_PRICE_SHOW_DECIMALS);
    const {loaded: tokenBPriceLoaded, price: tokenBPriceAmount} = useTokenPriceFromOracle(instrument?.tokenB?.name);
    const currentPriceInUSDAmount = useMemo(() => {
        if(tokenBPriceLoaded){
            let amountBN = currentPriceAmount?.amount?.bigNumber.times(tokenBPriceAmount?.bigNumber);
            let amount = new Amount(amountBN, DEFAULT_VALUE_IN_USD_SHOW_DECIMALS);
            return amount;
        }

        return new Amount(0);
    }, [currentPriceAmount, tokenBPriceLoaded, tokenBPriceAmount]);


    const instrumentTradingTicker = useFetchInstrumentTradingTicker(instrument);


    const getInstrumentMetricsCalls = useMemo(() => {
        let calls = [];

        // console.debug(`instrument =>`, instrument);
        if(instrument.instrumentId !== undefined){
            calls = [
                {
                    contract: ContractConfig.TradingMeta.OIAndPnLManager,
                    callMethod: 'openInterestLongScaled',
                    args: [instrument?.instrumentId]
                },
                {
                    contract: ContractConfig.TradingMeta.OIAndPnLManager,
                    callMethod: 'openInterestShortScaled',
                    args: [instrument?.instrumentId]
                },
                {
                    contract: ContractConfig.TradingMeta.FeeManager,
                    callMethod: 'getBorrowingAPR',
                    args: [instrument?.instrumentId]
                },
                {
                    contract: ContractConfig.TradingMeta.FeeManager,
                    callMethod: 'getFundingFeeAPRbySide',
                    args: [instrument?.instrumentId, TRADING_ORDER_SIDE.Long]
                },
                {
                    contract: ContractConfig.TradingMeta.FeeManager,
                    callMethod: 'getFundingFeeAPRbySide',
                    args: [instrument?.instrumentId, TRADING_ORDER_SIDE.Short]
                },
            ];
        }

        return calls;
    }, [instrument]);
    const getInstrumentMetricsResult = useContractCalls(getInstrumentMetricsCalls) ?? [];
    const [openInterestLong, setOpenInterestLong] = useState(new TokenAmount(0));
    const [openInterestShort, setOpenInterestShort] = useState(new TokenAmount(0));
    const [borrowingFeeAPR, setBorrowingFeeAPR] = useState(new StateAmount(0));
    const [fundingFeeAPRShort, setFundingFeeAPRShort] = useState(new StateAmount(0));
    const [fundingFeeAPRLong, setFundingFeeAPRLong] = useState(new StateAmount(0));
    const [instrumentMetricLoaded, setInstrumentMetricLoaded] = useState(false);
    const convertAPRToHour = (aprResponse, invert, scale) => {
        let _scale = scale || 1;
        let bn = new BigNumber(aprResponse?._hex || 0);
        bn = invert ? bn.times(-1) : bn;
        bn = bn.div(_scale);
        // fee_manager.getFundingFeeAPRbySide(instrumen_id, 1) * 100 / 1e4 / 24 * 365
        let bnForHour = bn.div(24 * 365 * 100);
        let amount = new StateAmount(bnForHour, RATIO_DECIMALS);
        // console.debug(`convertAPRToHour:`, `aprResponse =>`, aprResponse, `invert =>`, invert, `amount =>`, amount,)

        return amount;
    };
    useEffect(() => {
        // console.debug(`getInstrumentMetricsResult =>`, getInstrumentMetricsResult);

        if(getInstrumentMetricsResult.length && getInstrumentMetricsResult[0].length){
            setOpenInterestLong(new TokenAmount(getInstrumentMetricsResult[0][0], ValueInUSD));
            setOpenInterestShort(new TokenAmount(getInstrumentMetricsResult[1][0], ValueInUSD));

            let bfScale = 1;
            // bfScale = 1000;
            let bf = convertAPRToHour(getInstrumentMetricsResult[2] && getInstrumentMetricsResult[2][0], false, bfScale);
            setBorrowingFeeAPR(bf);

            let ffl = convertAPRToHour(getInstrumentMetricsResult[3] && getInstrumentMetricsResult[3][0], true);
            setFundingFeeAPRLong(ffl);

            let ffs = convertAPRToHour(getInstrumentMetricsResult[4] && getInstrumentMetricsResult[4][0], true);
            setFundingFeeAPRShort(ffs);

            setInstrumentMetricLoaded(true);
        }
    }, [getInstrumentMetricsResult]);

    return {
        instrumentMetricLoaded,
        currentPrice: currentPriceAmount,
        instrumentTradingTicker,
        openInterestLong,
        openInterestShort,
        fundingFeeAPRLong,
        fundingFeeAPRShort,
        borrowingFeeAPR,
    };
};