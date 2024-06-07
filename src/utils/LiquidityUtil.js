import BigNumber from 'bignumber.js';
import { parseUnits } from '@ethersproject/units';
import { Amount, DEFAULT_PRICE_SHOW_DECIMALS, DEFAULT_PRICE_CALCULATE } from './TokenAmountConverter';

export function getPriceRange(tickLower, tickUpper, decimalA, decimalB, reversal) {
    let diffDecimals = decimalA >= decimalB ? decimalA - decimalB : decimalB - decimalA;
    let scale = new BigNumber(10).pow(diffDecimals);
    if (tickLower > -887220 && tickUpper < 887220) {
        let price1 = Math.pow(1.0001, tickLower) * scale.toNumber();
        let price1Bn = new Amount(price1, DEFAULT_PRICE_CALCULATE);
        let price2 = Math.pow(1.0001, tickUpper) * scale.toNumber();
        let price2Bn = new Amount(price2, DEFAULT_PRICE_CALCULATE);
        if (reversal) {
            price1Bn = new Amount(1 / price2, DEFAULT_PRICE_CALCULATE);
            price2Bn = new Amount(1 / price1, DEFAULT_PRICE_CALCULATE);
        }
        return [price1Bn.formativeValue, price2Bn.formativeValue, price1Bn, price2Bn];
    } else if (tickLower <= -887220 && tickUpper < 887220) {
        let price2 = Math.pow(1.0001, tickUpper) * scale.toNumber();
        let price1 = Math.pow(1.0001, tickLower) * scale.toNumber();
        let price2Bn = new Amount(price2, DEFAULT_PRICE_CALCULATE);
        if (reversal) {
            price2Bn = new Amount(1 / price2, DEFAULT_PRICE_CALCULATE);
            let price1Bn = new Amount(price1, DEFAULT_PRICE_CALCULATE);
            return [price2Bn.formativeValue, '∞', price2Bn, price1Bn];
        }
        return [0, price2Bn.formativeValue, new Amount(0, DEFAULT_PRICE_CALCULATE), price2Bn];
    } else if (tickLower > -887220 && tickUpper >= 887220) {
        let price1 = Math.pow(1.0001, tickLower) * scale.toNumber();
        let price2 = Math.pow(1.0001, tickUpper) * scale.toNumber();
        let price2Bn = new Amount(price2, DEFAULT_PRICE_CALCULATE);
        let price1Bn = new Amount(price1, DEFAULT_PRICE_CALCULATE);
        if (reversal) {
            price2Bn = new Amount(1 / price2, DEFAULT_PRICE_CALCULATE);
            let price1Bn = new Amount(price1, DEFAULT_PRICE_CALCULATE);
            return [price2Bn.formativeValue, '∞', price2Bn, price1Bn];
        }
        return [price1Bn.formativeValue, '∞', price1Bn, price2Bn];
    }
    if (tickLower <= -887220 && tickUpper >= 887220) {
        let price2 = Math.pow(1.0001, tickUpper) * scale.toNumber();
        let price2Bn = new Amount(price2, DEFAULT_PRICE_CALCULATE);
        return [0, '∞', new Amount(0, DEFAULT_PRICE_CALCULATE), price2Bn];
    }
}

export function getSeparateAmountOfLiquidity(liquidity, perAtoB, tickLower, tickUpper, decimalA, decimalB) {
    let diffDecimals = decimalA >= decimalB ? decimalA - decimalB : decimalB - decimalA;
    let scale = new BigNumber(10).pow(diffDecimals);
    let [noUse1, noUse2, priceLow, priceHigh] = getPriceRange(tickLower, tickUpper, decimalA, decimalB);
    let liq = new BigNumber(liquidity);
    let perAtoBBn = new BigNumber(perAtoB || 0);
    let result0 = new BigNumber(0);
    let result1 = new BigNumber(1);

    if (perAtoBBn.comparedTo(priceLow.bigNumber) > 0 && perAtoBBn.comparedTo(priceHigh.bigNumber) < 0) {
        let result0Step1 = priceHigh.bigNumber.sqrt().minus(perAtoBBn.sqrt());
        let result0Step2 = perAtoBBn.sqrt().times(priceHigh.bigNumber.sqrt());
        let result1Step = perAtoBBn.sqrt().minus(priceLow.bigNumber.sqrt());
        result0 = liq.times(result0Step1.div(result0Step2));
        result1 = liq.times(result1Step);
    } else if (perAtoBBn.comparedTo(priceLow.bigNumber) < 0) {
        let result0Step1 = priceHigh.bigNumber.sqrt().minus(priceLow.bigNumber.sqrt());
        let result0Step2 = priceLow.bigNumber.sqrt().times(priceHigh.bigNumber.sqrt());
        result0 = liq.times(result0Step1.div(result0Step2));
        result1 = new BigNumber(0);
    } else if (perAtoBBn.comparedTo(priceHigh.bigNumber) > 0) {
        let result1Step = priceHigh.bigNumber.sqrt().minus(priceLow.bigNumber.sqrt());
        result0 = new BigNumber(0);
        result1 = liq.times(result1Step);
    }

    let p = 1;
    if (scale > 1) {
        p = Math.pow(10, decimalA >= decimalB ? decimalB : decimalA);
    }

    let amount0 = result0.times(p).decimalPlaces(0);
    let amount1 = result1.div(p).decimalPlaces(0);

    // console.debug(`getSeparateAmountOfLiquidity: liquidity => ${liquidity}, perAtoB => ${perAtoBBn.toFixed()}, priceLow => ${priceLow.bigNumber.toFixed()}, priceHigh => ${priceHigh.bigNumber.toFixed()}, tickLower => ${tickLower}, tickUpper => ${tickUpper}, decimalA => ${decimalA}, decimalB => ${decimalB}, amount0 => ${amount0.toFixed(0)}, amount1 => ${amount1.toFixed(0)}`);

    return [amount0, amount1];
}

