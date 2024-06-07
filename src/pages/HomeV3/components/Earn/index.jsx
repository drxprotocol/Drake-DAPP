import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";
import {goToTrading} from "../GoToTrading";
import ApplicationConfig from "../../../../ApplicationConfig";

const ReferAndEarn = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 refer_and_earn_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_c_l section_s'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_hand_pointing'}></div>
                        <div className={'sss_title b'}>{`REFER & EARN`}</div>
                    </div>

                    <div className={'f_r_b_t w_100 title_box'}>
                        <div className={'f_c_l m_t_15'}>
                            <div className={'title'}>
                                <span>{`Spread the word, `}</span>
                                <span className={`title_c`}>{`share the rewards!`}</span>
                            </div>

                            <div className={`title_g m_t_20 f_20`}>{`Join our referer program and earn exciting benefits for every friend you bring onboard. It's quick, easy, and rewarding. `}</div>
                            <div className={`f_r_l`}>
                                <div className={`e_link_btn ${ApplicationConfig.comingSoon && 'disable'} r_12 squircle_border m_t_20 f_16 b cp`} onClick={goToTrading}>{`Start referring now!`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'bg_pic_placeholder'}>
                    <div className={`bg_pic2`}></div>
                    <div className={`bg_pic1`}></div>
                    <div className={`bg_pic`}></div>
                </div>
            </div>


        </div>
    );
};

export default ReferAndEarn;