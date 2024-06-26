import React, { useMemo, useState, useEffect, useContext } from 'react';
import {useContractCall, useContractCalls} from '../ContractHooks';
import ContractConfig from '../../contract/ContractConfig';
import { Price, Token } from '@uniswap/sdk-core';
import { tickToPrice, priceToClosestTick, nearestUsableTick } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import BigNumber from 'bignumber.js';
import {formatUnits, parseUnits} from '@ethersproject/units';
import fetch from 'isomorphic-fetch';
import {
    Amount,
    DEFAULT_DECIMALS,
    DEFAULT_PRICE_CALCULATE,
    DEFAULT_PRICE_SHOW_DECIMALS, TokenAmount
} from '../../utils/TokenAmountConverter';
import { getLocalStorage, saveToLocalStorage } from 'utils/LocalStorage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ApplicationConfig from '../../ApplicationConfig';
import {TOKEN_PRICE_DECIMALS} from "../TradingConstant";
import {getToken} from "../../contract/TokenContract";
import WebThreeContext from "../WebThreeProvider/WebThreeContext";

const toUniswapToken = (token) => {
    return new Token(token.chainId, token.address, token.decimals || 18, token.symbol, token.name);
};

export function useUniswapPrice(poolAddress, tokenA, tokenB, _checkOrder) {
    const checkOrder = _checkOrder === undefined ? false : _checkOrder;

    const getPriceResult = useContractCall(
        poolAddress &&
            poolAddress !== ApplicationConfig.emptyContractAddress && {
                ...ContractConfig.Uniswap.Pool,
                theAddress: poolAddress,
            },
        'slot0',
    );
    const token0 = useContractCall(
        poolAddress &&
            poolAddress !== ApplicationConfig.emptyContractAddress && {
                ...ContractConfig.Uniswap.Pool,
                theAddress: poolAddress,
            },
        'token0',
    );
    const token1 = useContractCall(
        poolAddress &&
            poolAddress !== ApplicationConfig.emptyContractAddress && {
                ...ContractConfig.Uniswap.Pool,
                theAddress: poolAddress,
            },
        'token1',
    );

    // console.debug(`useUniswapPrice: pool => `, poolAddress, 'slot0 => ', getPriceResult);
    return useMemo(() => {
        if (getPriceResult) {
            let tick = getPriceResult.tick;

            let _decimalA = parseUnits('1', tokenA.decimals);
            let _decimalB = parseUnits('1', tokenB.decimals);
            // console.log({ _decimalA, _decimalB });

            let diffDecimals = _decimalA >= _decimalB ? _decimalA / _decimalB : _decimalB / _decimalA;
            let scale = new BigNumber(diffDecimals);

            let sqrtPriceX96 = getPriceResult.sqrtPriceX96;
            let sqrtPriceX96Bn = new BigNumber(sqrtPriceX96?._hex || sqrtPriceX96);
            let b = new BigNumber('2').pow(192);

            let price = sqrtPriceX96Bn.pow(2).div(b).times(scale);
            let priceValue = price.toFixed(18);

            let priceReversal = new BigNumber('1').div(price);
            let priceReversalValue = priceReversal.toFixed(18);

            // console.debug(`price => `, priceValue, `priceReversal => `, priceReversalValue);

            let token0Address = token0[0];
            let token1Address = token1[0];

            let result = {
                tick,
                getPriceResult,
                token0Address,
                token1Address,
            };

            if (!checkOrder) {
                return {
                    ...result,
                    price: price,
                    priceValue: priceValue,
                    priceReversal: priceReversal,
                    priceReversalValue: priceReversalValue,
                };
            }

            return token0Address <= token1Address
                ? {
                      ...result,
                      price: priceReversal,
                      priceValue: priceReversalValue,
                      priceReversal: price,
                      priceReversalValue: priceValue,
                  }
                : {
                      ...result,
                      price: price,
                      priceValue: priceValue,
                      priceReversal: priceReversal,
                      priceReversalValue: priceReversalValue,
                  };
        }
        return {};
    }, [getPriceResult, token0, token1]);
}

