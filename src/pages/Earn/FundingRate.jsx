import './trading.scss';
import './dataTable.scss';
import './index.scss';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageInfoContext from '../../components/PageInfoProvider/PageInfoContext';
import WebThreeContext from "../../components/WebThreeProvider/WebThreeContext";
import LeftMenu from "./components/LeftMenu";
import FundingRateMain from "./components/FundingRateMain";
import {getQueryString} from "../../utils/URLUtil";

const leftNavKeyMap = {
    'USDC': 'frusdc_vault',
};

export const FundingRate = () => {
    const web3Context = useContext(WebThreeContext);
    const pageInfoContext = useContext(PageInfoContext);

    useEffect(() => {
        let vaultToken = getQueryString('vault') || 'USDT';
        let leftNavKey = leftNavKeyMap[vaultToken];
        pageInfoContext.dispatch({
            title: 'Funding rate vault',
            description: 'Funding rate vault',
            nav: 'Earn',
            leftNav: leftNavKey,
        });
    }, []);

    return (
        <div className={'f_c_l_c w-full trade_sections earn_sections'}>
            <div className={'f_r_b_t_w section gap-5'}>
                <LeftMenu/>

                <div className={'f_c_l_c f_r_main'}>
                    <FundingRateMain />
                </div>
            </div>
        </div>
    );
};