import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";
import bg_arbitrage_des from "./img/bg_arbitrage_des.svg";
import bg_arbitrage_des_mobile from "./img/bg_arbitrage_des_mobile.png";

const Arbitrage = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 arbitrage_feature_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_c_l section_s'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_risk_manage'}></div>
                        <div className={'sss_title b'}>{`ARBITRAGE & HEDGING STRATEGIES`}</div>
                    </div>

                    <div className={'f_r_b_t w_100'}>
                        <div className={'f_c_l m_t_15'}>
                            <div className={'title'}>
                                <span>{`Enabling advanced hedging and arbitrage `}</span>
                                <span className={`title_c`}>{`strategies`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'f_c_c pic_box r_20 squircle_border bg_box'}>
                    <div className={`f_c_c_c pic`}>
                        <img className={'f_r_l i_arbitrage_img_bg mobile:hidden lg:block'} src={bg_arbitrage_des} />
                        <img className={'f_r_l i_arbitrage_img_bg mobile:block lg:hidden'} src={bg_arbitrage_des_mobile} />
                    </div>

                    <div className={`title_g t_c f_14`}>
                        <span>{`Since`}</span>
                        <span className={`b`}>{` Drake `}</span>
                        <span>{`support ETH as collateral, `}</span>
                        <span className={`title_green b`}>{`no rebalance operation is needed; `}</span>
                        <span>{`higher leverage can be achieved if the user wants to borrow USDC from the Drake staking pool`}</span>
                    </div>

                    <div className={`bg_box r_12 squircle_border a_tips b m_t_20 t_c`}>{`Final: Arbitragers reduce open interest mismatch while capturing delta neutral profits`}</div>
                </div>
            </div>
        </div>
    );
};

export default Arbitrage;