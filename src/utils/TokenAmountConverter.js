import { formatUnits, parseUnits } from '@ethersproject/units';
import { getToken } from '../contract/TokenContract';
import { numberFormatAndGetApprox, toInteger } from './NumberFormat';
import BigNumber from 'bignumber.js';

export const DEFAULT_DECIMALS = 18;
export const DEFAULT_TOKEN_AMOUNT_SHOW_DECIMALS = 3;
export const STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS = 2;
export const DEFAULT_VALUE_IN_USD_SHOW_DECIMALS = 2;
export const RATIO_SHOW_DECIMALS = 2;
export const DEFAULT_PRICE_SHOW_DECIMALS = 4;
export const COMPACT_PRICE_SHOW_DECIMALS = 2;
export const DEFAULT_PRICE_CALCULATE = 18;

export const DECIMAL_PLACES_STRATEGY_ROUNDED = 4;
export const DECIMAL_PLACES_STRATEGY_SAMLL = 1;

/**
 * number to bignumber
 * @param token
 * @param amount
 * @param chainId
 * @returns {*}
 */
export function toNumberOnChain(_amount, token, chainId) {
    let amount = _amount || 0;
    let tokenConfig = getToken(token, chainId);
    let bn = parseUnits(amount, tokenConfig.decimals || DEFAULT_DECIMALS);
    return toInteger(bn);
}

/**
 * bignumber to number
 * @param token: token symbol or token object(e.g {
        "chainId": 42161,
        "address": "0xD74f5255D557944cf7Dd0E45FF521520002D5748",
        "name": "USDs",
        "symbol": "USDs",
        "logoURI": "/src/components/Coin/img/token_usds.svg",
        "decimals": 18
    })
 * @param amount
 * @param chainId
 * @returns {{result, approximation, resultBigNumber}}
 */
export function toNumber(_amount, token, chainId) {
    let amount = _amount || 0;
    let tokenConfig = token && typeof token === 'string' ? getToken(token, chainId) : token;
    let n = formatUnits(amount, tokenConfig?.decimals || DEFAULT_DECIMALS);
    let formatResult = numberFormatAndGetApprox(n);
    return formatResult;
}

/**
 * bignumber to number, and format result
 * @param token
 * @param amount
 * @param chainId
 */
export function toNumberFormat(amount, token, chainId) {
    let { result } = toNumber(amount, token, chainId);
    return result;
}

export class Amount {
    value = 0;
    bigNumber = new BigNumber(0);
    formativeValue = '';
    fixedFormativeValue = '';
    formativeNumber = '';

    /**
     * Amount
     * @param amount
     * @param decimals
     * @param decimalPlacesStrategy: 4 -> rounded; 1 - > small. eg:
     *              4: 0.12345 -> 0.1235
     *              1: 0.12345 -> 0.1234
     * @param defaultFormativeValue
     */
    constructor(amount, decimals, decimalPlacesStrategy, defaultFormativeValue) {
        let { result, fixedResult, approximation, resultBigNumber } = numberFormatAndGetApprox(
            amount,
            decimals,
            decimalPlacesStrategy,
            defaultFormativeValue,
        );
        this.value = amount || 0;
        this.bigNumber = resultBigNumber;
        this.formativeValue = result;
        this.fixedFormativeValue = fixedResult;
        this.formativeNumber = approximation;
    }
}

export class TokenAmount {
    token = {};
    amount = new Amount(0);
    amountOnChain = new Amount(0);

    constructor(_amountNumber, token, toAmountOnChain, _showDecimals, chainId, defaultFormativeValue, decimalPlacesStrategy) {
        let tokenConfig = token && typeof token === 'string' ? getToken(token, chainId) : token;
        let amountNumber =
            _amountNumber && _amountNumber.toFixed && !toAmountOnChain
                ? _amountNumber.toFixed(0)
                : _amountNumber || '0';
        amountNumber = typeof amountNumber === 'number' ? amountNumber.toString() : amountNumber;

        this.token = tokenConfig;

        let showDecimals = _showDecimals || DEFAULT_TOKEN_AMOUNT_SHOW_DECIMALS;

        if (!toAmountOnChain) {
            this.amountOnChain = new Amount(amountNumber, showDecimals);

            let n = formatUnits(amountNumber || '0', tokenConfig?.decimals || DEFAULT_DECIMALS);
            this.amount = new Amount(n, showDecimals, decimalPlacesStrategy, defaultFormativeValue);
        } else {
            this.amount = new Amount(amountNumber, showDecimals, decimalPlacesStrategy, defaultFormativeValue);

            let reFixNumber = new BigNumber(amountNumber || '0').toFixed(tokenConfig?.decimals);
            let n = parseUnits(reFixNumber, tokenConfig?.decimals || DEFAULT_DECIMALS);
            this.amountOnChain = new Amount(n, showDecimals);
        }
    }
}

export class TokenValueInUSD {
    token = {};
    tokenAmount = new TokenAmount(0);
    price = new Amount(1);
    valueInUSD = new Amount(0);

    constructor(amountNumber, token, price, toAmountOnChain, _showDecimals, chainId) {
        this.token = token;
        this.tokenAmount = new TokenAmount(amountNumber, token, toAmountOnChain, _showDecimals, chainId);

        this.price = new Amount(price, DEFAULT_VALUE_IN_USD_SHOW_DECIMALS);
        let valueInUSD = this.tokenAmount.amount.bigNumber.times(price || 0);
        this.valueInUSD = new Amount(valueInUSD, DEFAULT_VALUE_IN_USD_SHOW_DECIMALS);
    }
}
