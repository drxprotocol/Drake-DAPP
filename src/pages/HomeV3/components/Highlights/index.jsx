import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";

const Highlights = () => {
    const intl = useIntl();

    return (
        <div className={'w_100 f_c_l_c highlights'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={`w_100 f_r_l`}>
                    <div className={`i_icon_44 i_sparkle`}></div>
                    <div className={`h_title b m_l_15`}>{`Highlights`}</div>
                </div>

                <div className={'f_r_b_w w_100 m_t_30 gap-5'}>
                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_custody`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Self Custody`}</div>
                            <div className={`h_i_content`}>{`Sleep easy knowing you are in full control of your funds`}</div>
                        </div>
                    </div>

                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_assets`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Diverse Assets`}</div>
                            <div className={`h_i_content`}>{`Trade top pairs with deep liquidity against USDC or USD`}</div>
                        </div>
                    </div>

                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_gas_free`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Gas-Free`}</div>
                            <div className={`h_i_content`}>{`Trade gas-free when using an AA wallet`}</div>
                        </div>
                    </div>


                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_onboarding`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Fast Onboarding`}</div>
                            <div className={`h_i_content`}>{`Log in with a social account or existing crypto wallet and start trading instantly`}</div>
                        </div>
                    </div>

                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_lightning`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Lightning Fast`}</div>
                            <div className={`h_i_content`}>{`Institutional grade trading using Chainlink Low Latency Oracle`}</div>
                        </div>
                    </div>

                    <div className={`f_r_l_t r_20 squircle_border h_item`}>
                        <div className={`h_i_icon i_low_fees`}></div>
                        <div className={`f_c_l`}>
                            <div className={`h_i_title`}>{`Low Fees`}</div>
                            <div className={`h_i_content`}>{`Trade in size without losing capital to fees due to our attractive fee structure`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Highlights;