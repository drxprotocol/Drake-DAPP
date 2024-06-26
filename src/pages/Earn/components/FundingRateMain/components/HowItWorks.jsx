import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {useIntl} from "../../../../../components/i18n";

const HowItWorks = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    return (
        <div className={`f_c_l_c r_12 squircle_border m_t_15 how_it_works_box`}>
            <div className={`f_c_l h_i_w_content_box`}>
                <div className={`f_r_l h_title`}>
                    <div className={`i_icon_24 i_dropdown_w`}></div>
                    <div className={`m_l_3 b`}>{`How does it work ?`}</div>
                </div>
                <div className={`h_content m_t_15`}>{`In this strategy, users can deposit USDC to collect funding rate premiums on any token with a positive funding rate. To begin, deposit USDC into the vault; the protocol will automatically swap the deposit for assets with a positive funding rate, deposit the asset into a cross margin account, and create a short position on the asset to collect the funding rate while staying delta neutral. All these operations can be settled in a single transaction with no rebalance needed during funding collection periods. The user will receive an frUSDC token representing their share of the funding rate yield in the vault.  Users can withdraw at any time, during which their frUSDC will be swapped for USDC equaling their initial deposit plus the interest earned.`}</div>
            </div>

            <div className={`f_r_b h_flow`}>
                <div className={`f_r_l`}>
                    <div className={`h_f_icon i_f_icon_up`}></div>
                    <div className={`h_flow_text b`}>{`1. Deposit USDC`}</div>
                </div>

                <div className={`i_f_icon_arrow`}></div>

                <div className={`f_r_l`}>
                    <div className={`h_f_icon i_f_icon_down`}></div>
                    <div className={`h_flow_text b`}>{`2. Receive frUSDC`}</div>
                </div>

                <div className={`i_f_icon_arrow`}></div>

                <div className={`f_r_l`}>
                    <div className={`h_f_icon i_f_icon_money`}></div>
                    <div className={`h_flow_text b`}>{`3. Withdraw and burn frUSDC`}</div>
                </div>

                <div className={`i_f_icon_arrow`}></div>

                <div className={`f_r_l`}>
                    <div className={`h_f_icon i_f_icon_down`}></div>
                    <div className={`h_flow_text b`}>{`4. Receive USDC`}</div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
