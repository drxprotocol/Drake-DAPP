import './index.scss';

import React, {useContext, useState, useEffect} from 'react';
import EarnForm from "./components/EarnForm";
import WebThreeContext from "../../../../components/WebThreeProvider/WebThreeContext";
import EarnMetrics from "./components/EarnMetrics";
import EarnStakingList from "./components/EarnStakingList";
import {VaultToken} from "../../../../components/StakingStructure";
import {buildToken} from "../../../../hooks/useTrdingMeta";
import {DefaultChain} from "../../../../contract/ChainConfig";
import {getQueryString} from "../../../../utils/URLUtil";
import {useIntl} from "../../../../components/i18n";

const EarnMain = () => {
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
        <div className={'f_c_l w_100 trade_sections e_main_section'}>
            <div className={'f_c_l_c w_100'}>
                <div className={'e_h2 title_box'}>{intl.get(`page.earn.vault.title`)}</div>
            </div>

            <div className={'f_c_l_c w_100 m_t_25'}>
                <div className={'f_r_b_t_w w_100 gap-5'}>
                    <EarnForm token={token} />

                    <EarnMetrics token={token} onVaultTokenChange={onVaultTokenChange}/>
                </div>
            </div>

            <EarnStakingList token={token}/>
        </div>
    );
};

export default EarnMain;
