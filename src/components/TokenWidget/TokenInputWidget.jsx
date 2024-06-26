import React, { useState, useEffect, useMemo } from 'react';
import './index.scss';

import { debounce } from 'debounce';
import NumberPicker from 'rc-input-number';
import { numberInputValueFormat } from '../../utils/NumberFormat';
import { Amount, TokenAmount, TokenValueInUSD } from '../../utils/TokenAmountConverter';
import { useDappTokenBalanceAndUSDValue, useNativeTokenBalanceAndUSDValue } from '../DappTokenBalance';
import ApplicationConfig from '../../ApplicationConfig';
import { Modal } from 'antd';
import { ERCToken } from '../ERCToken';
import { checkWrappedToken } from '../../contract/TokenContract';
import {useIntl} from "../i18n";

/**
 *
 * @param token = {
        "chainId": 42161,
        "address": "0xD74f5255D557944cf7Dd0E45FF521520002D5748",
        "name": "USDs",
        "symbol": "USDs",
        "logoURI": "/src/components/Coin/img/token_usds.svg",
        "decimals": 18
    }
 * @returns {*}
 * @constructor
 */
const TokenInputWidget = ({ token, amountValue, onValueChange, onInsufficient }) => {
    const intl = useIntl();

    const { tokenAmount: tokenBalance, price, valueInUSD: tokenValueInUSD } = useDappTokenBalanceAndUSDValue(token);
    const { tokenAmount: nativeTokenBalance, valueInUSD: nativeTokenValueInUSD } = useNativeTokenBalanceAndUSDValue(
        token?.native && token,
    );

    const [balance, setBalance] = useState(new TokenAmount(0));
    const [valueInUSD, setValueInUSD] = useState(new Amount(0));
    const [inputAmount, setInputAmount] = useState(new TokenValueInUSD(0));

    const [openWrappedTokenSwitchModal, setOpenWrappedTokenSwitchModal] = useState(false);
    const enableWrappedTokenSwitch = useMemo(() => {
        let enable = token && token.symbol && checkWrappedToken(token.symbol);
        return enable;
    }, [token]);
    const [wrappedTokenSwitched, setWrappedTokenSwitched] = useState(false);

    const doSetInputAmount = (amount) => {
        console.debug(`new amount => `, amount);
        setInputAmount(amount);

        if (amount.tokenAmount.amountOnChain.bigNumber.comparedTo(balance.amountOnChain.bigNumber) > 0) {
            console.debug(
                `insufficient token amount: inputAmount => ${amount.tokenAmount.amount.formativeNumber}, balanceAmount => ${balance.amount.formativeNumber}`,
            );
            onInsufficient && onInsufficient(true);
        } else {
            onInsufficient && onInsufficient(false);
        }
    };

    const doAmountChange = (amount) => {
        doSetInputAmount(amount);
        onValueChange && onValueChange(amount, true);
    };

    const onAmountChange = debounce((value) => {
        let _amount = new TokenValueInUSD(value || '0', token, price?.value, true);
        doAmountChange(_amount);
    }, ApplicationConfig.defaultDebounceWait);

    const onMax = () => {
        let _amount = new TokenValueInUSD(balance.amountOnChain.value, token, price?.value);
        doAmountChange(_amount);
    };

    useEffect(() => {
        if (amountValue && price?.value) {
            let _amount = new TokenValueInUSD(amountValue, token, price?.value, true);
            doSetInputAmount(_amount);
            onValueChange && onValueChange(_amount, false);
        }
    }, [amountValue]);

    useEffect(() => {
        if (enableWrappedTokenSwitch && !wrappedTokenSwitched) {
            token.toNative(true);
            setWrappedTokenSwitched(true);
        }
    }, [enableWrappedTokenSwitch]);

    useEffect(() => {
        if (token?.native && nativeTokenBalance && nativeTokenValueInUSD) {
            setBalance(nativeTokenBalance);
            setValueInUSD(nativeTokenValueInUSD);
        }

        if (!token?.native && tokenBalance && tokenValueInUSD) {
            setBalance(tokenBalance);
            setValueInUSD(tokenValueInUSD);
        }
    }, [token, tokenBalance, tokenValueInUSD, nativeTokenBalance, nativeTokenValueInUSD]);

    return (
        <div className="br_20 p_20 option_box token_widget_wrapper">
            <div className="f_r_r">
                <div className="f_r_l_t f_14">
                    <div className="cg b">
                        Balance: {balance.amount.formativeValue} (~$
                        {valueInUSD.formativeValue})
                    </div>
                    <button className="cb m_l_4 b" onClick={onMax}>
                        Max
                    </button>
                </div>
            </div>
            <div className="f_r_b gap-1">
                <div className="f_r_l">
                    <div className="i_icon_40 m_r_8" style={{ backgroundImage: `url(${token?.logoURI})` }} />
                    <div className="h4">{token?.localName}</div>

                    {enableWrappedTokenSwitch && (
                        <>
                            <div
                                className="i_icon_24 i_icon_button i_arrow_down m_l_10"
                                onClick={() => {
                                    setOpenWrappedTokenSwitchModal(true);
                                }}
                            ></div>
                            <WrappedTokenSwitchModal
                                open={openWrappedTokenSwitchModal}
                                onClose={() => setOpenWrappedTokenSwitchModal(false)}
                                token={token}
                                onSwitch={() => onAmountChange('')}
                            />
                        </>
                    )}
                </div>
                <div className="w-full">
                    <NumberPicker
                        formatter={numberInputValueFormat}
                        placeholder={intl.get(`commons.component.input.placeholder`)}
                        value={
                            inputAmount.tokenAmount.amount.value && inputAmount.tokenAmount.amount.value !== '0.0'
                                ? inputAmount.tokenAmount.amount.value
                                : ''
                        }
                        step={1}
                        precision={token.decimals || 18}
                        min={0}
                        max={ApplicationConfig.maxNumberPickerValue}
                        stringMode={true}
                        className={
                            'number text-primary-black font-sbold font-semibold text-base md:text-lg lg:text-2xl float-right w-36 md:w-full'
                        }
                        style={{ textAlign: 'end' }}
                        onChange={onAmountChange}
                    />
                </div>
            </div>
            <div className="f_r_r">
                <div className="f_14 cg">~${inputAmount.valueInUSD.formativeValue}</div>
            </div>
        </div>
    );
};

