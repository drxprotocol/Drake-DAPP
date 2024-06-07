import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";
import {goToTrading} from "../GoToTrading";
import ApplicationConfig from "../../../../ApplicationConfig";

const SecurityAudits = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 h_audits_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_r_b_t_w section_s'}>
                    <div className={'f_c_l title_box'}>
                        <div className={'f_r_l title'}>
                            <div>{`Security & Audits`}</div>
                            <div className={`m_l_20 a_lear_more r_8 f_16 b cp`}>{`Learn more`}</div>
                        </div>

                        <div className={`title_g m_t_10`}>{`Our smart contracts have been unit tested and have undergone multiple independent audits from top class audit firms`}</div>
                    </div>

                    <a href={'https://dedaub.com/'} target={'_blank'}>
                        <div className={`ic_audits_logo`}></div>
                    </a>
                </div>

                <div className={`f_r_b go_to_trading ${ApplicationConfig.comingSoon && 'disable'} r_20 cp m_t_60`} onClick={goToTrading}>
                    <div className={``}>{`START TRADING NOW`}</div>
                    <div className={`i_icon_48 i_arrow_right_up_w1 arrow_trading`}></div>
                </div>
            </div>

            <div className={'bg_pic_placeholder'}>
                <div className={`bg_pic`}></div>
            </div>
        </div>
    );
};

export default SecurityAudits;