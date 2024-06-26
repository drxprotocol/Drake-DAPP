import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {RedeemRequestRecord, StakingRecord} from "../../../../../components/StakingStructure";
import {Amount, TokenAmount, TokenValueInUSD} from "../../../../../utils/TokenAmountConverter";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import {useRedeemRequestRecords} from "../../../../../hooks/useStakeMeta";
import {useApprove, useConfiguredContractSend} from "../../../../../components/ContractHooks";
import BigNumber from "bignumber.js";
import ApplicationConfig from "../../../../../ApplicationConfig";
import {useIntl} from "../../../../../components/i18n";

const mockRedeemRequestRecords = () => {
    let records = [];

    let staking1 = new RedeemRequestRecord({
        stakingId: '3221',
        stakingAmount: new TokenValueInUSD(0),
        releaseTimeUnix: 1683252152,
    });
    records.push(staking1);

    let staking2 = new RedeemRequestRecord({
        stakingId: '3222',
        stakingAmount: new TokenValueInUSD(0),
        releaseTimeUnix: 1683252152,
    });

    records.push(staking2);
    return records;
};


const RedeemRecordsForDesk = ({token, redeemRecords, onRedeem}) => {
    const intl = useIntl();

    return (
        <div className={'mobile:hidden lg:block w_100'}>
            <div className={'f_c_l  w_100'}>
                <div className={'f_r_b order_table_header_item'}>
                    <div className={'order_info_item staking_id'}>{intl.get(`page.earn.vault.staking.table.redeem.id`)}</div>
                    <div className={'order_info_item staking_amount'}>{intl.get(`page.earn.vault.staking.table.redeem.amount`)}</div>
                    <div className={'order_info_item redeem_amount'}>{intl.get(`page.earn.vault.staking.table.redeem.redeem_amount`)}</div>
                    <div className={'order_info_item staking_release_time'}>{intl.get(`page.earn.vault.staking.table.redeem.release`)}</div>
                    <div className={'order_info_item redeem_request_operations'}>{``}</div>
                </div>

                {redeemRecords.map((stakingRecord, key) => {
                    return (
                        <div key={key} className={'f_r_b_t order_item staking_record_item redeem_record_item'}>
                            <div className={'f_r_l order_info_item staking_id'}>{stakingRecord.stakingId}</div>
                            <div className={'f_r_l order_info_item staking_amount'}>
                                <span className={''}>{`${stakingRecord?.stakingAmount?.tokenAmount.amount.formativeValue}`}</span>
                                <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                                {/* <span className={'f_12 c_t'}>{`$${stakingRecord?.stakingAmount?.valueInUSD?.formativeNumber}`}</span> */}
                            </div>
                            <div className={'f_r_l order_info_item redeem_amount'}>
                                <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                <span className={''}>{`${stakingRecord?.expectedAssetAmount?.tokenAmount.amount.formativeValue}`}</span>
                                {/* <span className={'f_12 c_t'}>{`$${stakingRecord?.stakingAmount?.valueInUSD?.formativeNumber}`}</span> */}
                            </div>
                            <div className={'f_r_l order_info_item staking_release_time'}>{`${stakingRecord.releaseTimeFormat}`}</div>
                            <div className={'f_r_r order_info_item redeem_request_operations gap-5'}>
                                <div className={`r_12 f_14 b cp staking_list_btn ${!stakingRecord?.redeemAble && 'disable'}`} onClick={() => onRedeem(stakingRecord)}>{intl.get(`page.earn.vault.staking.table.redeem.btn.redeem`)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RedeemRecordsForMobile = ({token, redeemRecords, onRedeem}) => {
    return (
        <div className={'lg:hidden f_c_c_c w_100'}>
            {redeemRecords.map((stakingRecord, key) => {
                return (
                    <div key={key} className={'f_c_l m_t_15 r_16 squircle_border order_item staking_record_item metrics_container metrics_mobile_bg_container'}>
                        <div className={'f_r_b_t_w gap-3'}>
                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`ID:`}</div>
                                    <div className={'c_hl b'}>{stakingRecord.stakingId}</div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Amount:`}</div>

                                    <div className={'f_r_l c_hl'}>
                                        <span className={'b'}>{stakingRecord?.stakingAmount?.tokenAmount.amount.formativeValue}</span>
                                        <span className={'c_mark m_l_3'}>{token?.dTokenName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`Expected Asset Amount:`}</div>
                                    <div className={'f_r_l c_hl b'}>
                                        <span className={`i_icon_16 ${token?.priceIcon}`}></span>
                                        <span className={''}>{`${stakingRecord?.expectedAssetAmount?.tokenAmount.amount.formativeValue}`}</span>
                                    </div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Release Time:`}</div>
                                    <div className={'f_r_l c_hl b'}>{`${stakingRecord.releaseTimeFormat}`}</div>
                                </div>
                            </div>
                        </div>

                        <div className={'f_r_l w_100 m_t_25 gap-3'}>
                            <div className={`r_12 f_14 b cp staking_list_btn ${!stakingRecord?.redeemAble && 'disable'}`} onClick={() => onRedeem(stakingRecord)}>{`Redeem`}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const RedeemTable = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const redeemRequestRecords = useRedeemRequestRecords(token) ?? [];
    const [records, setRecords] = useState([]);

    useEffect(() => {
        // let _records = mockRedeemRequestRecords();
        // setRecords(_records);
    }, []);
    useEffect(() => {
        setRecords(redeemRequestRecords);
    }, [redeemRequestRecords.length]);
    useEffect(() => {
        if(!web3Context?.account){
            setRecords([]);
        }
    }, [web3Context?.account]);


    const { send: sendRedeem } = useConfiguredContractSend(
        token.vault,
        'redeem',
        'Redeem'
    );
    const doRedeem = (redeemRecord) => {
        let id = redeemRecord?.stakingId;
        let receiver = web3Context.account;
        console.debug(
            `Redeem: `,
            `redeemRecord =>`, redeemRecord,
            `id =>`, id,
            `receiver =>`, receiver,
        );

        sendRedeem(id, receiver);
    };
    const onRedeem = (redeemRecord) => {
        if(!redeemRecord?.redeemAble){
            return;
        }

        doRedeem(redeemRecord);
    };


    return (
        <div className={'f_c_l w_100 my_redeem_table'}>
            <ConditionDisplay display={!records.length}>
                <div className={'f_c_c_c portfolio_item_empty'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_trade_empty'}></div>
                        <div className={'m_l_5'}>{intl.get(`commons.component.table.no_data`)}</div>
                        {/* <div className={'m_l_5'}>{`Coming soon...`}</div> */}
                    </div>
                </div>
            </ConditionDisplay>

            <ConditionDisplay display={records.length}>
                <RedeemRecordsForDesk token={token} redeemRecords={records} onRedeem={onRedeem} />
                <RedeemRecordsForMobile token={token} redeemRecords={records} onRedeem={onRedeem} />
            </ConditionDisplay>
        </div>
    );
};

export default RedeemTable;
