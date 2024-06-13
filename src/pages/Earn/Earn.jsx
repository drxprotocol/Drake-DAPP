import '../Trade/index.scss';
import './index.scss';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageInfoContext from '../../components/PageInfoProvider/PageInfoContext';
import WebThreeContext from "../../components/WebThreeProvider/WebThreeContext";
import LeftMenu from "./components/LeftMenu";
import EarnMain from "./components/EarnMain";
import {getQueryString} from "../../utils/URLUtil";

const leftNavKeyMap = {
    'USDT': 'dusdt_vault',
    'DAI': 'ddai_vault',
    'WETH': 'dweth_vault',
    'WBTC': 'dwbtc_vault',
};

export const Earn = () => {
    const web3Context = useContext(WebThreeContext);
    const pageInfoContext = useContext(PageInfoContext);

    useEffect(() => {
        let vaultToken = getQueryString('vault') || 'USDT';
        let leftNavKey = leftNavKeyMap[vaultToken];
        pageInfoContext.dispatch({
            title: 'Earn',
            description: 'Earn',
            nav: 'Earn',
            leftNav: leftNavKey,
        });
    }, []);

    return (
        <div className={'f_c_l_c w-full trade_sections earn_sections'}>
            <div className={'f_r_b_t_w section gap-5'}>
                <LeftMenu/>

                <div className={'f_c_l_c es_main'}>
                    <EarnMain />
                </div>
            </div>
        </div>
    );
};