export function toUniswapPrice(priceStrValue, tokenA, tokenB) {
    if (!tokenA || !tokenB || !priceStrValue) {
        return undefined;
    }

    if (!priceStrValue.match(/^\d*\.?\d+$/)) {
        return undefined;
    }

    let [whole, fraction] = priceStrValue.split('.');

    let decimals = fraction?.length ?? 0;
    let withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''));

    let baseToken = toUniswapToken(tokenA),
        quoteToken = toUniswapToken(tokenB);

    return new Price(
        baseToken,
        quoteToken,
        JSBI.multiply(JSBI.BigInt(10 ** decimals), JSBI.BigInt(10 ** baseToken.decimals)),
        JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
    );
}

export function priceStrToTick(priceStrValue, tokenA, tokenB, tickSpacing) {
    let price = toUniswapPrice(priceStrValue, tokenA, tokenB);

    if (priceStrValue === '0' || priceStrValue === '0.0000000000000000') {
        return buildBoundaryTick(price, tickSpacing, true);
    } else if (priceStrValue === `${ApplicationConfig.maxNumberPickerValue}`) {
        return buildBoundaryTick(price, tickSpacing, false);
    }

    return priceToTick(price);
}

export const boundaryTick = {
    10: {
        min: -887270,
        max: 887270,
    },
    60: {
        min: -887220,
        max: 887220,
    },
    200: {
        min: -887200,
        max: 887200,
    },
};

const buildBoundaryTick = (uniswapPrice, tickSpacing, min) => {
    let sorted = uniswapPrice.baseCurrency.sortsBefore(uniswapPrice.quoteCurrency);
    let boundaryTickConfig = boundaryTick[tickSpacing];

    if (min) {
        return sorted ? boundaryTickConfig.min : boundaryTickConfig.max;
    }
    return sorted ? boundaryTickConfig.max : boundaryTickConfig.min;
};

export function priceToTick(uniswapPrice) {
    return priceToClosestTick(uniswapPrice);
}

/**
 * The initial fee tiers and tick spacings supported are
 *      0.05% (with a tick spacing of 10, approximately 0.10% between initializable ticks),
 *      0.30% (with a tick spacing of 60, approximately 0.60% between initializable ticks),
 *      and 1% (with a tick spacing of 200, approximately 2.02% between ticks.
 * @param tick
 * @param tickSpacing
 * @returns {number}
 */
const toClosestFarmTick = (tick, tickSpacing) => {
    let adjustedTick = Math.floor(tick / tickSpacing) * tickSpacing;
    // console.debug(
    //   `toClosestFarmTick: tick => `,
    //   tick,
    //   `adjustedTick => `,
    //   adjustedTick,
    //   `tickSpacing => `,
    //   tickSpacing
    // );
    return adjustedTick;
};

export function priceStrToFarmTick(priceStrValue, tokenA, tokenB, tickSpacing) {
    let tick = priceStrToTick(priceStrValue, tokenA, tokenB, tickSpacing);
    return nearestUsableTick(tick, tickSpacing);
}

export function priceToFarmTick(uniswapPrice, tickSpacing) {
    let tick = 0;

    if (uniswapPrice.toFixed(18) === '0.000000000000000000') {
        tick = buildBoundaryTick(uniswapPrice, tickSpacing, true);
    } else if (uniswapPrice.toFixed(0) === `${ApplicationConfig.maxNumberPickerValue}`) {
        tick = buildBoundaryTick(uniswapPrice, tickSpacing, false);
    } else {
        tick = priceToClosestTick(uniswapPrice);
    }

    return nearestUsableTick(tick, tickSpacing);
}

export function tickToPriceStr(tick, tokenA, tokenB) {
    let price = tickToUniswapPrice(tick, tokenA, tokenB);
    return price.toFixed(16);
}

export function tickToUniswapPrice(tick, tokenA, tokenB) {
    let price = tickToPrice(toUniswapToken(tokenA), toUniswapToken(tokenB), tick);
    return price;
}

const getCoingeckoSimpleTokenPriceUri = (contracts, quoteId, platformId) => {
    let url = `/token-api/${platformId}?contract_addresses=${contracts}&vs_currencies=${quoteId}`;

    let urlConfig = import.meta.env.VITE_CG_API_KEY;
    if (urlConfig) {
        url = `https://pro-api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contracts}&vs_currencies=${quoteId}&x_cg_pro_api_key=${urlConfig}`;
    }
    return url;
};

export async function getCoingeckoTokenPrices(contracts, _quote, platform) {
    let quote = _quote ?? 'usd';
    let tokenContracts = [];
    let newContracts = [];
    let priceMap = {};
    contracts.forEach((contract) => {
        let address = contract?.toLocaleLowerCase();

        tokenContracts.push(address);

        let data = getLocalStorage(`Price_${address}`);
        if (data === '') {
            newContracts.push(address);
        } else {
            console.debug(`fetched price from local cache: address => `, contract, `price => `, data[quote]);
            priceMap[address] = data[quote];
        }
    });
    if (newContracts.length) {
        const url = getCoingeckoSimpleTokenPriceUri(newContracts.join(','), quote, platform ?? 'ethereum');
        const res = await fetch(url);
        const data = await res.json();

        // console.debug(`price data from Coingecko: `, data);
        for (let i = 0; i < newContracts.length; i++) {
            if (data[newContracts[[i]]] && data[newContracts[i]][quote]) {
                // console.debug(`Storing price in Local for ${newContracts}`)
                await saveToLocalStorage(
                    `Price_${newContracts[i]}`,
                    data[newContracts[i]],
                    ApplicationConfig.localPriceTTL,
                );
                let _price = data[newContracts[i]][quote];
                console.debug(`fetched price from coingecko: address => `, newContracts[i], `price => `, _price);
                priceMap[newContracts[i]] = _price;
            } else {
                console.info(`the price for token[${newContracts[i]}] is not fetched!`);
                priceMap[newContracts[i]] = '';
            }
        }
    }
    let result = tokenContracts.map((address) => priceMap[address]);
    return result;
}

/**
 *
 * @param contracts List of contract addresses.
 * @param opts.quote Quote currency. "usd" by default.
 * @param opts.platform Platform. "ethereum" by default.
 * @param opts.interval Refresh interval in milliseconds. 1 minute by default.
 * @public
 */
export function useCoingeckoTokenPrices(contracts, opts) {
    const [prices, setPrices] = useState(undefined);
    let filtered = [];
    if (Array.isArray(contracts)) {
        filtered = contracts.filter((contract) => contract);
    }
    useEffect(() => {
        async function getPrice() {
            try {
                if (filtered && filtered.length) {
                    let price = await getCoingeckoTokenPrices(
                        filtered,
                        opts.quote ?? 'usd',
                        opts.platform ?? 'arbitrum-one',
                    );
                    // console.debug(`fetched price: address => `, filtered, `price => `, price);
                    setPrices(price);
                }
            } catch (err) {
                console.error(err);
            }
        }

        getPrice();

        const intervalId = setInterval(getPrice, 3600000);

        return () => clearInterval(intervalId);
    }, [contracts.join(','), opts.quote, opts.platform, opts.interval]);

    return prices;
}

export function useCoingeckoTokenPrice(contract, opt, platform) {
    const contracts = (contract && [contract]) || [];
    const getPriceResult =
        useCoingeckoTokenPrices(contracts, {
            quote: opt,
            platform: platform,
        }) ?? [];

    return (getPriceResult && getPriceResult.length && getPriceResult[0]) || undefined;
}

