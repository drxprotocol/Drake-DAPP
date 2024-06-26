import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import {useConfiguredContractSend, useContractCall} from "../../ContractHooks";
import ContractConfig from "../../../contract/ContractConfig";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import {useEthers} from "@usedapp/core";
import {ArbitrumSepoliaChain} from "../../../contract/ChainConfig";

const EnableDemoTradingDialog = ({ isOpen, onClose, onEnable }) => {
    const web3Context = useContext(WebThreeContext);
    const {switchNetwork} = useEthers();

    const [agree, setAgree] = useState(false);

    const onSubmit = async () => {
        let chainId = ArbitrumSepoliaChain.chainId;
        await switchNetwork(chainId);
        onEnable && onEnable();
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal enable_demo_trading_dialog'}
        >
            <div className={`w_100 f_c_l trade_sections`}>
                <div className={'f_r_l m_title_nm b'}>
                    <div className={'dialog_title b'}>{`Demo Trading Account`}</div>
                </div>

                <div className={'content'}>
                    <p>{`Demo trading will allow users to practice trading with a simulated account with paper money. This is a risk-free way to learn how the Drake trading platform works and to test trading strategies before using real money.`}</p>
                    <p className={'m_t_10'}>{`As demo trading is deployed under the test net, users still need to claim some test ETH in order to pay for transaction gas. Please check this faucet for test ETH.`}</p>
                    <p className={'m_t_30'}>{`By clicking Agree you accept the T&Cs`}</p>
                </div>

                <div className={'f_r_l'}>
                    <div className={`cp i_icon_24 ${agree ? 'i_checkbox_checked' : 'i_checkbox'}`} onClick={() => {setAgree(!agree)}}></div>
                    <div className={'cp m_l_10'} onClick={() => {setAgree(!agree)}}>{`I agree`}</div>
                </div>

                <div className={'f_r_r gap-2 m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{`Cancel`}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" disabled={!agree} onClick={() => {onSubmit()}}>{'Confirm'}</button>
                </div>
            </div>
        </Modal>
    );
};

export default EnableDemoTradingDialog;
