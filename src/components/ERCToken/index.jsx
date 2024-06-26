import React from 'react';
import DefaultLogo from '../Coin/img/token_default.svg';
import { DefaultChain } from '../../contract/ChainConfig';
import { WrappedTokens } from '../../contract/TokenContract';
import BigNumber from "bignumber.js";

export class ERCToken {
    chainId = 0;
    address = '';
    currentMarketPrice = '';
    name = '';
    symbol = '';
    logoURI = DefaultLogo;
    decimals = 18;
    minAmountDecimals = 0;
    priceDecimals = 3;
    native = false;
    testToken = false;
    localName = '';
    claimAmountForTesting = 0;

    constructor({ chainId, address, name, symbol, logoURI, decimals, minAmountDecimals, priceDecimals, currentMarketPrice, localName, native = false, testToken = false }) {
        this.chainId = chainId || DefaultChain.chainId;
        this.address = address;
        this.name = name;
        this.symbol = symbol ?? name;
        this.logoURI = logoURI;
        this.decimals = decimals;
        this.currentMarketPrice = currentMarketPrice;
        this.native = native;
        this.testToken = testToken;
        this.localName = localName ?? name;
        this.claimAmountForTesting = 0;
        this.priceDecimals = priceDecimals;

        if(minAmountDecimals === undefined){
            let _exponent = decimals;
            let exponent = new BigNumber(10).pow(_exponent);
            let _minAmountDecimals = new BigNumber(1).div(exponent).toFixed();
            this.minAmountDecimals = _minAmountDecimals;
        } else {
            this.minAmountDecimals = minAmountDecimals;
        }
    }

    updateCurrentPrice(currentMarketPrice) {
        this.currentMarketPrice = currentMarketPrice;
    }

    updateClaimAmount(amount){
        this.claimAmountForTesting = amount;
    }

    toNative(native, updateLogo) {
        this.native = native;

        let handler = this;
        let filter = WrappedTokens.filter((wrappedToken) => {
            return wrappedToken.wrappedName === handler.symbol;
        });
        if (filter.length) {
            let wrappedToken = filter[0];
            this.localName = native ? wrappedToken.nativeName : wrappedToken.wrappedName;
            if (updateLogo) {
                this.logoURI = native ? wrappedToken.nativeLogo : wrappedToken.wrappedLogo;
            }
        }
    }
}
