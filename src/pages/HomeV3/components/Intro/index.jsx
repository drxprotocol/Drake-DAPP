import React, { useMemo, useEffect } from 'react';

import './index.scss';
import {useIntl} from "../../../../components/i18n";
import {goToTrading} from "../GoToTrading";
import ApplicationConfig from "../../../../ApplicationConfig";
import bg_cube from "./img/bg_cube.svg";
import bg_demo from "./img/bg_demo.svg";
import bg_demo_png from "./img/bg_demo.png";

const Intro = () => {
    const intl = useIntl();

    return (
        <div className={'w_100 intro_v3'}>
            <div className={`bg_pic_box`}>
                <img className={'pic'} src={bg_cube}/>
            </div>

            <div className={'f_c_l_c w_100 '}>
                <div className={'f_c_l section_s hp_section intro_container'}>
                    <div className={'f_r_b_w gap-5'}>
                        <div className={`f_c_l i_left`}>
                            <div className={`i_l_title`}>
                                <p>{`Advanced Trading,`}</p>
                                <p className={`i_l_title_b`}>{`Made Easy`}</p>
                            </div>

                            <div className={`i_l_title_s m_t_20 f_20`}>{`Enjoy a seamless trading experience featuring self-custody, cross-margin with diverse collateral options, gas-free trading, deep liquidity, and meticulous risk control.`}</div>
                        </div>

                        <div className={`f_c_l i_right`}>
                            <div className={`f_r_l gap-5`}>
                                <div className={`bg_line_l`}></div>

                                <div className={'bg_base'}></div>
                                <div className={'bg_chainlink'}></div>
                                {/* <div className={'bg_arbitrum'}></div> */}

                                <div className={`bg_line_r`}></div>
                            </div>
                            <div className={`f_r_b e_link_btn ${ApplicationConfig.comingSoon && 'disable'} r_16 squircle_border b m_t_30 cp`} onClick={goToTrading}>
                                <div>{`Try Paper Trading Now`}</div>
                                <div className="i_icon_24 i_arrow_right_up_w1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'f_c_l section_s hp_section'}>
                    <div className={'f_c_l i_features_box r_16'}>
                        <div className={`f_r_b i_features_content`}>
                            <div>{`Maintain Full Custody Of Your Assets`}</div>
                            <div className={`i_icon_20 i_star_four m_l_8 m_r_8`}></div>
                            <div>{`Easy Login With Web2 Social Accounts`}</div>
                            <div className={`i_icon_20 i_star_four m_l_8 m_r_8`}></div>
                            <div>{`Mobile Friendly - Trade Anywhere, Anytime`}</div>
                        </div>
                    </div>
                </div>

                <div className={'f_c_l section_s ui_demo_content'}>
                    <div className={'bg_ui_demo'}>
                        <img className={'pic mobile:hidden lg:block'} src={bg_demo}/>
                        <img className={'pic lg:hidden'} src={bg_demo_png}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Intro;