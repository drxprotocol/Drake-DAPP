import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {Input, Modal} from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import {numberInputValueFormat} from "../../../utils/NumberFormat";
import NumberPicker from "rc-input-number/es";
import {useConfiguredContractSend, useETHSend} from "../../ContractHooks";
import ContractConfig from "../../../contract/ContractConfig";
import CoinIcon from "../../Coin/CoinIcon";
import {generateAddressSummary} from "../../../utils/StringFormat";

export const TokenTransferConfirmDialog = ({ receivedAddress, assetToken, amount, txAmount, maxAmount, newBalance, isOpen, onClose, onTransferSuccessful }) => {
    const [submitTxt, setSubmitTxt] = useState('Confirm');

    const [receivedAddressSummary, setReceivedAddressSummary] = useState('');
    useEffect(() => {
        if(receivedAddress){
            let address = generateAddressSummary(receivedAddress, 8, 6);
            setReceivedAddressSummary(address);
        }
    }, [receivedAddress]);


    const tokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: assetToken?.address,
    };
    const { sendTx: sendTransfer } = useConfiguredContractSend(
        tokenContract,
        'transfer',
        'Transfer',
        undefined,
        () => {
            onClose && onClose();
            setTimeout(() => {
                onTransferSuccessful && onTransferSuccessful();
            }, 300);
        }
    );
    const { sendTx: sendETHTransfer } = useETHSend(
        'Transfer',
        undefined,
        () => {
            onClose && onClose();
            setTimeout(() => {
                onTransferSuccessful && onTransferSuccessful();
            }, 300);
        }
    );

    const onTransfer = () => {
        let address = receivedAddress;
        let _amount = txAmount.amountOnChain.value;
        let native = assetToken?.native;
        console.debug(
            `address =>`, address,
            `assetToken =>`, assetToken,
            `native =>`, native,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );

        let addressSummary = generateAddressSummary(receivedAddress);
        let txContent = `Transfer ${txAmount.amount.formativeValue} ${assetToken.name} to ${addressSummary}`;
        if(native){
            sendETHTransfer(txContent, {
                to: address,
                value: _amount
            });
        } else {
            sendTransfer(txContent, address, _amount);
        }
    };

    const onSubmit = () => {
        onTransfer();
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
            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'dialog_title b'}>{`Transfer confirmation`}</div>

                <div className={'f_r_l gap-5 w_100 m_t_25'}>
                    <div className="f_c_l f_12">
                        <div className="c_text">{`Asset type`}</div>
                        <div className="f_r_l m_t_5">
                            <CoinIcon logo={assetToken?.logoURI} className={`coin_icon_16`}/>
                            <div className={'m_l_5 b c_hl'}>{assetToken?.name}</div>
                        </div>
                    </div>

                    <div className="f_c_l f_12">
                        <div className="c_text">{`Address`}</div>
                        <div className="c_hl m_t_5 b">{receivedAddressSummary}</div>
                    </div>

                    <div className="f_c_l f_12">
                        <div className="c_text">{`Token Amount`}</div>
                        <div className="c_hl m_t_5 b">{`${amount} ${assetToken?.name}`}</div>
                    </div>
                </div>


                <div className={'f_r_r gap-2 m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{`Cancel`}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" onClick={() => {onSubmit()}}>{submitTxt}</button>
                </div>
            </div>
        </Modal>
    );
};