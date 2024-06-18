import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {useIntl} from "../../../../../components/i18n";

const YourStats = ({token}) => {
    const intl = useIntl();

    return (
        <div className={`f_c_l r_12 squircle_border f_r_section_item f_r_section_item_s trade_sections your_stats`}>
            <div className={`f_c_l w_100 f_r_section_item_content`}>
                <div className={`f_r_l`}>
                    <div className={`i_icon_24 i_reports`}></div>
                    <div className={`b m_l_5 f_r_title`}>{`Your Stats`}</div>
                </div>
            </div>

            <div className={`f_c_l gap-3 w_100 f_r_section_item_content_nb f_14`}>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your Deposit`}</div>
                    <div className={`t_dashed_underline`}>{`0 USDC`}</div>
                </div>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your iUSDC Balance`}</div>
                    <div className={`t_dashed_underline`}>{`0 USDC`}</div>
                </div>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your USDC Balance`}</div>
                    <div className={`t_dashed_underline`}>{`0 USDC`}</div>
                </div>
            </div>
        </div>
    );
};

export default YourStats;
