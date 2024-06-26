import './index.scss';

import React, {useContext, useState, useEffect} from 'react';
import WebThreeContext from "../../../../components/WebThreeProvider/WebThreeContext";
import {FundingRateVaultToken} from "../../../../components/StakingStructure";
import {buildToken} from "../../../../hooks/useTrdingMeta";
import {DefaultChain} from "../../../../contract/ChainConfig";
import {getQueryString} from "../../../../utils/URLUtil";
import {useIntl} from "../../../../components/i18n";
import HowItWorks from "./components/HowItWorks";
import FundingRateStats from "./components/FundingRateStats";
import FundingRateForm from "./components/FundingRateForm";
import ProfitCalculator from "./components/ProfitCalculator";
import YourStats from "./components/YourStats";
import FundingRateList from "./components/FundingRateList";

const FundingRateMain = () => {
    const intl = useIntl();

    const web3Context = useContext(WebThreeContext);
    const [token, setToken] = useState(new FundingRateVaultToken({name: 'USDC'}));
    useEffect(() => {
        let vaultTokenName = getQueryString('vault') || 'USDC';
        let _token = buildToken(vaultTokenName, web3Context?.account ? web3Context?.chainId : DefaultChain.chainId);
        _token = new FundingRateVaultToken(_token);

        console.debug(`fundingRateVaultToken =>`, _token);

        setToken(_token);
    }, [web3Context?.account]);

    const onVaultTokenChange = (vaultToken) => {
        // console.debug(`vaultToken =>`, vaultToken);

        setToken(vaultToken);
    };

    return (
        <div className={'f_c_l w_100 trade_sections f_r_main_section'}>
            <div className={'f_c_l w_100'}>
                <div className={'e_h2 title_box'}>{`Funding Rate Vault`}</div>
            </div>

            <HowItWorks/>

            <div className={'f_r_b_w w_100 m_t_20'}>
                <FundingRateStats token={token}/>
                <FundingRateForm token={token}/>
            </div>

            <div className={'f_r_b_w w_100 m_t_20'}>
                {/*
                <ProfitCalculator/>
                */}
            </div>

            <div className={'f_r_b_w w_100'}>
                <FundingRateList token={token}/>
            </div>
        </div>
    );
};

export default FundingRateMain;