export function estimateTokenPrice(tokenA, tokenB, perAToB) {
    // console.debug(`estimateTokenPrice: tokenA => `, tokenA, `tokenB => `, tokenB, `perAToB => `, perAToB);

    if (tokenA?.currentMarketPrice && tokenB?.currentMarketPrice) {
        return {
            tokenAPrice: tokenA?.currentMarketPrice,
            tokenBPrice: tokenB?.currentMarketPrice,
        };
    }

    if (!tokenA?.currentMarketPrice && tokenB?.currentMarketPrice && perAToB) {
        let price = new BigNumber(perAToB).times(tokenB.currentMarketPrice).toFixed(DEFAULT_PRICE_CALCULATE);
        tokenA.updateCurrentPrice && tokenA.updateCurrentPrice(price);
        console.debug(`estimateTokenPrice: tokenAPrice => `, price, `tokenA => `, tokenA);

        let priceCache = {
            usd: price,
        };
        saveToLocalStorage(
            `Price_${tokenA?.address?.toLocaleLowerCase()}`,
            priceCache,
            ApplicationConfig.localPriceTTL,
        );

        return {
            tokenAPrice: price,
            tokenBPrice: tokenB?.currentMarketPrice,
        };
    }

    if (tokenA?.currentMarketPrice && !tokenB?.currentMarketPrice && perAToB) {
        let price = new BigNumber(tokenA?.currentMarketPrice).div(perAToB).toFixed(DEFAULT_PRICE_CALCULATE);
        tokenB.updateCurrentPrice && tokenB.updateCurrentPrice(price);
        console.debug(`estimateTokenPrice: tokenBPrice => `, price, `tokenB => `, tokenB);

        let priceCache = {
            usd: price,
        };
        saveToLocalStorage(
            `Price_${tokenB?.address?.toLocaleLowerCase()}`,
            priceCache,
            ApplicationConfig.localPriceTTL,
        );

        return {
            tokenAPrice: tokenA?.currentMarketPrice,
            tokenBPrice: price,
        };
    }

    return {
        tokenAPrice: '',
        tokenBPrice: '',
    };
}

export function useEstimateTokenPrice(tokenA, tokenB, perAToB) {
    return useMemo(() => {
        return estimateTokenPrice(tokenA, tokenB, perAToB);
    }, [tokenA, tokenB, perAToB]);
}

export function PriceRangeItem({ title, className, price, tokenA, tokenB, invert, showSwitchHandle = false }) {
    const [switchOrder, onSwitchOrder] = useLocalStorage(`PRICE_ORDER_${tokenA?.symbol}_${tokenB?.symbol}`, false);

    const invertPrice = useMemo(() => {
        let priceBn = new BigNumber(price ?? 0);
        if (priceBn.toNumber()) {
            let _invertPriceBn = new BigNumber(1).div(priceBn);
            let _invertPrice = new Amount(_invertPriceBn, DEFAULT_PRICE_SHOW_DECIMALS);
            return _invertPrice.formativeNumber;
        }

        if (price && priceBn.toNumber() === 0) {
            return '∞';
        }

        return 'N/A';
    }, [price]);

    const formativePrice = useMemo(() => {
        let _formativePrice = new Amount(price, DEFAULT_PRICE_SHOW_DECIMALS);
        let max = new BigNumber(ApplicationConfig.maxNumberPickerValue);
        return _formativePrice.bigNumber.comparedTo(max) > 0 ? '∞' : _formativePrice.formativeNumber;
    }, [price]);

    useEffect(() => {
        if (invert !== undefined) {
            onSwitchOrder(invert);
        }
    }, [invert]);

    useEffect(() => {
        console.debug(`current switchOrder value => `, switchOrder);
    }, [switchOrder]);

    return (
        <div className={`f_r_l ${className ?? ''}`}>
            <div className="b cg">{title}</div>
            <div className="b m_l_10 m_r_4">{switchOrder ? invertPrice : formativePrice}</div>
            <div className="cg f_ms_r">
                {switchOrder ? `${tokenA?.symbol} per ${tokenB?.symbol}` : `${tokenB?.symbol} per ${tokenA?.symbol}`}
            </div>

            {showSwitchHandle && (
                <div
                    className="m_l_5 i_icon_button i_token_switch i_icon_16"
                    onClick={() => {
                        onSwitchOrder(!switchOrder);
                    }}
                ></div>
            )}
        </div>
    );
}

