import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import CoinIcon from "../../Coin/CoinIcon";
import {numberInputValueFormat} from "../../../utils/NumberFormat";
import NumberPicker from "rc-input-number/es";
import {TokenAmount} from "../../../utils/TokenAmountConverter";
import {debounce} from "debounce";
import {useConfiguredContractSend, useContractCall, useContractCalls} from "../../ContractHooks";
import ContractConfig from "../../../contract/ContractConfig";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import BigNumber from 'bignumber.js';
import {useMaxRedeemRequestCount, useRedeemRequestCounter} from "../../../hooks/useStakeMeta";
import {useIntl} from "../../i18n";

const RequestToRedeemDialog = ({ vaultToken, availableAmount, isOpen, onClose, onRequestSuccessful }) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [amount, setAmount] = useState('');
    const [txAmount, setTxAmount] = useState(new TokenAmount(0, vaultToken, true));
    const [maxAmount, setMaxAmount] = useState(new TokenAmount(0));
    const [amountChecked, setAmountChecked] = useState(false);
    const [amountOverflow, setAmountOverflow] = useState(false);


    const [percent, setPercent] = useState('');

    const doUpdateAmount = (_amount) => {
        if(_amount && parseFloat(_amount) > 0){
            setAmount(_amount);
            let inputAmount = new TokenAmount(_amount, vaultToken, true);
            setTxAmount(inputAmount);
            setAmountChecked(true);

            if(maxAmount && inputAmount.amount.bigNumber.comparedTo(maxAmount.amount.bigNumber) <= 0){
                setAmountOverflow(false);
            }else{
                setAmountOverflow(true);
            }
        }else{
            setAmountChecked(false);
            setAmountOverflow(false);
        }
    };

    const onAmountChange = debounce((value) => {
        doUpdateAmount(value);
        setPercent('');
    }, ApplicationConfig.defaultDebounceWait);




    const totalRedemptionRequests = useRedeemRequestCounter(vaultToken);
    const maxRedeemRequestCount = useMaxRedeemRequestCount(vaultToken);
    const [totalRequestOverflow, setTotalRequestOverflow] = useState(false);
    useEffect(() => {
        let overflow = totalRedemptionRequests > 0 && totalRedemptionRequests >= maxRedeemRequestCount;
        setTotalRequestOverflow(overflow);

        console.debug(
            `overflow =>`, overflow,
            `totalRedemptionRequests =>`, totalRedemptionRequests,
            `maxRedeemRequestCount =>`, maxRedeemRequestCount
        );
    }, [totalRedemptionRequests, maxRedeemRequestCount]);




    const [expectedAmount, setExpectedAmount] = useState(new TokenAmount(0, vaultToken));
    const getExpectedAmountCalls = useMemo(() => {
        let calls = [
            {
                contract: vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'previewRedeem',
                args: [txAmount?.amountOnChain?.value]
            },
        ];
        return calls;
    }, [txAmount]) ?? [];
    const getExpectedAmountCallResult = useContractCalls(getExpectedAmountCalls) ?? [];
    useEffect(() => {
        if(getExpectedAmountCallResult.length && getExpectedAmountCallResult[0].length){
            setExpectedAmount(new TokenAmount(getExpectedAmountCallResult[0][0], vaultToken));
        }
    }, [getExpectedAmountCallResult, vaultToken]);




    const [currentBalance, setCurrentBalance] = useState(new TokenAmount(0, vaultToken));
    useEffect(() => {
        setCurrentBalance(availableAmount);
    }, [availableAmount]);

    useEffect(() => {
        if(currentBalance?.amount?.value){
            setMaxAmount(currentBalance);
        }
    }, [currentBalance]);



    useEffect(() => {
        if(percent && currentBalance?.amount?.value){
            let baseAmount = currentBalance.amountOnChain.bigNumber;

            let percentValue = new BigNumber(percent).div(100);
            let _amount = baseAmount.times(percentValue).toFixed(0);

            let inputAmount = new TokenAmount(_amount, vaultToken);
            setAmount(inputAmount.amount.value);
            setTxAmount(inputAmount);
            setAmountChecked(true);
            setAmountOverflow(false);
        }
    }, [currentBalance, percent]);


    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState('commons.component.btn.confirm');

    const updateSubmitTxt = () => {
        amountOverflow ? setSubmitTxt(`commons.component.input.insufficient_balance`) : setSubmitTxt(`commons.component.btn.confirm`);
    };

    useEffect(() => {
        updateSubmitTxt();
        setSubmitEnable(amountChecked && !amountOverflow && !totalRequestOverflow);
    }, [amountChecked, amountOverflow, totalRequestOverflow]);


    const { send: sendRequestToRedeem } = useConfiguredContractSend(
        vaultToken.vault,
        'requestToRedeem',
        'Request To Redeem',
        undefined,
        () => {
            onClose && onClose();
            onRequestSuccessful && onRequestSuccessful();
        }
    );

    const onWithdraw = () => {
        let _amount = txAmount.amountOnChain.value;
        console.debug(
            `vaultToken =>`, vaultToken,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );
        sendRequestToRedeem(_amount);
    };

    const onSubmit = () => {
        onWithdraw();
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal request_to_redeem deposit_withdraw'}
        >
            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'dialog_title b'}>{intl.get(`page.earn.vault.staking.request_redeem`)}</div>

                <div className={'f_c_l m_t_25'}>
                    <div className={'f_r_b'}>
                        <div>{`Amount`}</div>
                        <div className={'f_r_l'}>
                            <span className={'c_text'}>{`${intl.get(`page.earn.vault.staking.request_redeem.available`)}:`}</span>
                            <span className={'m_l_5'}>{`${maxAmount.amount.formativeValue} ${vaultToken?.dTokenName}`}</span>
                        </div>
                    </div>

                    <NumberPicker
                        formatter={numberInputValueFormat}
                        placeholder={intl.get(`commons.component.input.placeholder`)}
                        value={amount}
                        step={1}
                        precision={18}
                        min={0}
                        max={ApplicationConfig.maxNumberPickerValue}
                        stringMode={true}
                        className={'c_hl text_input i_number m_t_10'}
                        onChange={onAmountChange}
                    />

                    <div className={'f_r_l gap-3 m_t_10 percent_amount_box'}>
                        <div className={`p_item r_8 squircle_border cp ${percent === '10' ? 'active' : 'c_text'}`} onClick={() => {setPercent('10')}}>{`10%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '20' ? 'active' : 'c_text'}`} onClick={() => {setPercent('20')}}>{`20%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '50' ? 'active' : 'c_text'}`} onClick={() => {setPercent('50')}}>{`50%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '100' ? 'active' : 'c_text'}`} onClick={() => {setPercent('100')}}>{`100%`}</div>
                    </div>
                </div>

                <div className={'f_c_l m_t_25'}>
                    <div className={'f_r_l m_t_5'}>
                        <span className={'c_text'}>{`${intl.get(`page.earn.vault.staking.request_redeem.expected`)}: `}</span>
                        <span className={'m_l_5'}>{`${expectedAmount?.amount?.formativeValue} ${vaultToken?.name}`}</span>
                    </div>
                </div>

                <div className={'f_r_l r_8 bg_note m_t_25 c_p_12'}>
                    <a href={'#'} className={'c_link'}>{intl.get(`commons.component.link.learn_more`)}</a>
                    <span className={'m_l_3'}>{intl.get(`page.earn.vault.staking.request_redeem.more`)}</span>
                </div>

                {totalRequestOverflow && (
                    <div className={'f_r_l r_8 tips_bar_warning m_t_25 c_p_12'}>
                        <div className={'i_icon_24 i_tips_info'}></div>
                        <div className={'m_l_3'}>{intl.get(`page.earn.vault.staking.request_redeem.max_request`)}</div>
                    </div>
                )}

                <div className={'f_r_r gap-2 m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{intl.get(`commons.component.btn.cancel`)}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{intl.get(submitTxt)}</button>
                </div>
            </div>
        </Modal>
    );
};

export default RequestToRedeemDialog;
