import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {Input, Modal} from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import {useConfiguredContractSend, useContractCall, useContractCalls} from "../../ContractHooks";
import ContractConfig from "../../../contract/ContractConfig";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import {debounce} from "debounce";
import {useIntl} from "../../i18n";
import { RecoveryProvider } from '@zerodev/sdk'
import { useEcdsaProvider } from "@zerodev/wagmi";
import TransactionContext from "../../Transaction/TransactionContext";
import {TransactionState} from "../../Transaction/TransactionState";

const GuardianSettingDialog = ({recoveryEnabled, guardians, isOpen, onClose }) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);
    const web3Provider = useEcdsaProvider();

    const transactionContext = useContext(TransactionContext);



    const [guardianSettingType, setGuardianSettingType] = useState('');
    const [guardianAddressOri, setGuardianAddressOri] = useState('');
    const [guardianAddress, setGuardianAddress] = useState('');
    const [guardianAddressChecked, setGuardianAddressChecked] = useState(false);
    const [guardianAddressWarning, setGuardianAddressWarning] = useState(false);
    const [guardianAddressMsg, setGuardianAddressMsg] = useState('');
    const onAddressChange = debounce((event) => {
        let address = event.target.value;

        setGuardianAddressWarning(false);

        if (address === '' || address === undefined) {
            // setGuardianAddressChecked(address !== guardianAddressOri);
            setGuardianAddressChecked(false);
            setGuardianAddressMsg('');
            setGuardianSettingType('remove');

            if(address !== guardianAddressOri){
                // setGuardianAddressMsg('You will remove this guardian address!');
                // setGuardianAddressWarning(true);
            }

            return;
        }

        let _address = address.toLocaleLowerCase();
        if (_address.toLocaleLowerCase().startsWith('0x') && _address.length === 42) {
            setGuardianAddressChecked(_address !== guardianAddressOri.toLocaleLowerCase());
            setGuardianAddressMsg('');
            setGuardianSettingType(guardianAddressOri ? 'modify' : 'add');
        } else {
            setGuardianAddressChecked(false);
            setGuardianAddressMsg('Incorrect address');
        }
    }, ApplicationConfig.defaultDebounceWait);

    useEffect(() => {
        if(guardians && guardians.length){
            setGuardianAddressOri(guardians[0]);
            setGuardianAddress(guardians[0]);
            setGuardianAddressChecked(false);
            setGuardianAddressMsg('');
        }
    }, [guardians]);



    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState('Confirm');


    useEffect(() => {
        setSubmitEnable(guardianAddressChecked);
    }, [guardianAddressChecked]);


    const addGuardianAddress = async () => {
        let defaultZeroDevProjectId = import.meta.env.VITE_ZERODEV_PROJECT_ID || '';
        if(!defaultZeroDevProjectId){
            return;
        }

        let txContent = `Set guardian address to ${guardianAddress}`;
        let timestamp = new Date().getTime();

        try {
            let status = TransactionState.Submit;
            transactionContext.dispatch({
                status: status,
                timestamp: timestamp,
                txContent: txContent,
            });

            let recoveryData = {
                // Guardian addresses with their weights
                guardians: {
                    [guardianAddress]: 1,
                },
                threshold: 1,
                delaySeconds: 0,
            };
            let recoveryProvider = await RecoveryProvider.init({
                projectId: defaultZeroDevProjectId,
                defaultProvider: web3Provider,
                opts: {
                    validatorConfig: {
                        ...recoveryData,
                    },
                },
            });
            let result = await recoveryProvider.enableRecovery();
            let txHash = await recoveryProvider.waitForUserOperationTransaction(result.hash);
            console.debug(`enableRecovery result =>`, result, `txHash =>`, txHash);

            transactionContext.dispatch({
                status: TransactionState.Success,
                timestamp: timestamp,
                txContent: txContent,
                hash: txHash,
            });

            onSettingSuccessfulLocal();
        } catch (e) {
            console.error(e);

            transactionContext.dispatch({
                status: TransactionState.Exception,
                timestamp: timestamp,
                txContent: txContent,
            });
        }
    };

    // TODO remove is not supported yet
    const removeGuardianAddress = async () => {
        let defaultZeroDevProjectId = import.meta.env.VITE_ZERODEV_PROJECT_ID || '';
        if(!defaultZeroDevProjectId){
            return;
        }

        let txContent = `Remove guardian address ${guardianAddress}`;
        let timestamp = new Date().getTime();

        try {
            let status = TransactionState.Submit;
            transactionContext.dispatch({
                status: status,
                timestamp: timestamp,
                txContent: txContent,
            });

            let recoveryData = {
                // Guardian addresses with their weights
                guardians: {
                    [guardianAddress]: 0,
                },
                threshold: 1,
                delaySeconds: 0,
            };
            let recoveryProvider = await RecoveryProvider.init({
                projectId: defaultZeroDevProjectId,
                defaultProvider: web3Provider,
                opts: {
                    validatorConfig: {
                        ...recoveryData,
                    },
                },
            });
            let result = await recoveryProvider.renewRecovery();
            let txHash = await recoveryProvider.waitForUserOperationTransaction(result.hash);
            console.debug(`renewRecovery result =>`, result, `txHash =>`, txHash);

            transactionContext.dispatch({
                status: TransactionState.Success,
                timestamp: timestamp,
                txContent: txContent,
                hash: txHash,
            });

            onSettingSuccessfulLocal();
        } catch (e) {
            console.error(e);

            transactionContext.dispatch({
                status: TransactionState.Exception,
                timestamp: timestamp,
                txContent: txContent,
            });
        }
    };

    const modifyGuardianAddress = async () => {
        let defaultZeroDevProjectId = import.meta.env.VITE_ZERODEV_PROJECT_ID || '';
        if(!defaultZeroDevProjectId){
            return;
        }

        let txContent = `Set guardian address to ${guardianAddress}`;
        let timestamp = new Date().getTime();

        try {
            let status = TransactionState.Submit;
            transactionContext.dispatch({
                status: status,
                timestamp: timestamp,
                txContent: txContent,
            });

            let recoveryData = {
                // Guardian addresses with their weights
                guardians: {
                    [guardianAddress]: 1,
                },
                threshold: 1,
                delaySeconds: 0,
            };
            let recoveryProvider = await RecoveryProvider.init({
                projectId: defaultZeroDevProjectId,
                defaultProvider: web3Provider,
                opts: {
                    validatorConfig: {
                        ...recoveryData,
                    },
                },
            });
            let result = await recoveryProvider.renewRecovery();
            let txHash = await recoveryProvider.waitForUserOperationTransaction(result.hash);
            console.debug(`renewRecovery result =>`, result, `txHash =>`, txHash);

            transactionContext.dispatch({
                status: TransactionState.Success,
                timestamp: timestamp,
                txContent: txContent,
                hash: txHash,
            });

            onSettingSuccessfulLocal();
        } catch (e) {
            console.error(e);

            transactionContext.dispatch({
                status: TransactionState.Exception,
                timestamp: timestamp,
                txContent: txContent,
            });
        }
    };

    const onSaveGuardianAddress = async () => {
        console.debug(`guardianSettingType =>`, guardianSettingType);

        switch (guardianSettingType) {
            case 'add':
                await addGuardianAddress();
                break;
            case 'remove':
                await removeGuardianAddress();
                break;
            case 'modify':
                await modifyGuardianAddress();
                break;
        }
    };


    const resetInput = () => {
        setGuardianAddressChecked(true);
        setGuardianAddressMsg('');
    };


    const onSettingSuccessfulLocal = () => {
        resetInput();
        onClose && onClose();
    };

    const onSubmit = () => {
        onSaveGuardianAddress();
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal guardian_settings'}
        >
            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'f_r_l dialog_title b'}>
                    <div className={'i_icon_24 i_gudardian m_r_5'}></div>
                    <div>{`Guardian Setting`}</div>
                </div>

                <div className={`f_c_c_c`}>
                    <div className={`i_icon_64 i_safe_lock g_icon`}></div>

                    <div className={`b g_title f_16`}>{`Add more security`}</div>
                </div>

                <div className={`g_c_account r_8 squircle_border`}>{`Acc. address: ${web3Context?.account}`}</div>

                <div className={'f_c_l m_t_25'}>
                    <div className={'f_r_b'}>
                        <div>{`Guardian Address`}</div>
                        <a href={ApplicationConfig.aaRecoveryURI} className={'c_link'} target={`_blank`}>{`Recovery`}</a>
                    </div>

                    <div className={'w_100 text_input i_number m_t_10'}>
                        <Input
                            placeholder={'Enter guardian address'}
                            className={'c_hl'}
                            value={guardianAddress}
                            onChange={(event) => {
                                onAddressChange(event);
                                setGuardianAddress(event.target.value);
                            }}
                        />
                    </div>
                </div>

                {!guardianAddressChecked && guardianAddressMsg && (
                    <div className={'f_r_l r_8 tips_bar_warning m_t_25 c_p_12'}>
                        <div className={'i_icon_24 i_tips_info'}></div>
                        <div className={'m_l_3'}>{guardianAddressMsg}</div>
                    </div>
                )}

                {guardianAddressChecked && guardianAddressWarning && guardianAddressMsg && (
                    <div className={'f_r_l r_8 tips_bar_warning m_t_25 c_p_12'}>
                        <div className={'i_icon_24 i_tips_info'}></div>
                        <div className={'m_l_3'}>{guardianAddressMsg}</div>
                    </div>
                )}

                <div className={`f_c_l g_tips r_8 squircle_border`}>
                    <div className={`c_mark`}>{`Set up a guardian for current account, then you can recover account with this guardian.`}</div>
                    <a href={'#'} className={'c_link'}>{intl.get(`commons.component.link.learn_more`)}</a>
                </div>


                <div className={'f_r_r gap-2'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{`Cancel`}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{submitTxt}</button>
                </div>
            </div>
        </Modal>
    );
};

export default GuardianSettingDialog;