export function usePriceFromOracle(tokenA, tokenB, settleToken, decimals) {
    const _decimals = decimals === undefined ? DEFAULT_PRICE_SHOW_DECIMALS : decimals;
    const getPriceResult = useContractCall(tokenA?.address && tokenB?.address && ContractConfig.TradingMeta.PriceAggregator, 'getRelativePriceEst', [tokenA?.address, tokenB?.address]);
    const price = useMemo(() => {
        if(getPriceResult && getPriceResult.length){
            // console.debug(`getPriceResult =>`, getPriceResult);

            let _price = new TokenAmount(getPriceResult[0], settleToken, false, _decimals);
            // console.debug(`price =>`, _price, getPriceResult);

            return _price;
        }

        return new TokenAmount(0, settleToken);
    }, [getPriceResult]);

    return price;
}

export function useInstrumentPricesFromOracle(..._instruments) {
    const instruments = _instruments && _instruments.length && _instruments[0] instanceof Array ? _instruments[0] : _instruments;

    const getPriceCalls = useMemo(() => {
        let calls = [];

        if(instruments.length){
            calls = instruments.filter((_instrument) => {
                return _instrument?.tokenA?.address && _instrument?.tokenB?.address;
            }).map((_instrument) => {
                return {
                    contract: ContractConfig.TradingMeta.PriceAggregator,
                    callMethod: 'getRelativePriceEst',
                    args: [_instrument?.tokenA?.address, _instrument?.tokenB?.address]
                };
            });
        }

        return calls;
    }, [instruments]);

    const getPricesResult = useContractCalls(getPriceCalls) ?? [];
    const prices = useMemo(() => {
        let _getPricesResult = getPricesResult.filter((result) => {
            return result && result.length;
        });
        if(_getPricesResult.length){
            // console.debug(`getPricesResult =>`, getPricesResult);

            let _prices = _getPricesResult.map((priceResponse, index) => {
                let tokenB = instruments[index].settleToken;

                let n = formatUnits(priceResponse[0] || '0', tokenB?.decimals);
                let _price = new Amount(n, DEFAULT_PRICE_CALCULATE);
                // console.debug(`prices =>`, _price, getPricesResult);

                return _price;
            });


            // console.debug(`useInstrumentPricesFromOracle: _prices =>`, _prices);
            return _prices;
        }

        return [];
    }, [getPricesResult]);

    const [loaded, setLoaded] = useState(false);
    const [priceMap, setPriceMap] = useState({});
    useEffect(() => {
        if(instruments.length && prices.length && instruments.length === prices.length){
            let map = {};
            prices.forEach((price, index) => {
                let instrumentId = instruments[index]?.instrumentId;
                map[instrumentId] = price;
            });

            setLoaded(true);
            setPriceMap(map);
        }
    }, [instruments.length, prices]);

    return {
        loaded,
        prices,
        priceMap,
    };
}

