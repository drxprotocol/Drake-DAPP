import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import StakingTable from "./StakingTable";
import RedeemTable from "./RedeemTable";
import MyStakingMetrics from "./MyStakingMetrics";
import {TokenAmount} from "../../../../../utils/TokenAmountConverter";
import RequestToRedeemDialog from "../../../../../components/Modals/RequestToRedeemDialog";
import {useIntl} from "../../../../../components/i18n";
import VaultAssetHistoryTable from "./VaultAssetHistoryTable";

const TabContentRender = ({tab, token, totalAvailableAmount, onTotalLockedAmountChange, onTotalRewardsAmountChange}) => {
    switch (tab) {
        case 'Staking':
            return <StakingTable token={token} onTotalLockedAmountChange={onTotalLockedAmountChange} onTotalRewardsAmountChange={onTotalRewardsAmountChange}/>;
        case 'Redeem':
            return <RedeemTable token={token} totalAvailableAmount={totalAvailableAmount}/>;
        case 'AssetHistory':
            return <VaultAssetHistoryTable token={token} />;
    }
};

const MyStakingTable = ({token, totalAvailableAmount, toTab, onTotalLockedAmountChange, onTotalRewardsAmountChange}) => {
    const intl = useIntl();
    const [tab, setTab] = useState('Staking');

    useEffect(() => {
        if(toTab){
            setTab(toTab);
        }
    }, [toTab]);

    return (
        <div className={`f_c_l_c t_section w_100 t_section_np t_portfolios staking_table`}>
            <div className={`f_r_b p_box b_box w_100 t_p_header_box`}>
                <div className={'f_r_l gap-5 cp t_p_header'}>
                    <div className={`tab_item cp ${tab === 'Staking' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('Staking')}}>{intl.get(`page.earn.vault.staking.table.title_deposit`)}</div>
                    <div className={`tab_item cp ${tab === 'Redeem' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('Redeem')}}>{intl.get(`page.earn.vault.staking.table.title_redeem`)}</div>
                    <div className={`tab_item cp ${tab === 'AssetHistory' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('AssetHistory')}}>{`Asset History`}</div>
                </div>
            </div>

            <TabContentRender tab={tab} token={token} totalAvailableAmount={totalAvailableAmount} onTotalLockedAmountChange={onTotalLockedAmountChange} onTotalRewardsAmountChange={onTotalRewardsAmountChange}/>
        </div>
    );
};

const EarnStakingList = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [availableAmount, setAvailableAmount] = useState(new TokenAmount(0));
    const [requestRedeemEnable, setRequestRedeemEnable] = useState(false);
    useEffect(() => {
        setRequestRedeemEnable(availableAmount.amountOnChain.value > 0);
    }, [availableAmount]);


    const [showRequestRedeem, setShowRequestRedeem] = useState(false);
    const [toTab, setToTab] = useState('');

    const [totalLockedAmount, setTotalLockedAmount] = useState(new TokenAmount(0));
    const [totalRewardsAmount, setTotalRewardsAmount] = useState(new TokenAmount(0));

    const onRequested = () => {
        if(toTab !== 'Redeem'){
            setToTab('Redeem');
        }
    };

    return (
        <div className={`f_c_l_c w_100 m_t_25`}>
            <div className={'f_c_l_c r_12 squircle_border t_section t_section_np trading_form staking_list_box'}>
                <div className={'f_r_b p_box w_100'}>
                    <div className={'f_r_l e_i_title b'}>
                        <div className={'f_14 b c_hl'}>{intl.get(`page.earn.vault.staking.title`)}</div>
                    </div>
                    <div className={'f_r_l request_redeem_btn_box cp'}>
                        <button className="i_btn w_100 sub_btn_primary sub_btn_long_default" disabled={!requestRedeemEnable} onClick={() => {setShowRequestRedeem(true)}}>{intl.get(`page.earn.vault.staking.request_redeem`)}</button>
                        <RequestToRedeemDialog vaultToken={token} availableAmount={availableAmount} isOpen={showRequestRedeem} onClose={()=>setShowRequestRedeem(false)} onRequestSuccessful={()=>onRequested()}/>
                    </div>
                </div>


                <MyStakingMetrics token={token} onAvailableAmountChange={setAvailableAmount} totalLockedAmount={totalLockedAmount} totalRewardsAmount={totalRewardsAmount}/>

                <MyStakingTable token={token} totalAvailableAmount={availableAmount} toTab={toTab} onTotalLockedAmountChange={setTotalLockedAmount} onTotalRewardsAmountChange={setTotalRewardsAmount}/>
            </div>
        </div>
    );
};

export default EarnStakingList;
