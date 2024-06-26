import React, { useContext, useEffect, useState } from 'react';
import {ERCToken} from "../ERCToken";
import {
    EARN_STAKE_TYPE, INSTRUMENT_PRICE_ICON_MAP,
} from "../TradingConstant";
import {
    Amount,
    DECIMAL_PLACES_STRATEGY_SAMLL,
    RATIO_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../../utils/TokenAmountConverter";
import moment from 'moment';
import {daysLeftFormat, defaultTimeFormat, myMoment} from "../../utils/DateUtil";
import ContractConfig from "../../contract/ContractConfig";

export class VaultToken extends ERCToken {
    vault = ContractConfig.Earn.Vault;
    nftManager = ContractConfig.Earn.NFTManager;
    priceIcon = INSTRUMENT_PRICE_ICON_MAP.USDT;
    dTokenName = 'dUSDT';
    dToken = null;

    constructor({ chainId, address, name, symbol, logoURI, decimals, currentMarketPrice, localName, native = false, testToken = false }) {
        super({chainId, address, name, symbol, logoURI, decimals, currentMarketPrice, localName, native, testToken});

        if(name){
            this.dTokenName = `d${name}`;
        }

        if(chainId && name){
            let vaultAddress = ContractConfig.Earn.Vault.address(chainId, name);
            this.vault = {
                ...ContractConfig.Earn.Vault,
                theAddress: vaultAddress,
            };

            let nftAddress = ContractConfig.Earn.NFTManager.address(chainId, name);
            this.nftManager = {
                ...ContractConfig.Earn.NFTManager,
                theAddress: nftAddress,
            };

            this.priceIcon = INSTRUMENT_PRICE_ICON_MAP[name];


            this.dToken = new ERCToken({chainId, address: vaultAddress, name, symbol, logoURI, decimals, currentMarketPrice, localName, native, testToken})
        }
    }
}

export class FundingRateVaultToken extends ERCToken {
    vault = ContractConfig.Earn.FundingRateVault;
    priceIcon = INSTRUMENT_PRICE_ICON_MAP.USDC;
    dTokenName = 'frUSDC';
    dToken = null;

    constructor({ chainId, address, name, symbol, logoURI, decimals, currentMarketPrice, localName, native = false, testToken = false }) {
        super({chainId, address, name, symbol, logoURI, decimals, currentMarketPrice, localName, native, testToken});

        if(name){
            this.dTokenName = `fr${name}`;
        }

        if(chainId && name){
            let vaultAddress = ContractConfig.Earn.FundingRateVault.address(chainId, name);
            this.vault = {
                ...ContractConfig.Earn.FundingRateVault,
                theAddress: vaultAddress,
            };

            this.priceIcon = INSTRUMENT_PRICE_ICON_MAP[name];


            this.dToken = new ERCToken({chainId, address: vaultAddress, name, symbol, logoURI, decimals, currentMarketPrice, localName, native, testToken})
        }
    }
}

export class StakingRecord {
    lockType = 0;
    lockTypeTxt = EARN_STAKE_TYPE.Unlock.typeTxt;
    stakingId = 0;
    stakingAmount = new TokenValueInUSD(0);
    depositedAmountInUSD = new TokenAmount(0);
    releaseTime = moment();
    releaseTimeUnix = 0;
    releaseTimeFormat = '';
    leftDays = '';
    lockDuration = 0;
    lockDurationSeconds = 0;
    availableRewards = new TokenAmount(0);
    claimAble = false;
    unlockAble = false;

    constructor({
                    lockType = 0,
                    stakingId = 0,
                    stakingAmount = new TokenValueInUSD(0),
                    depositedAmountInUSD = new TokenAmount(0),
                    releaseTimeUnix = 0,
                    lockDuration = 0,
                    lockDurationSeconds = 0,
                    availableRewards = new TokenAmount(0),
                }) {
        this.lockType = lockType;
        this.lockTypeTxt = lockType === 0 ? EARN_STAKE_TYPE.Unlock.typeTxt : EARN_STAKE_TYPE.Lock.typeTxt;
        this.stakingId = lockType === 0 ? '--' : stakingId;
        this.stakingAmount = stakingAmount;
        this.depositedAmountInUSD = depositedAmountInUSD;

        this.releaseTimeUnix = releaseTimeUnix;
        this.releaseTime = moment(releaseTimeUnix * 1000);
        this.releaseTimeFormat = lockType === 0 ? 'Now' : defaultTimeFormat(this.releaseTime);

        if(releaseTimeUnix){
            let now = myMoment();
            let daysDiff = this.releaseTime.diff(now, 'seconds');
            this.unlockAble = daysDiff < 0;

            let {daysLeftShort} = daysLeftFormat(releaseTimeUnix);
            this.leftDays = daysLeftShort;
        }


        this.lockDurationSeconds = lockDurationSeconds || 0;
        let secondsOneDay = 60 * 60 *24;
        this.lockDuration = lockType === 0 ? 0 : (lockDuration ? lockDuration : lockDurationSeconds / secondsOneDay);

        this.availableRewards = availableRewards;

        this.claimAble = availableRewards && availableRewards.amountOnChain.value > 0 ? true : false;
    }
}

export class RedeemRequestRecord {
    stakingId = 0;
    stakingAmount = new TokenValueInUSD(0);
    expectedAssetAmount = new TokenValueInUSD(0);
    releaseTime = moment();
    releaseTimeUnix = 0;
    releaseTimeFormat = '';
    redeemAble = false;

    constructor({
                    stakingId = 0,
                    stakingAmount = new TokenValueInUSD(0),
                    expectedAssetAmount = new TokenValueInUSD(0),
                    releaseTimeUnix = 0,
                }) {
        this.stakingId = stakingId;
        this.stakingAmount = stakingAmount;
        this.expectedAssetAmount = expectedAssetAmount;

        this.releaseTimeUnix = releaseTimeUnix;
        this.releaseTime = moment(releaseTimeUnix * 1000);
        this.releaseTimeFormat = defaultTimeFormat(this.releaseTime);

        if(releaseTimeUnix){
            let now = myMoment();
            let daysDiff = this.releaseTime.diff(now, 'seconds');
            this.redeemAble = daysDiff < 0;
        }
    }
}