export function useInstrumentTokenPricesFromOracle(..._instruments) {
    const instruments = _instruments && _instruments.length && _instruments[0] instanceof Array ? _instruments[0] : _instruments;

    const getPriceCalls = useMemo(() => {
        let calls = [];

        if(instruments.length){
            calls = instruments.filter((_instrument) => {
                return _instrument?.tokenA?.address && _instrument?.tokenB?.address;
            }).map((_instrument) => {
                return {
                    contract: ContractConfig.TradingMeta.PriceAggregator,
                    callMethod: 'getPriceEst',
                    args: [_instrument?.tokenA?.address]
                };
            });
        }

        return calls;
    }, [instruments]);

    const getPricesResult = useContractCalls(getPriceCalls) ?? [];
    const prices = useMemo(() => {
        if(getPricesResult && getPricesResult.length && getPricesResult[0] && getPricesResult[0].length){
            // console.debug(`getPricesResult =>`, getPricesResult);

            let _prices = getPricesResult.map((priceResponse) => {
                let decimals = TOKEN_PRICE_DECIMALS;
                let decimalsResponse = parseInt(priceResponse[1], 10);
                if(decimalsResponse >= 6){
                    decimals = `${decimalsResponse}`.split('0').length - 1;
                }
                if(decimalsResponse === 1){
                    decimals = 0;
                }

                let n = formatUnits(priceResponse[0] || '0', decimals);
                let _price = new Amount(n, DEFAULT_PRICE_SHOW_DECIMALS);
                // console.debug(`prices =>`, _price, getPricesResult);

                return _price;
            });


            // console.debug(`useInstrumentTokenPricesFromOracle: _prices =>`, _prices);
            return _prices;
        }

        return new Amount(0);
    }, [getPricesResult]) ?? [];

    const priceMap = useMemo(() => {
        if(instruments.length && prices.length && instruments.length === prices.length){
            let map = {};
            prices.forEach((price, index) => {
                let instrumentId = instruments[index]?.instrumentId;
                map[instrumentId] = price;
            });
            return map;
        }
        return {};
    }, [instruments, prices]) ?? {};

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if(getPriceCalls.length){
            if(prices.length){
                setLoaded(true);
            }
        }else{
            setLoaded(true);
        }
    }, [getPriceCalls, prices]);

    return {
        loaded,
        prices,
        priceMap,
    };
}

export function useTokenPricesFromOracle(..._tokens) {
    const tokensPrams = _tokens && _tokens.length && _tokens[0] instanceof Array ? _tokens[0] : _tokens;

    const web3Context = useContext(WebThreeContext);
    const tokens = useMemo(() => {
        if(tokensPrams.length){
            return tokensPrams.map(_token => {
                let token = _token?.name ? _token : getToken(_token, web3Context.chainId);
                return token;
            }).filter((token) => {
                return token?.address;
            });
        }

        return [];
    }, [tokensPrams, web3Context?.chainId]);

    const getPriceCalls = useMemo(() => {
        let calls = [];

        if(tokens.length){
            calls = tokens.map((token) => {
                return {
                    contract: ContractConfig.TradingMeta.PriceAggregator,
                    callMethod: 'getPriceEst',
                    args: [token?.address]
                };
            });
        }

        return calls;
    }, [tokens]);

    const getPricesResult = useContractCalls(getPriceCalls) ?? [];
    const [prices, setPrices] = useState([]);
    const [priceMap, setPriceMap] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // console.debug(
        //     `getPricesResult =>`, getPricesResult,
        //     `getPriceCalls =>`, getPriceCalls,
        //     `tokens =>`, tokens,
        // );
        if(getPricesResult.length && getPricesResult[0] && getPricesResult[0].length){
            let _prices = getPricesResult.map((priceResponse) => {
                let decimals = TOKEN_PRICE_DECIMALS;
                let decimalsResponse = parseInt(priceResponse[1], 10);
                if(decimalsResponse >= 6){
                    decimals = `${decimalsResponse}`.split('0').length - 1;
                }
                if(decimalsResponse === 1){
                    decimals = 0;
                }

                let n = formatUnits(priceResponse[0] || '0', decimals);
                let _price = new Amount(n, DEFAULT_PRICE_SHOW_DECIMALS);
                // console.debug(`prices =>`, _price, getPricesResult);

                return _price;
            });

            let map = {};
            _prices.forEach((price, index) => {
                let name = tokens[index]?.name;
                map[name] = price;
            });

            setPrices(_prices);
            setPriceMap(map);
            setLoaded(true);
        }
    }, [getPricesResult]);

    return {
        loaded,
        prices,
        priceMap,
    };
}

export function useTokenPriceFromOracle(token) {
    const {loaded, prices} = useTokenPricesFromOracle(token);
    const price = useMemo(() => {
        if(loaded && prices.length){
            return prices[0];
        }

        return new Amount(0);
    }, [loaded, prices]);

    return {
        loaded,
        price
    }
}