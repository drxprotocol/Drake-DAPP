import './index.scss';

import React, { useState } from 'react';
import {useIntl} from "../../../../components/i18n";

const About = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l w_100 e_about'}>
            <div className={'f_c_l w_100'}>
                <a name={`about_earn`}></a>
                <div className={'e_h2'}>{intl.get(`page.earn.overview.title`)}</div>

                {/*
                <div className={'m_t_15 e_a_content'}>
                    {`You can earn protocol income (paid in ETH) and MUX rewards from veMUX locked-staking and MUXLP staking. All staking will take place on Arbitrum. `}
                    <a href={'#'} className={'c_link t_underline'}>Learn More</a>
                </div>
                */}

                <div className={'r_20 squircle_border e_a_content_graph m_t_25'}>
                    <div className={`f_c_c_c g_content_box`}>
                        <div className={`bg_about_earn m_t_20`}></div>

                        <div className={`w_100`}>
                            <div className={`r_12 squircle_border f_16 about_graph_content_box`}>
                                {`*commission fee, borrowing fee, isolated-margin mode additional margin fee, cross-margin mode liability interest`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
