import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";

const RiskManagement = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 risk_management_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_c_l section_s'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_risk_manage'}></div>
                        <div className={'sss_title b'}>{`RISK MANAGEMENT`}</div>
                    </div>

                    <div className={'f_r_l w_100'}>
                        <div className={'f_c_l title_box'}>
                            <div className={'title'}>{`Top tier risk control`}</div>
                            <div className={`f_24 title_g m_t_15`}>{`Enjoy balanced funding rates, strategic taker fees, auto-deleverage safeguards, and adaptive position management. Trade confidently, knowing your assets are protected at every step`}</div>
                        </div>
                    </div>
                </div>


                <div className={`f_r_b_w risk_items gap-5`}>
                    <div className={`f_c_l risk_item_box r_i_b_1 r_20 squircle_border`}>
                        <div className={`risk_icon risk_icon_1`}></div>

                        <div className={`f_c_l`}>
                            <div className={`f_16 b r_i_title r_i_title_1`}>{`Dynamic Fee`}</div>
                            <div className={`title_f b`}>{`Dynamic funding and borrowing fees to minimize risk without compromising scalability.`}</div>
                        </div>
                    </div>

                    <div className={`f_c_l risk_item_box r_i_b_2 r_20 squircle_border`}>
                        <div className={`risk_icon risk_icon_2`}></div>

                        <div className={`f_c_l`}>
                            <div className={`f_16 b r_i_title r_i_title_2`}>{`Auto Deleveraging`}</div>
                            <div className={`title_f b`}>{`Auto-Deleveraging (ADL) to maintain trader net exposure within a controllable threshold.`}</div>
                        </div>
                    </div>

                    <div className={`f_c_l risk_item_box r_i_b_3 r_20 squircle_border`}>
                        <div className={`risk_icon risk_icon_3`}></div>

                        <div className={`f_c_l`}>
                            <div className={`f_16 b r_i_title r_i_title_3`}>{`OI Imbalance Control`}</div>
                            <div className={`title_f b`}>{`Utilizing more efficient collateral can contribute to minimizing open interest mismatches by basis arbitrage traders.`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskManagement;