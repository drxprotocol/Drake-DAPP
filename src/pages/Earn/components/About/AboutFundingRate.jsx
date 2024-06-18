import './index.scss';

import React, { useState } from 'react';
import {useIntl} from "../../../../components/i18n";

export const AboutFundingRate = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l w_100 e_about'}>
            <div className={'f_c_l w_100'}>
                <a name={`about_earn`}></a>
                <div className={'e_h2'}>{`Funding Rate Earn`}</div>

                {/*
                <div className={'m_t_15 e_a_content'}>
                    {`You can earn protocol income (paid in ETH) and MUX rewards from veMUX locked-staking and MUXLP staking. All staking will take place on Arbitrum. `}
                    <a href={'#'} className={'c_link t_underline'}>Learn More</a>
                </div>
                */}

                <div className={'r_20 squircle_border e_a_content_graph m_t_25'}>
                    <div className={`f_c_c_c g_content_box w_100`}>
                        <div className={`bg_about_funding_rate m_t_20`}></div>

                        <div className={`f_c_l w_100`}>
                            <div className={`about_graph_content_nb_box m_t_50`}>
                                <span>{`“Since `}</span>
                                <span className={`b m_l_3 m_r_3`}>{`Drake `}</span>
                                <span>{`supports ETH as collateral, `}</span>
                                <span className={`c_green m_l_3`}>{`no rebalance operation is needed`}</span>
                                <span>{`; higher leverage can be achieved if the user wants to borrow USDC from the Drake staking pool”`}</span>
                            </div>

                            <div className={`r_12 text_center squircle_border f_16 about_graph_content_box about_graph_content_box_funding`}>
                                {`Final: Arbitragers reduce open interest mismatch while capturing delta neutral profits`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};