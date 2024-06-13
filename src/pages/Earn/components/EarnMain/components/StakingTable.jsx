import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import {
    Amount,
    COMPACT_PRICE_SHOW_DECIMALS, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../../../../../utils/TokenAmountConverter";
import {StakingRecord} from "../../../../../components/StakingStructure";
import {EARN_STAKE_TYPE} from "../../../../../components/TradingConstant";
import {useLockedStakingRecords, useUnlockedStakingRecords} from "../../../../../hooks/useStakeMeta";
import {useConfiguredContractSend} from "../../../../../components/ContractHooks";
import BigNumber from "bignumber.js";
import ClaimRewardsDialog from "../../../../../components/Modals/ClaimRewardsDialog";
import {useIntl} from "../../../../../components/i18n";

const mockStakingRecords = () => {
    let records = [];

    let staking1 = new StakingRecord({
        lockType: 0,
        stakingId: 0,
        stakingAmount: new TokenValueInUSD(0),
        depositedAmountInUSD: new TokenAmount(0),
        releaseTimeUnix: 1683252152,
        lockDuration: 0,
        availableRewards: new TokenAmount(0),
    });
    records.push(staking1);

    let staking2 = new StakingRecord({
        lockType: 1,
        stakingId: '3222',
        stakingAmount: new TokenValueInUSD(0),
        depositedAmountInUSD: new TokenAmount(0),
        releaseTimeUnix: 1683252152,
        lockDuration: 21,
        availableRewards: new TokenAmount(0),
    });

    records.push(staking2);
    return records;
};


const StakingRecordsForDesk = ({token, unlockedStakingRecords, lockedStakingRecords, onClaim, onUnlock}) => {
    const intl = useIntl();

    return (
        <div className={'mobile:hidden lg:block w_100'}>
            <div className={'f_c_l  w_100'}>
                <div className={'f_r_b order_table_header_item'}>
                    <div className={'order_info_item staking_type'}>{intl.get(`page.earn.vault.staking.table.deposit.type`)}</div>
                    <div className={'order_info_item staking_id'}>{intl.get(`page.earn.vault.staking.table.deposit.id`)}</div>
                    <div className={'order_info_item staking_amount'}>{intl.get(`page.earn.vault.staking.table.deposit.amount`)}</div>
                    <div className={'order_info_item staking_deposited'}>{intl.get(`page.earn.vault.staking.table.deposit.deposited`)}</div>
                    <div className={'order_info_item staking_release_time'}>{intl.get(`page.earn.vault.staking.table.deposit.release`)}</div>
                    <div className={'order_info_item staking_lock_duration'}>{intl.get(`page.earn.vault.staking.table.deposit.duration`)}</div>
                    <div className={'order_info_item staking_rewards'}>{intl.get(`page.earn.vault.staking.table.deposit.rewards`)}</div>
                    <div className={'order_info_item staking_operations'}>{``}</div>
                </div>

                {unlockedStakingRecords && (
                    <div className={'f_r_b_t order_item staking_record_item'}>
                        <div className={'f_c_l order_info_item staking_type'}>
                            <div className={'f_r_c tag r_6'}>
                                <div className={`i_icon_16 ${unlockedStakingRecords?.lockType === EARN_STAKE_TYPE.Lock.value ? 'i_locked' : 'i_unlocked'}`}></div>
                                <div className={'m_l_3'}>{unlockedStakingRecords.lockTypeTxt}</div>
                            </div>
                        </div>
                        <div className={'f_r_l order_info_item staking_id'}>{unlockedStakingRecords.stakingId}</div>
                        <div className={'f_r_l order_info_item staking_amount'}>
                            <span className={''}>{`${unlockedStakingRecords?.stakingAmount?.tokenAmount.amount.formativeValue}`}</span>
                            <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                            {/* <span className={'f_12 c_t'}>{`$${unlockedStakingRecords?.stakingAmount?.valueInUSD?.formativeNumber}`}</span> */}
                        </div>
                        <div className={'f_r_l order_info_item staking_deposited'}>{`--`}</div>
                        <div className={'f_r_l order_info_item staking_release_time'}>{`${unlockedStakingRecords.releaseTimeFormat}`}</div>
                        <div className={'f_r_l order_info_item staking_lock_duration'}>{`${unlockedStakingRecords.lockDuration} ${intl.get(`page.earn.vault.staking.table.deposit.duration.unit`)}`}</div>
                        <div className={'f_r_l order_info_item staking_rewards'}>
                            <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                            <span>{unlockedStakingRecords.availableRewards.amount.formativeValue}</span>
                        </div>
                        <div className={'f_r_r order_info_item staking_operations gap-5'}>
                            <ConditionDisplay display={unlockedStakingRecords?.lockType === EARN_STAKE_TYPE.Lock.value}>
                                <div className={'r_12 squircle_border f_14 b cp staking_list_btn'}>{intl.get(`page.earn.vault.staking.table.deposit.btn.unlock`)}</div>
                            </ConditionDisplay>

                            <div className={`r_12 f_14 b cp staking_list_btn ${!unlockedStakingRecords?.claimAble && 'disable'}`}  onClick={() => onClaim(unlockedStakingRecords)}>{intl.get(`page.earn.vault.staking.table.deposit.btn.claim`)}</div>
                        </div>
                    </div>
                )}

                {lockedStakingRecords.map((stakingRecord, key) => {
                    return (
                        <div key={key} className={'f_r_b_t order_item staking_record_item'}>
                            <div className={'f_c_l order_info_item staking_type'}>
                                <div className={'f_r_c tag r_6'}>
                                    <div className={`i_icon_16 ${stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value ? 'i_locked' : 'i_unlocked'}`}></div>
                                    <div className={'m_l_3'}>{stakingRecord.lockTypeTxt}</div>
                                </div>
                            </div>
                            <div className={'f_r_l order_info_item staking_id'}>{stakingRecord.stakingId}</div>

                            <div className={'f_r_l order_info_item staking_amount'}>
                                <span className={''}>{`${stakingRecord?.stakingAmount?.tokenAmount.amount.formativeValue}`}</span>
                                <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                                {/* <span className={'f_12 c_t'}>{`$${stakingRecord?.stakingAmount?.valueInUSD?.formativeNumber}`}</span> */}
                            </div>


                            {stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value ? (<div className={'f_r_l order_info_item staking_deposited'}>
                                <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                <span>{stakingRecord.depositedAmountInUSD.amount.formativeValue}</span>
                            </div>) : (<div className={'f_c_l order_info_item staking_deposited'}>{`--`}</div>)}


                            <div className={'f_r_l order_info_item staking_release_time'}>{`${stakingRecord.releaseTimeFormat}`}</div>
                            <div className={'f_r_l order_info_item staking_lock_duration'}>{`${stakingRecord.lockDuration} ${intl.get(`page.earn.vault.staking.table.deposit.duration.unit`)}`}</div>
                            <div className={'f_r_l order_info_item staking_rewards'}>
                                <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                <span>{stakingRecord.availableRewards.amount.formativeValue}</span>
                            </div>
                            <div className={'f_r_r order_info_item staking_operations gap-3'}>
                                <ConditionDisplay display={stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value}>
                                    <ConditionDisplay display={stakingRecord?.unlockAble}>
                                        <div className={`r_12 squircle_border f_14 b cp staking_list_btn`} onClick={() => onUnlock(stakingRecord)}>{intl.get(`page.earn.vault.staking.table.deposit.btn.unlock`)}</div>
                                    </ConditionDisplay>

                                    <ConditionDisplay display={!stakingRecord?.unlockAble}>
                                        <div className={`f_r_l r_12 squircle_border f_14 b cp days_left_tag`}>
                                            <div className={'i_icon_24 i_timer'}></div>
                                            <div className={'m_l_3'}>{`${stakingRecord?.leftDays} ${intl.get(`page.earn.vault.staking.table.deposit.btn.days`)}`}</div>
                                        </div>
                                    </ConditionDisplay>
                                </ConditionDisplay>

                                <div className={`r_12 f_14 b cp staking_list_btn ${!stakingRecord?.claimAble && 'disable'}`}  onClick={() => onClaim(stakingRecord)}>{intl.get(`page.earn.vault.staking.table.deposit.btn.claim`)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StakingRecordsForMobile = ({token, unlockedStakingRecords, lockedStakingRecords, onClaim, onUnlock}) => {
    return (
        <div className={'lg:hidden f_c_c_c w_100'}>
            {unlockedStakingRecords && (
                <div className={'f_c_l m_t_15 r_16 squircle_border order_item staking_record_item metrics_container metrics_mobile_bg_container'}>
                    <div className={'f_r_b_t_w gap-3'}>
                        <div className={'f_c_l metric'}>
                            <div className={'f_r_l f_12'}>
                                <div className={'c_text'}>{`Type:`}</div>
                                <div className={'f_r_c tag r_6 m_l_5'}>
                                    <div className={`i_icon_16 ${unlockedStakingRecords?.lockType === EARN_STAKE_TYPE.Lock.value ? 'i_locked' : 'i_unlocked'}`}></div>
                                    <div className={'m_l_3'}>{unlockedStakingRecords.lockTypeTxt}</div>
                                </div>
                            </div>

                            <div className={'f_r_l_t f_12 m_t_10'}>
                                <div className={'c_text'}>{`ID:`}</div>
                                <div className={'c_hl b'}>{unlockedStakingRecords.stakingId}</div>
                            </div>
                        </div>

                        <div className={'f_c_l metric'}>
                            <div className={'f_r_l_t f_12'}>
                                <div className={'c_text'}>{`Amount:`}</div>

                                <div className={'f_r_l c_hl'}>
                                    <span className={'b'}>{unlockedStakingRecords?.stakingAmount?.tokenAmount.amount.formativeValue}</span>
                                    <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                                </div>
                            </div>

                            <div className={'f_r_l_t f_12 m_t_10'}>
                                <div className={'c_text'}>{`Asset Deposited:`}</div>
                                <div className={'c_hl b'}>{`--`}</div>
                            </div>
                        </div>


                        <div className={'f_c_l metric'}>
                            <div className={'f_r_l_t f_12'}>
                                <div className={'c_text'}>{`Release Time:`}</div>
                                <div className={'f_r_l c_hl b'}>{`${unlockedStakingRecords.releaseTimeFormat}`}</div>
                            </div>

                            <div className={'f_r_l_t f_12 m_t_10'}>
                                <div className={'c_text'}>{`Lock Duration:`}</div>
                                <div className={'c_hl b'}>{`${unlockedStakingRecords.lockDuration} days`}</div>
                            </div>
                        </div>

                        <div className={'f_c_l metric'}>
                            <div className={'f_r_l_t f_12'}>
                                <div className={'c_text'}>{`Available Rewards:`}</div>
                                <div className={'f_r_l c_hl b'}>
                                    <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                    <span>{unlockedStakingRecords.availableRewards.amount.formativeValue}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={'f_r_l w_100 m_t_25'}>
                        <div className={`r_12 f_14 b cp staking_list_btn ${!unlockedStakingRecords?.claimAble && 'disable'}`}  onClick={() => onClaim(unlockedStakingRecords)}>{`Claim`}</div>
                    </div>
                </div>
            )}



            {lockedStakingRecords.map((stakingRecord, key) => {
                return (
                    <div key={key} className={'f_c_l m_t_15 r_16 squircle_border order_item staking_record_item metrics_container metrics_mobile_bg_container'}>
                        <div className={'f_r_b_t_w gap-3'}>
                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l f_12'}>
                                    <div className={'c_text'}>{`Type:`}</div>
                                    <div className={'f_r_c tag r_6 m_l_5'}>
                                        <div className={`i_icon_16 ${stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value ? 'i_locked' : 'i_unlocked'}`}></div>
                                        <div className={'m_l_3'}>{stakingRecord.lockTypeTxt}</div>
                                    </div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`ID:`}</div>
                                    <div className={'c_hl b'}>{stakingRecord.stakingId}</div>
                                </div>
                            </div>

                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`Amount:`}</div>
                                    <div className={'f_r_l c_hl'}>
                                        <span className={'b'}>{stakingRecord?.stakingAmount?.tokenAmount.amount.formativeValue}</span>
                                        <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                                    </div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Asset Deposited:`}</div>
                                    <div className={'f_r_l c_hl b'}>
                                        <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                        <span>{stakingRecord.depositedAmountInUSD.amount.formativeValue}</span>
                                    </div>
                                </div>
                            </div>


                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`Release Time:`}</div>
                                    <div className={'f_r_l c_hl b'}>{`${stakingRecord.releaseTimeFormat}`}</div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Lock Duration:`}</div>
                                    <div className={'c_hl b'}>{`${stakingRecord.lockDuration} days`}</div>
                                </div>
                            </div>

                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`Available Rewards:`}</div>
                                    <div className={'f_r_l c_hl b'}>
                                        <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                        <span>{stakingRecord.availableRewards.amount.formativeValue}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className={'f_r_l w_100 m_t_25 gap-3'}>
                            <ConditionDisplay display={stakingRecord?.lockType === EARN_STAKE_TYPE.Lock.value}>
                                <ConditionDisplay display={stakingRecord?.unlockAble}>
                                    <div className={`r_12 squircle_border f_14 b cp staking_list_btn`} onClick={() => onUnlock(stakingRecord)}>{`Unlock`}</div>
                                </ConditionDisplay>

                                <ConditionDisplay display={!stakingRecord?.unlockAble}>
                                    <div className={`f_r_l r_12 squircle_border f_14 b cp days_left_tag`}>
                                        <div className={'i_icon_24 i_timer'}></div>
                                        <div className={'m_l_3'}>{`${stakingRecord?.leftDays} remaining`}</div>
                                    </div>
                                </ConditionDisplay>
                            </ConditionDisplay>

                            <div className={`r_12 f_14 b cp staking_list_btn ${!stakingRecord?.claimAble && 'disable'}`}  onClick={() => onClaim(stakingRecord)}>{`Claim`}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const StakingTable = ({token, onTotalLockedAmountChange, onTotalRewardsAmountChange}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [totalUnclaimedRewardsForLocked, setTotalUnclaimedRewardsForLocked] = useState(new BigNumber(0));
    const [totalUnclaimedRewardsForLockedLoaded, setTotalUnclaimedRewardsForLockedLoaded] = useState(false);

    const unlockedStakingRecords = useUnlockedStakingRecords(token);
    const lockedStakingRecords = useLockedStakingRecords(token) ?? [];

    const [records, setRecords] = useState([]);
    useEffect(() => {
        // let _records = mockStakingRecords();
        // setRecords(_records);
    }, []);
    useEffect(() => {
        if(lockedStakingRecords.length){
            setRecords(lockedStakingRecords);

            let totalLocked = lockedStakingRecords.reduce((total, lockedRecord, index) => {
                return total.plus(lockedRecord.stakingAmount?.tokenAmount?.amountOnChain.bigNumber);
            }, new BigNumber(0));
            let totalLockedAmount = new TokenAmount(totalLocked, token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            onTotalLockedAmountChange && onTotalLockedAmountChange(totalLockedAmount);


            let totalRewards = lockedStakingRecords.reduce((total, lockedRecord, index) => {
                return total.plus(lockedRecord.availableRewards?.amountOnChain.bigNumber);
            }, new BigNumber(0));
            setTotalUnclaimedRewardsForLocked(totalRewards);
            setTotalUnclaimedRewardsForLockedLoaded(true);
        } else {
            setRecords([]);
            setTotalUnclaimedRewardsForLocked(new BigNumber(0));
            setTotalUnclaimedRewardsForLockedLoaded(true);

            onTotalLockedAmountChange && onTotalLockedAmountChange(new TokenAmount(0));
        }
    }, [lockedStakingRecords]);

    useEffect(() => {
        if(unlockedStakingRecords && totalUnclaimedRewardsForLockedLoaded){
            let totalRewards = totalUnclaimedRewardsForLocked.plus(unlockedStakingRecords?.availableRewards?.amountOnChain.bigNumber);
            let totalRewardsAmount = new TokenAmount(totalRewards, token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            onTotalRewardsAmountChange && onTotalRewardsAmountChange(totalRewardsAmount);
        }
    }, [totalUnclaimedRewardsForLockedLoaded, totalUnclaimedRewardsForLocked, unlockedStakingRecords]);


    const [currentStakingRecord, setCurrentStakingRecord] = useState(null);
    const [showClaimDialog, setShowClaimDialog] = useState(false);
    const onClaim = (stakingRecord) => {
        if(stakingRecord?.claimAble){
            setCurrentStakingRecord(stakingRecord);
            setShowClaimDialog(true);
        }
    };



    const onUnlockSuccessful = (unlockRecord) => {
        let _records = records.filter(record => {
            return record?.stakingId !== unlockRecord?.stakingId;
        });
        setRecords(() => _records);
    };

    const { sendAndShareData: sendUnlock } = useConfiguredContractSend(
        token.vault,
        'unlockDeposit',
        'Unlock',
        undefined,
        (events, unlockRecord) => {
            onUnlockSuccessful(unlockRecord);
        }
    );
    const onUnlock = (stakingRecord) => {
        if(!stakingRecord?.unlockAble){
            return;
        }

        let id = stakingRecord?.stakingId;
        let receiver = web3Context.account;
        console.debug(
            `Unlock: `,
            `stakingRecord =>`, stakingRecord,
            `id =>`, id,
            `receiver =>`, receiver,
        );

        sendUnlock(stakingRecord, id, receiver);
    };


    return (
        <div className={'f_c_l w_100 my_staking_table'}>
            <ConditionDisplay display={!records.length && !unlockedStakingRecords}>
                <div className={'f_c_c_c portfolio_item_empty'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_trade_empty'}></div>
                        <div className={'m_l_5'}>{intl.get(`commons.component.table.no_data`)}</div>
                        {/* <div className={'m_l_5'}>{`Coming soon...`}</div> */}
                    </div>
                </div>
            </ConditionDisplay>

            <ConditionDisplay display={records.length || unlockedStakingRecords}>
                <ClaimRewardsDialog vaultToken={token} stakingRecord={currentStakingRecord} isOpen={showClaimDialog} onClose={() => setShowClaimDialog(false)}/>

                <StakingRecordsForDesk token={token} unlockedStakingRecords={unlockedStakingRecords} lockedStakingRecords={records} onClaim={onClaim} onUnlock={onUnlock} />
                <StakingRecordsForMobile token={token} unlockedStakingRecords={unlockedStakingRecords} lockedStakingRecords={records} onClaim={onClaim} onUnlock={onUnlock} />
            </ConditionDisplay>
        </div>
    );
};

export default StakingTable;
