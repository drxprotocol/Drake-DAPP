import './index.scss';

import React, { useContext, useEffect } from 'react';
import PageInfoContext from '../../components/PageInfoProvider/PageInfoContext';
import Intro from "./components/Intro";
import Highlights from "./components/Highlights";
import MarginFeature from "./components/Margin";
import WalletFeature from "./components/Wallet";
import RiskManagement from "./components/Risk";
import Arbitrage from "./components/Arbitrage";
import ReferAndEarn from "./components/Earn";
import SecurityAudits from "./components/Audits";

const HomeV3 = () => {
    const pageInfoContext = useContext(PageInfoContext);

    useEffect(() => {
        pageInfoContext.dispatch({
            title: 'Drake',
            description: 'Drake',
            nav: 'Home',
        });

        document.getElementsByTagName('body')[0].className = 'theme_dark';
    }, []);

    return (
        <div className={'f_c_l_c root_container_hp '}>
            <Intro/>
            <Highlights/>
            <MarginFeature/>
            <WalletFeature/>
            <RiskManagement/>
            <Arbitrage/>
            <ReferAndEarn/>
            <SecurityAudits/>
        </div>
    );
};

export default HomeV3;
