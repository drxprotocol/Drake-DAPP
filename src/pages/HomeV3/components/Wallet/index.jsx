import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";
import bg_wallet_1 from "./img/bg_wallet_1.svg";
import bg_wallet_1_png from "./img/bg_wallet_1.png";

const WalletFeature = () => {
    const intl = useIntl();

    return (
        <div className={'f_c_l_c w_100 wallet_feature_v3'}>
            <div className={'f_c_l section_s hp_section'}>
                <div className={'f_c_l section_s'}>
                    <div className={'f_r_b_w gap-5'}>
                        <div className={`f_c_l w_f_item`}>
                            <div className={'f_r_l m_b_18'}>
                                <div className={'i_icon_24 i_gas_pump'}></div>
                                <div className={'sss_title b'}>{`HASSLE-FREE, GASLESS TRADING`}</div>
                            </div>

                            <div className={`f_c_c_c r_20 squircle_border w_f_item_sub`}>
                                <div className={`w_f_title w_f_title1 b text_center`}>{`Login with a social account or wallet and trade gas-free`}</div>
                                <div className={`w_f_bg_1`}>
                                    <img className={'pic mobile:hidden lg:block'} src={bg_wallet_1}/>
                                    <img className={'pic lg:hidden'} src={bg_wallet_1_png}/>
                                </div>
                            </div>
                        </div>


                        <div className={`f_c_l w_f_item`}>
                            <div className={'f_r_l m_b_18'}>
                                <div className={'i_icon_24 i_settings_slider'}></div>
                                <div className={'sss_title b'}>{`OPTIMIZED FOR MOBILE TRADING`}</div>
                            </div>

                            <div className={`f_c_c_c r_20 squircle_border w_f_item_sub w_f_item_b`}>
                                <div className={`bg_w_f_item_b`}></div>

                                <div className={`w_ic_gift`}></div>
                                <div className={`w_f_title b text_center`}>{`Easily trade on mobile`}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default WalletFeature;