import './index.scss';

import React, {useContext, useState, useEffect} from 'react';
import WebThreeContext from "../../../../components/WebThreeProvider/WebThreeContext";
import {VaultToken} from "../../../../components/StakingStructure";
import {buildToken} from "../../../../hooks/useTrdingMeta";
import {DefaultChain} from "../../../../contract/ChainConfig";
import {getQueryString} from "../../../../utils/URLUtil";
import {useIntl} from "../../../../components/i18n";
import HowItWorks from "./components/HowItWorks";
import FundingRateStats from "./components/FundingRateStats";
import FundingRateForm from "./components/FundingRateForm";
import ProfitCalculator from "./components/ProfitCalculator";
import YourStats from "./components/YourStats";

const FundingRateMain = () => {
    const intl = useIntl();

    const web3Context = useContext(WebThreeContext);
    const [token, setToken] = useState(new VaultToken({name: 'USDT'}));
    useEffect(() => {
        if(!web3Context?.account){
            let vaultTokenName = getQueryString('vault') || 'USDT';
            let _token = buildToken(vaultTokenName, DefaultChain.chainId);
            _token = new VaultToken({
                name: _token.name,
                logoURI: _token.logoURI
            });
            setToken(_token);
        }
    }, [web3Context?.account]);

    const onVaultTokenChange = (vaultToken) => {
        // console.debug(`vaultToken =>`, vaultToken);

        setToken(vaultToken);
    };

    return (
        <div className={'f_c_l w_100 trade_sections f_r_main_section'}>
            <div className={'f_c_l w_100'}>
                <div className={'e_h2 title_box'}>{`Funding rate vault`}</div>
            </div>

            <HowItWorks/>

            <div className={'f_r_b_w w_100 m_t_20'}>
                <FundingRateStats/>
                <FundingRateForm/>
            </div>

            <div className={'f_r_b_w w_100 m_t_20'}>
                <ProfitCalculator/>
                <YourStats/>
            </div>
        </div>
    );
};

export default FundingRateMain;
