import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {Input, Modal} from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import {numberInputValueFormat} from "../../../utils/NumberFormat";
import NumberPicker from "rc-input-number/es";
import {TokenAmount} from "../../../utils/TokenAmountConverter";
import {debounce} from "debounce";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import BigNumber from 'bignumber.js';
import {TokenTransferConfirmDialog} from "./TokenTransferConfirmDialog";
import {useIntl} from "../../i18n";

const TokenTransferDialog = ({ assetToken, availableAmount, isOpen, onClose, onTransferSuccessful }) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [amount, setAmount] = useState('');
    const [txAmount, setTxAmount] = useState(new TokenAmount(0, assetToken, true));
    const [maxAmount, setMaxAmount] = useState(new TokenAmount(0));
    const [amountChecked, setAmountChecked] = useState(false);
    const [amountOverflow, setAmountOverflow] = useState(false);


    const [percent, setPercent] = useState('');

    const doUpdateAmount = (_amount) => {
        if(_amount && parseFloat(_amount) > 0){
            setAmount(_amount);
            let inputAmount = new TokenAmount(_amount, assetToken, true);
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






    const [currentBalance, setCurrentBalance] = useState(new TokenAmount(0, assetToken));
    const [newBalance, setNewBalance] = useState(new TokenAmount(0, assetToken));
    useEffect(() => {
        setCurrentBalance(availableAmount);
        setNewBalance(availableAmount);
    }, [availableAmount]);

    useEffect(() => {
        if(currentBalance?.amount?.value){
            setMaxAmount(currentBalance);
        }
    }, [currentBalance]);


    useEffect(() => {
        if(currentBalance?.amount?.value && txAmount?.amount?.value){
            let newAmount = currentBalance.amountOnChain.bigNumber;
            newAmount = newAmount.minus(txAmount.amountOnChain.bigNumber);
            if(newAmount < 0){
                newAmount = 0;
            }

            setNewBalance(new TokenAmount(newAmount, assetToken));
        }
    }, [currentBalance, txAmount]);

    useEffect(() => {
        if(percent && currentBalance?.amount?.value){
            let baseAmount = currentBalance.amountOnChain.bigNumber;

            let percentValue = new BigNumber(percent).div(100);
            let _amount = baseAmount.times(percentValue).toFixed(0);

            let inputAmount = new TokenAmount(_amount, assetToken);
            setAmount(inputAmount.amount.value);
            setTxAmount(inputAmount);
            setAmountChecked(true);
            setAmountOverflow(false);
        }
    }, [currentBalance, percent]);






    const [receivedAddress, setReceivedAddress] = useState('');
    const [receivedAddressChecked, setReceivedAddressChecked] = useState(false);
    const [receivedAddressMsg, setReceivedAddressMsg] = useState('');
    const onAddressChange = debounce((event) => {
        let keywards = event.target.value;

        if (keywards === '' || keywards === undefined) {
            setReceivedAddressChecked(false);
            setReceivedAddressMsg('The receive address is required');
            return;
        }

        let _keywards = keywards.toLocaleLowerCase();
        if (_keywards.toLocaleLowerCase().startsWith('0x') && _keywards.length === 42) {
            setReceivedAddressChecked(true);
            setReceivedAddressMsg('');
        } else {
            setReceivedAddressChecked(false);
            setReceivedAddressMsg('Incorrect address');
        }
    }, ApplicationConfig.defaultDebounceWait);





    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState('Transfer');

    const updateSubmitTxt = () => {
        amountOverflow ? setSubmitTxt(`Insufficient Balance`) : setSubmitTxt(`Transfer`);
    };

    useEffect(() => {
        updateSubmitTxt();
        setSubmitEnable(receivedAddressChecked && amountChecked && !amountOverflow);
    }, [receivedAddressChecked, amountChecked, amountOverflow]);


    const resetInput = () => {
        setReceivedAddress('');
        setReceivedAddressChecked(true);
        setReceivedAddressMsg('');
        doUpdateAmount('');
        setAmount('');
        setPercent('');
    };


    const onTransferSuccessfulLocal = () => {
        resetInput();
        onClose && onClose();
        onTransferSuccessful && onTransferSuccessful();
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const onSubmit = () => {
        // onTransfer();
        setShowConfirm(true);
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal token_transfer'}
        >
            <TokenTransferConfirmDialog
                receivedAddress={receivedAddress} assetToken={assetToken} amount={amount}
                txAmount={txAmount} maxAmount={maxAmount} newBalance={newBalance}
                isOpen={showConfirm} onClose={()=>setShowConfirm(false)}
                onTransferSuccessful={onTransferSuccessfulLocal}
            />

            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'dialog_title b'}>{`Transfer ${assetToken?.name}`}</div>

                <div className={'f_c_l m_t_25'}>
                    <div className={'f_r_b'}>
                        <div>{`Address`}</div>
                    </div>

                    <div className={'w_100 text_input i_number m_t_10'}>
                        <Input
                            placeholder={'Enter receive address'}
                            className={'c_hl'}
                            value={receivedAddress}
                            onChange={(event) => {
                                onAddressChange(event);
                                setReceivedAddress(event.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className={'f_c_l m_t_25'}>
                    <div className={'f_r_b'}>
                        <div>{`Amount`}</div>
                        <div className={'f_r_l'}>
                            <span className={'c_text'}>{`Available:`}</span>
                            <span className={'m_l_5'}>{`${maxAmount.amount.formativeValue} ${assetToken?.name}`}</span>
                        </div>
                    </div>

                    <NumberPicker
                        formatter={numberInputValueFormat}
                        placeholder={intl.get(`commons.component.input.placeholder`)}
                        value={amount}
                        step={1}
                        precision={assetToken?.decimals}
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
                        <span className={'c_text'}>{`Token balance after transfer: `}</span>
                        <span className={'m_l_5'}>{`${newBalance.amount.formativeValue} ${assetToken?.name}`}</span>
                    </div>
                </div>



                {!receivedAddressChecked && receivedAddressMsg && (
                    <div className={'f_r_l r_8 tips_bar_warning m_t_25 c_p_12'}>
                        <div className={'i_icon_24 i_tips_info'}></div>
                        <div className={'m_l_3'}>{receivedAddressMsg}</div>
                    </div>
                )}



                <div className={'f_r_r gap-2 m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{`Cancel`}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{submitTxt}</button>
                </div>
            </div>
        </Modal>
    );
};

export default TokenTransferDialog;
