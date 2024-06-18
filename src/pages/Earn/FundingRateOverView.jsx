import '../Trade/index.scss';
import './index.scss';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageInfoContext from '../../components/PageInfoProvider/PageInfoContext';
import WebThreeContext from "../../components/WebThreeProvider/WebThreeContext";
import LeftMenu from "./components/LeftMenu";
import {AboutFundingRate} from "./components/About/AboutFundingRate";

export const FundingRateOverView = () => {
    const web3Context = useContext(WebThreeContext);
    const pageInfoContext = useContext(PageInfoContext);

    useEffect(() => {
        pageInfoContext.dispatch({
            title: 'Earn',
            description: 'Earn',
            nav: 'Earn',
            leftNav: 'about_earn',
        });
    }, []);

    return (
        <div className={'f_c_l_c w-full trade_sections earn_sections'}>
            <div className={'f_r_b_t_w section gap-5'}>
                <LeftMenu/>

                <div className={'f_c_l es_main'}>
                    <div className={'f_c_l_c w_100'}>
                        <div className={'f_c_l_c section_container_mobile'}>
                            <AboutFundingRate />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};