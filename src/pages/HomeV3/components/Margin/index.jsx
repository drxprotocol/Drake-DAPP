import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";

const MarginFeature = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 margin_feature_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_c_l section_s'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_features'}></div>
                        <div className={'sss_title b'}>{`CENTRALIZED EXCHANGE QUALITY - FULLY ON-CHAIN`}</div>
                    </div>

                    <div className={'f_r_b_t w_100'}>
                        <div className={'m_t_15'}>
                            <span className={'title'}>{`Experience CEX quality features such as cross margin, stop and limit orders, and easy deleveraging `}</span>
                            <span className={'title title_b_g'}>{`all while keeping full control and custody of your assets.`}</span>
                        </div>
                    </div>
                </div>

                <div className={`f_r_b_w m_ui_demo_box t_c gap-5`}>
                    <div className={`f_c_l gap-5`}>
                        <div className={`f_c_c_t m_demo_item r_12 squircle_border`}>
                            <div className={`m_d_title f_16`}>{`Cross Margin`}</div>
                            <div className={`m_d_title_s m_t_8`}>{`Users can allocate arbitrary additional margin on top of an open position`}</div>
                            <div className={`m_d_bg_1`}></div>
                        </div>
                    </div>

                    <div className={`f_c_l gap-5`}>
                        <div className={`f_c_c_t m_demo_item r_12 squircle_border`}>
                            <div className={`m_d_title f_16`}>{`Stop order with trigger price`}</div>
                            <div className={`m_d_title_s m_t_8`}>{`The order will be executed as market order immediately if the current price has already reached trigger price`}</div>
                            <div className={`m_d_bg_2`}></div>
                        </div>
                    </div>

                    <div className={`f_c_l gap-5`}>
                        <div className={`f_c_c_t m_demo_item r_12 squircle_border`}>
                            <div className={`m_d_title f_16`}>{`Collateral Swap (Cross)`}</div>
                            <div className={`m_d_title_s m_t_8`}>{`Users have the flexibility to adjust the size of open positions used`}</div>
                            <div className={`m_d_bg_3`}></div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default MarginFeature;