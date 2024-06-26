import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import CoinIcon from "../../Coin/CoinIcon";
import {TokenValueInUSD} from "../../../utils/TokenAmountConverter";
import {useConfiguredContractSend} from "../../ContractHooks";
import {EARN_STAKE_TYPE} from "../../TradingConstant";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";

const ClaimRewardsDialog = ({vaultToken, stakingRecord, isOpen, onClose }) => {
    const web3Context = useContext(WebThreeContext);
    const [rewards, setRewards] = useState(new TokenValueInUSD(0));

    useEffect(() => {
        let amount = new TokenValueInUSD(stakingRecord?.availableRewards?.amountOnChain.value, vaultToken, vaultToken?.currentMarketPrice?.bigNumber);
        setRewards(amount);
    }, [stakingRecord, vaultToken]);



    const { send: sendClaimRewardAndDeposit } = useConfiguredContractSend(
        vaultToken.vault,
        'claimAndRedeposit',
        'Claim Rewards and re-deposit',
        undefined,
        () => {
            onClose && onClose();
        }
    );
    const { send: sendClaimRewardAndDepositForLocked } = useConfiguredContractSend(
        vaultToken.vault,
        'claimLockedDepAndRedeposit',
        'Claim Rewards and re-deposit',
        undefined,
        () => {
            onClose && onClose();
        }
    );
    const { send: sendClaimReward } = useConfiguredContractSend(
        vaultToken.vault,
        'claimReward',
        'Claim Rewards',
        undefined,
        () => {
            onClose && onClose();
        }
    );
    const { send: sendClaimRewardInLockedDep } = useConfiguredContractSend(
        vaultToken.vault,
        'claimRewardInLockedDep',
        'Claim Rewards',
        undefined,
        () => {
            onClose && onClose();
        }
    );

    const onClaimAndRedeposit = () => {
        if(stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value){
            sendClaimRewardAndDepositForLocked(stakingRecord?.stakingId, web3Context?.account);
        } else {
            sendClaimRewardAndDeposit(web3Context?.account);
        }
    };

    const onClaim = () => {
        if(stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value){
            sendClaimRewardInLockedDep(stakingRecord?.stakingId, web3Context?.account);
        } else {
            sendClaimReward(web3Context?.account);
        }
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal claim_rewards_dialog'}
        >
            <div className={`w_100 f_c_l trade_sections`}>

                <div className={'dialog_title b'}>{`Claim Rewards`}</div>

                <div className={'f_c_c_c rewards_tips'}>
                    <div className={'f_r_l f_14'}>
                        <div className={'i_icon_24 i_gift'}></div>
                        <div className={'m_l_5'}>{`Rewards`}</div>
                    </div>
                    <div className={'f_r_l m_t_10'}>
                        <CoinIcon logo={vaultToken?.logoURI} className = 'coin_icon_24'/>
                        <div className={'m_l_8 f_24 b'}>{`${rewards.tokenAmount.amount.formativeValue} ${vaultToken?.name}`}</div>
                        <div className={'m_l_8 f_12'}>{`$${rewards.valueInUSD.formativeValue}`}</div>
                    </div>
                </div>

                <div className={'f_r_r gap-2'}>
                    <button className="i_btn sub_btn_primary sub_btn_cancel_white" onClick={() => {onClaimAndRedeposit()}}>{`Claim & Re-deposit`}</button>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" onClick={() => {onClaim()}}>{`Claim Only`}</button>
                </div>
            </div>
        </Modal>
    );
};

export default ClaimRewardsDialog;
