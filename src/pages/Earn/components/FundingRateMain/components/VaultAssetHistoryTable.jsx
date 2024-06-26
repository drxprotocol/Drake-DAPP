import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {RedeemRequestRecord, StakingRecord} from "../../../../../components/StakingStructure";
import {Amount, TokenAmount, TokenValueInUSD} from "../../../../../utils/TokenAmountConverter";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import {useVaultAssetHistoryRecords} from "../../../../../hooks/useStakeMeta";
import BigNumber from "bignumber.js";
import ApplicationConfig from "../../../../../ApplicationConfig";
import {useIntl} from "../../../../../components/i18n";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import moment from "moment";
import {buildToken} from "../../../../../hooks/useTrdingMeta";
import {AssetsHistoryData} from "../../../../../components/TradingStructure";
import {VAULT_ASSET_HISTORY_TYPE} from "../../../../../components/TradingConstant";

const mockAssetsHistory = () => {
    let assetsHistory = [];

    let contractAddress = '';
    let now = moment().unix();

    for (let i = 1; i <= 10; i++) {
        let actionType = ((i + 10) % 4) + 1;
        let actionTimeUnix = now - 1000;
        let asset = buildToken('USDT');
        let actionAmount = new TokenAmount(i * 1000, asset, true);
        let historyData = new AssetsHistoryData({
            contractAddress,
            asset,
            actionType,
            actionTimeUnix,
            actionAmount,
        });

        assetsHistory.push(historyData);
    }

    return assetsHistory;
};


const AssetHistoryForDesk = ({records}) => {
    const intl = useIntl();

    return (
        <div className={'mobile:hidden lg:block w_100'}>
            <div className={'f_c_l  w_100'}>
                <div className={'f_r_b order_table_header_item'}>
                    <div className={'order_info_item asset_h_symbol'}>{intl.get(`page.trading.trading_list.assets.symbol`)}</div>
                    <div className={'order_info_item asset_h_type'}>{`Type`}</div>
                    <div className={'order_info_item asset_h_amount'}>{`Amount`}</div>
                    <div className={'order_info_item asset_h_action_time'}>{`Action time`}</div>
                </div>

                {records.map((history, key) => {
                    return (
                        <div key={key} className={'f_r_b_t order_item staking_record_item redeem_record_item'}>
                            <div className={'f_r_l order_info_item asset_h_symbol'}>
                                <CoinIcon logo={history?.asset?.logoURI} className='coin_icon_20'/>
                                <div className={'m_l_10 f_14 b c_hl'}>{`${history?.asset?.name}`}</div>
                            </div>
                            <div className={'f_r_l order_info_item asset_h_type'}>
                                <div className={''}>{history.actionTypeTxt}</div>

                                <ConditionDisplay display={history.actionType === VAULT_ASSET_HISTORY_TYPE.deposit}>
                                    {history.lock ? <div className="i_icon_16 i_locked"></div> : <div className="i_icon_16 i_unlocked"></div>}
                                </ConditionDisplay>
                            </div>
                            <div className={'f_r_l order_info_item asset_h_amount'}>{`${history?.actionAmount?.amount.formativeValue} ${history?.actionAmount?.token?.name}`}</div>
                            <div className={'f_r_l order_info_item asset_h_action_time'}>{history.actionTimeFormat}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AssetHistoryForMobile = ({records}) => {
    const intl = useIntl();

    return (
        <div className={'lg:hidden f_c_c_c w_100'}>
            {records.map((history, key) => {
                return (
                    <div key={key} className={'f_c_l m_t_15 r_16 squircle_border order_item staking_record_item metrics_container metrics_mobile_bg_container'}>
                        <div className={'f_r_b_t_w gap-3'}>
                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{intl.get(`page.trading.trading_list.assets.symbol`)}</div>
                                    <div className={'f_r_l c_hl '}>
                                        <CoinIcon logo={history?.asset?.logoURI} className='coin_icon_20'/>
                                        <div className={'m_l_10 f_14 b c_hl'}>{`${history?.asset?.localName}`}</div>
                                    </div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Type:`}</div>

                                    <div className={'f_r_l c_hl'}>
                                        <div className={''}>{history.actionTypeTxt}</div>
                                        <ConditionDisplay display={history.actionType === VAULT_ASSET_HISTORY_TYPE.deposit}>
                                            {history.lock ? <div className="i_icon_16 i_locked"></div> : <div className="i_icon_16 i_unlocked"></div>}
                                        </ConditionDisplay>
                                    </div>
                                </div>
                            </div>

                            <div className={'f_c_l metric'}>
                                <div className={'f_r_l_t f_12'}>
                                    <div className={'c_text'}>{`Amount:`}</div>
                                    <div className={'f_r_l c_hl'}>
                                        {`${history?.actionAmount?.amount.formativeValue} ${history?.actionAmount?.token?.localName}`}
                                    </div>
                                </div>

                                <div className={'f_r_l_t f_12 m_t_10'}>
                                    <div className={'c_text'}>{`Action time:`}</div>
                                    <div className={'f_r_l c_hl b'}>{`${history.actionTimeFormat}`}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const VaultAssetHistoryTable = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const assetHistoryRecords = useVaultAssetHistoryRecords(token) ?? [];
    const [records, setRecords] = useState([]);

    useEffect(() => {
        // let _records = mockAssetsHistory();
        // console.debug(`mockAssetsHistory =>`, _records);
        // setRecords(_records);
    }, []);
    useEffect(() => {
        setRecords(assetHistoryRecords);
    }, [assetHistoryRecords.length]);
    useEffect(() => {
        if(!web3Context?.account){
            setRecords([]);
        }
    }, [web3Context?.account]);


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
                <AssetHistoryForDesk records={records} />
                <AssetHistoryForMobile records={records} />
            </ConditionDisplay>
        </div>
    );
};

export default VaultAssetHistoryTable;
