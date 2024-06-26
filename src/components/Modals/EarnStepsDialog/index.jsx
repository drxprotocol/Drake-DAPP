import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import {useIntl} from "../../i18n";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import {checkBaseNetwork} from "../../../contract/ChainConfig";

const EarnStepsDialog = ({vaultToken, isOpen, onClose }) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [stepTitle1, setStepTitle1] = useState('page.earn.vault.steps.step1.title');
    useEffect(() => {
        let isBaseNetwork = checkBaseNetwork(web3Context?.chainId);
        setStepTitle1(isBaseNetwork ? 'page.earn.vault.steps.step1.title_usdc' : 'page.earn.vault.steps.step1.title');
    }, [web3Context?.chainId]);

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal earn_steps_dialog'}
        >
            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'dialog_title b'}>{intl.get(`page.earn.vault.steps.title`)}</div>

                <div className={'f_r_b m_t_25 bg_container r_8 f_12 c_p_12'}>
                    <div className={'f_c_l w_100'}>
                        <div className={'c_t'}>{intl.get(stepTitle1)}</div>
                        <div className={'m_t_5'}>{intl.get(`page.earn.vault.steps.step1.content`)}</div>
                    </div>
                </div>

                <div className={'f_r_b m_t_15 bg_container r_8 f_12 c_p_12'}>
                    <div className={'f_c_l w_100'}>
                        <div className={'c_t'}>{intl.get(`page.earn.vault.steps.step2.title`)}</div>
                        <div className={'m_t_5'}>{intl.get(`page.earn.vault.steps.step2.content`)}</div>
                    </div>
                </div>

                <div className={'f_r_r gap-2 m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClose()}}>{intl.get(`commons.component.btn.cancel`)}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" onClick={() => {onClose()}}>{intl.get(`commons.component.btn.ok`)}</button>
                </div>
            </div>
        </Modal>
    );
};

export default EarnStepsDialog;