export const WrappedTokenSwitchModal = ({ token, open, onClose, onSwitch }) => {
    const wrappedToken = useMemo(() => {
        if (token && token.address) {
            let _token = new ERCToken(token);
            _token.toNative(false, true);
            return _token;
        }
        return {};
    }, [token]);
    const { tokenAmount: wrappedTokenBalance, valueInUSD: wrappedTokenValueInUSD } =
        useDappTokenBalanceAndUSDValue(wrappedToken);

    const nativeToken = useMemo(() => {
        if (token && token.address) {
            let _token = new ERCToken(token);
            _token.toNative(true, true);
            return _token;
        }
        return {};
    }, [token]);
    const { tokenAmount: nativeTokenBalance, valueInUSD: nativeTokenValueInUSD } =
        useNativeTokenBalanceAndUSDValue(nativeToken);

    const onTokenClick = (native) => {
        token.toNative(native);
        console.debug(`token => `, token);
        onSwitch && onSwitch();
        onClose();
    };

    return (
        <Modal
            title=""
            footer={null}
            open={open}
            width={ApplicationConfig.popupWindowWidthForLiquidity}
            onCancel={onClose}
            className={'overlay_container common_modal wrapped_token_modal'}
        >
            <div className="m_t_30 wrapped_token_switch_box">
                <div className="f_r_b_t m_b_24">
                    <div className="h3">{`Select token from below`}</div>
                </div>

                <div className="f_c_l">
                    <div
                        className={`f_r_b brs_20 m_b_15 token_item ${token?.native && 'active'}`}
                        onClick={() => {
                            onTokenClick(true);
                        }}
                    >
                        <div className="f_r_l">
                            <div
                                className="i_icon_40 m_r_8"
                                style={{ backgroundImage: `url(${nativeToken?.logoURI})` }}
                            />
                            <div className="h4">{nativeToken?.localName}</div>
                        </div>

                        <div className="cg b">
                            Balance: {nativeTokenBalance?.amount?.formativeValue} (~$
                            {nativeTokenValueInUSD?.formativeValue})
                        </div>
                    </div>
                    <div
                        className={`f_r_b brs_20 m_b_15 token_item ${!token?.native && 'active'}`}
                        onClick={() => {
                            onTokenClick(false);
                        }}
                    >
                        <div className="f_r_l">
                            <div
                                className="i_icon_40 m_r_8"
                                style={{ backgroundImage: `url(${wrappedToken?.logoURI})` }}
                            />
                            <div className="h4">{wrappedToken?.localName}</div>
                        </div>

                        <div className="cg b">
                            Balance: {wrappedTokenBalance?.amount?.formativeValue} (~$
                            {wrappedTokenValueInUSD?.formativeValue})
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export function TokenConfirmWidget({ tokenValueInUSD }) {
    return (
        <div className="br_20 p_20 option_box token_widget_wrapper">
            <div className="f_r_b">
                <div className="f_r_l">
                    <div
                        className="i_icon_40 m_r_8"
                        style={{
                            backgroundImage: `url(${tokenValueInUSD?.token?.logoURI})`,
                        }}
                    />
                    <div className="h4">{tokenValueInUSD?.token?.localName}</div>
                </div>
                <div className={'text-primary-black font-sbold font-semibold text-base md:text-lg lg:text-2xl'}>
                    {tokenValueInUSD?.tokenAmount?.amount?.value}
                </div>
            </div>
            <div className="f_r_r">
                <div className="f_14 cg">~${tokenValueInUSD.valueInUSD.formativeValue}</div>
            </div>
        </div>
    );
}

export default TokenInputWidget;
