import './index.scss';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import ConditionDisplay from '../ConditionDisplay';
import CopyAddress from '../CopyAddress';
import ViewOnEtherscan from '../ViewOnEtherscan';
import { Modal } from 'antd';
import WebThreeContext from '../WebThreeProvider/WebThreeContext';
import { generateAddressSummary } from '../../utils/StringFormat';
import ContractConfig from '../../contract/ContractConfig';
import ApplicationConfig from "../../ApplicationConfig";
import {getWalletByName, checkSocialWallet, WalletMap} from "../Modals/WalletSelector/WalletConfig";
import {TransactionContextState} from "./TransactionState";

export function TransactionDialogBox({ open, onOpen, transactionContext }) {
    const web3Context = useContext(WebThreeContext);

    const [titleIcon, setTitleIcon] = useState('title_icon_confirm');
    const [title, setTitle] = useState('Confirm transaction on your wallet');
    const [content, setContent] = useState('Confirm transaction on your wallet');

    const [confirmed, setConfirmed] = useState(false);

    const [autoCloseId, setAutoCloseId] = useState(0);

    const walletIcon = useMemo(() => {
        if (web3Context?.account) {
            let walletName = web3Context?.connectorName || window.localStorage.getItem('CURRENT_WALLET_NAME') || 'injected';
            let wallet = getWalletByName(walletName);
            return wallet.icon;
        }

        return WalletMap.injected.icon;
    }, [web3Context]);

    const onClose = () => {
        onOpen(false);
    };

    useEffect(() => {
        if (transactionContext?.state === TransactionContextState.confirm || transactionContext?.state === TransactionContextState.phased_confirm) {
            setConfirmed(false);
            setTitleIcon('title_icon_confirm');

            let connectorName = web3Context?.connectorName;
            let isAAWallet = checkSocialWallet(connectorName);
            let _title = isAAWallet ? 'Sending transaction' : 'Confirm transaction on your wallet';
            setTitle(_title);

            setContent(transactionContext?.content || _title);

            clearTimeout(autoCloseId);
        }

        if (transactionContext?.state === TransactionContextState.pending || transactionContext?.state === TransactionContextState.phased_pending) {
            setConfirmed(true);
            setTitleIcon('title_icon_pending');
            setTitle('Transaction Submitted');
            setContent(transactionContext?.content || '');
        }

        if (transactionContext?.state === TransactionContextState.success || transactionContext?.state === TransactionContextState.phased_success) {
            setConfirmed(true);
            setTitleIcon('title_icon_success');
            setTitle('Transaction Successful');
            setContent(transactionContext?.content || '');

            let _autoCloseId = setTimeout(() => {
                onOpen(false);
            }, ApplicationConfig.defaultTimeoutToCloseTXWindow);
            setAutoCloseId(_autoCloseId);
        }

        if (transactionContext?.state === TransactionContextState.failed || transactionContext?.state === TransactionContextState.phased_failed) {
            setConfirmed(false);
            setTitleIcon('title_icon_failed');
            setTitle('Transaction Failure');
            setContent(transactionContext?.content || '');
        }

        if (transactionContext?.state === TransactionContextState.rejected || transactionContext?.state === TransactionContextState.phased_rejected) {
            setConfirmed(false);
            setTitleIcon('title_icon_failed');
            setTitle('Transaction Rejected');
            setContent(transactionContext?.content || '');
        }
    }, [transactionContext?.state, transactionContext?.timestamp]);

    return (
        <Modal
            title=""
            footer={null}
            open={open}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={() => onOpen(false)}
            className={'overlay_container common_modal transaction_dialog'}
            zIndex={9999}
        >
            <div className={'f_c_c_c w-full'}>
                <div className={`title_icon ${titleIcon}`} />
                <div className={'content_title'}>{title}</div>

                <ConditionDisplay display={(transactionContext?.state === TransactionContextState.confirm || transactionContext?.state === TransactionContextState.phased_confirm) && web3Context.account}>
                    <div className={'d_content'}>{content}</div>

                    <div className={'d_operation_box d_confirm_box r_12 squircle_border'}>
                        <div className={'f_r_l wallet'}>
                            <div className={`i_icon_24 ${walletIcon}`}></div>
                            <div className={'connection'}>
                                <div className={'wallet_add'}>{generateAddressSummary(web3Context.account, 6)}</div>
                            </div>
                        </div>
                        <div className={'r_8 status'}>
                            <div className={'dot'} />
                            <div className={'txt'}>Connected</div>
                        </div>
                    </div>
                </ConditionDisplay>

                <ConditionDisplay display={confirmed}>
                    <div className={'d_hash_box'}>
                        <div className={'hash'}>{generateAddressSummary(transactionContext?.hash, 12)}</div>
                        <div className={'operations'}>
                            <CopyAddress address={transactionContext?.hash} />
                            <ViewOnEtherscan
                                url={`${ContractConfig.etherscan(web3Context.chainId)}/tx/${transactionContext?.hash}`}
                                showTitle={true}
                            />
                        </div>
                    </div>

                    <ConditionDisplay display={!transactionContext?.error}>
                        <button
                            type="primary"
                            size="small"
                            className="f_r_c r_8 sub_btn_long_blue close_btn"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </ConditionDisplay>
                </ConditionDisplay>

                <ConditionDisplay
                    display={transactionContext?.state === 'failed' || transactionContext?.state === 'rejected'}
                >
                    <button type="primary" size="small" className="f_r_c r_8 sub_btn_long_blue close_btn" onClick={onClose}>
                        Close
                    </button>
                </ConditionDisplay>
            </div>
        </Modal>
    );
}
