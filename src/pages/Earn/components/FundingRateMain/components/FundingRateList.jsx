import React, {useContext, useEffect, useMemo, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import RedeemTable from "./RedeemTable";
import {STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {useIntl} from "../../../../../components/i18n";
import VaultAssetHistoryTable from "./VaultAssetHistoryTable";
import {useContractCall, useContractCalls} from "../../../../../components/ContractHooks";
import ContractConfig from "../../../../../contract/ContractConfig";

const MyStakingMetrics = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [availableAmount, setAvailableAmount] = useState(new TokenAmount(0));
    const [frBalanceAmount, setFRBalanceAmount] = useState(new TokenAmount(0));
    const [balanceAmount, setBalanceAmount] = useState(new TokenAmount(0));

    const iTokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: token?.address,
    };
    const getAvailableBalanceCallResult = useContractCall(web3Context.account && token?.vault, 'availableBalanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getAvailableBalanceCallResult && getAvailableBalanceCallResult.length){
            setAvailableAmount(new TokenAmount(getAvailableBalanceCallResult[0], token));
        }
    }, [getAvailableBalanceCallResult]);

    const getITokenBalanceCallResult = useContractCall(web3Context.account && token?.vault, 'balanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getITokenBalanceCallResult && getITokenBalanceCallResult.length){
            setFRBalanceAmount(new TokenAmount(getITokenBalanceCallResult[0], token));
        }
    }, [getITokenBalanceCallResult]);


    const getTokenBalanceCallResult = useContractCall(web3Context.account && iTokenContract, 'balanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getTokenBalanceCallResult && getTokenBalanceCallResult.length){
            setBalanceAmount(new TokenAmount(getTokenBalanceCallResult[0], token));
        }
    }, [getTokenBalanceCallResult]);

    return (
        <div className={'f_r_b_t_w my_staking_metrics_box w_100 gap-8'}>
            <div className="f_c_l m_s_m_item">
                <div className="c_text">{intl.get(`page.earn.vault.staking.metrics.available`)}</div>
                <div className="c_hl">
                    <span className={`b`}>{availableAmount.amount.formativeValue}</span>
                    <span className={`c_mark m_l_3`}>{token?.dTokenName}</span>
                </div>
            </div>
            <div className="f_c_l m_s_m_item">
                <div className="c_text">{intl.get(`page.earn.vault.staking.metrics.total`)}</div>

                <div className="c_hl">
                    <span className={`b`}>{frBalanceAmount.amount.formativeValue}</span>
                    <span className={`c_mark m_l_3`}>{token?.dTokenName}</span>
                </div>
            </div>
            <div className="f_c_l m_s_m_item">
                <div className="c_text">{`USDC Balance`}</div>
                <div className="f_r_l b c_hl">
                    <span className={`b`}>{balanceAmount.amount.formativeValue}</span>
                    <span className={`c_mark m_l_3`}>{token?.name}</span>
                </div>
            </div>
        </div>
    );
};


const TabContentRender = ({tab, token}) => {
    switch (tab) {
        case 'Redeem':
            return <RedeemTable token={token}/>;
        case 'AssetHistory':
            return <VaultAssetHistoryTable token={token} />;
    }
};

const MyStakingTable = ({token, toTab}) => {
    const intl = useIntl();
    const [tab, setTab] = useState('AssetHistory');

    useEffect(() => {
        if(toTab){
            setTab(toTab);
        }
    }, [toTab]);

    return (
        <div className={`f_c_l_c t_section w_100 t_section_np t_portfolios staking_table`}>
            <div className={`f_r_b p_box b_box w_100 t_p_header_box`}>
                <div className={'f_r_l gap-5 cp t_p_header'}>
                    <div className={`tab_item cp ${tab === 'AssetHistory' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('AssetHistory')}}>{`Asset History`}</div>
                    <div className={`tab_item cp ${tab === 'Redeem' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('Redeem')}}>{intl.get(`page.earn.vault.staking.table.title_redeem`)}</div>
                </div>
            </div>

            <TabContentRender tab={tab} token={token} />
        </div>
    );
};

const FundingRateList = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [toTab, setToTab] = useState('');

    const onRequested = () => {
        if(toTab !== 'Redeem'){
            setToTab('Redeem');
        }
    };

    return (
        <div className={`f_c_l_c w_100 m_t_10`}>
            <div className={'f_c_l_c r_12 squircle_border t_section t_section_np trading_form staking_list_box'}>
                <div className={'f_r_b p_box w_100'}>
                    <div className={`f_r_l`}>
                        <div className={`i_icon_24 i_reports`}></div>
                        <div className={`b m_l_5 f_r_title`}>{`Your Stats`}</div>
                    </div>
                </div>


                <MyStakingMetrics token={token} />

                <MyStakingTable token={token} toTab={toTab} />
            </div>
        </div>
    );
};

export default FundingRateList;