export function calculateAmountBViaAmountA(amountA, perAtoB, tickLower, tickUpper, decimalA, decimalB) {
    let y = new BigNumber(0);
    let amountABn = new BigNumber(amountA || 0);
    let perAtoBBn = new BigNumber(perAtoB);

    if (amountABn.toNumber() <= 0 || perAtoBBn.toNumber() <= 0) {
        return y;
    }

    let _decimalA = parseUnits('1', decimalA);
    let _decimalB = parseUnits('1', decimalB);

    let diffDecimals = _decimalA >= _decimalB ? _decimalA / _decimalB : _decimalB / _decimalA;
    let scale = new BigNumber(diffDecimals);

    if (tickLower !== undefined && tickUpper !== undefined && tickLower >= -887270 && tickUpper <= 887270) {
        let priceLow = new BigNumber(Math.pow(1.0001, tickLower));
        let priceHigh = new BigNumber(Math.pow(1.0001, tickUpper));
        if (scale > 1) {
            priceLow = Math.pow(1.0001, tickLower) * scale.toNumber();
            priceHigh = Math.pow(1.0001, tickUpper) * scale.toNumber();
        }

        let price1 = priceLow < priceHigh ? new BigNumber(priceLow) : new BigNumber(priceHigh);
        let price2 = priceLow > priceHigh ? new BigNumber(priceLow) : new BigNumber(priceHigh);

        if (diffDecimals === 1) {
            price1 = priceLow.comparedTo(priceHigh) < 0 ? new BigNumber(priceLow) : new BigNumber(priceHigh);
            price2 = priceLow.comparedTo(priceHigh) > 0 ? new BigNumber(priceLow) : new BigNumber(priceHigh);
        }

        if (perAtoBBn.comparedTo(price1) > 0 && perAtoBBn.comparedTo(price2) < 0) {
            let step1 = perAtoBBn.sqrt().times(price2.sqrt());
            let step2 = price2.sqrt().minus(perAtoBBn.sqrt());
            let leftResult = amountABn.times(step1.div(step2));
            y = leftResult.times(perAtoBBn.sqrt().minus(price1.sqrt()));
        }

        console.debug(
            `calculateAmountBViaAmountA: amountA => ${amountABn.toFixed()}, perAtoB => ${perAtoBBn.toFixed()}, tickLower => ${tickLower}, tickUpper => ${tickUpper}, decimalA => ${decimalA}, decimalB => ${decimalB}, amountB => ${y.toFixed()}`,
        );

        return y;
    } else {
        return amountABn.times(perAtoBBn);
    }
}

export function calculateAmountAViaAmountB(amountB, perAtoB, tickLower, tickUpper, decimalA, decimalB) {
    let x = new BigNumber(0);
    let amountBBn = new BigNumber(amountB || 0);
    let perAtoBBn = new BigNumber(perAtoB || 0);

    if (amountBBn.toNumber() <= 0 || perAtoBBn.toNumber() <= 0) {
        return x;
    }

    let _decimalA = parseUnits('1', decimalA);
    let _decimalB = parseUnits('1', decimalB);

    let diffDecimals = _decimalA >= _decimalB ? _decimalA / _decimalB : _decimalB / _decimalA;
    let scale = new BigNumber(diffDecimals);

    if (tickLower !== undefined && tickUpper !== undefined && tickLower >= -887270 && tickUpper <= 887270) {
        let priceLow = new BigNumber(Math.pow(1.0001, tickLower));
        let priceHigh = new BigNumber(Math.pow(1.0001, tickUpper));
        if (scale > 1) {
            priceLow = Math.pow(1.0001, tickLower) * scale.toNumber();
            priceHigh = Math.pow(1.0001, tickUpper) * scale.toNumber();
        }

        let price1 = priceLow < priceHigh ? new BigNumber(priceLow) : new BigNumber(priceHigh);
        let price2 = priceLow > priceHigh ? new BigNumber(priceLow) : new BigNumber(priceHigh);

        if (diffDecimals === 1) {
            price1 = priceLow.comparedTo(priceHigh) < 0 ? new BigNumber(priceLow) : new BigNumber(priceHigh);
            price2 = priceLow.comparedTo(priceHigh) > 0 ? new BigNumber(priceLow) : new BigNumber(priceHigh);
        }

        if (perAtoBBn.comparedTo(price1) > 0 && perAtoBBn.comparedTo(price2) < 0) {
            let step1 = amountBBn.div(perAtoBBn.sqrt().minus(price1.sqrt()));
            let step2 = perAtoBBn.sqrt().times(price2.sqrt());
            let step3 = price2.sqrt().minus(perAtoBBn.sqrt());
            x = step1.div(step2.div(step3));
        }

        console.debug(
            `getAmountAByAmountB: amountB => ${amountBBn.toFixed()}, perAtoB => ${perAtoBBn.toFixed()}, tickLower => ${tickLower}, tickUpper => ${tickUpper}, decimalA => ${decimalA}, decimalB => ${decimalB}, amountA => ${x.toFixed()}`,
        );

        return x;
    } else {
        return amountBBn.times(new BigNumber(1).div(perAtoBBn));
    }
}
