import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {Amount, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {useIntl} from "../../../../../components/i18n";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import {buildToken} from "../../../../../hooks/useTrdingMeta";

const mockFundingFeeStats = [
    {
        asset: buildToken('ETH'),
        fundingFeeL: new Amount(0.0023),
        fundingFeeS: new Amount(0.0023),
    },
    {
        asset: buildToken('WBTC'),
        fundingFeeL: new Amount(0.0023),
        fundingFeeS: new Amount(0.0023),
    },
];

const FundingFeeStats = () => {
    const intl = useIntl();

    const [fundingFeeStats, setFundingFeeStats] = useState([]);
    useEffect(() => {
        setFundingFeeStats(mockFundingFeeStats);
    }, []);

    return (
        <div className={`f_c_l w_100 f_r_section_item_content`}>
            <div className={`f_c_l w_100 f_r_s_bg r_12 squircle_border funding_fee_stats`}>
                {fundingFeeStats.map((record, index) => {
                    return (
                        <div className={`f_r_b s_item w_100`} key={index}>
                            <div className={'f_r_l s_item_token'}>
                                <CoinIcon logo={record?.asset?.logoURI} className='coin_icon_20'/>
                                <div className={'m_l_10 f_14 b c_hl'}>{`${record?.asset?.name}`}</div>
                            </div>

                            <div className={'f_r_l s_item_metric'}>
                                <div className={`f_r_s_title`}>{`Funding Fee(L)`}</div>
                                <div className={`m_l_10 b`}>{`${record?.fundingFeeL?.formativeValue}%/1h`}</div>
                            </div>

                            <div className={'f_r_l s_item_metric'}>
                                <div className={`f_r_s_title`}>{`Funding Fee(S)`}</div>
                                <div className={`m_l_10 b`}>{`${record?.fundingFeeS?.formativeValue}%/1h`}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const mockRiskAllocation = [
    {
        asset: buildToken('ETH'),
        allocation: 40,
        style: {
            width: `40%`,
        }
    },
    {
        asset: buildToken('WBTC'),
        allocation: 60,
        style: {
            width: `60%`,
        }
    },
];

const CurrentRiskAllocation = () => {
    const intl = useIntl();

    const [riskAllocation, setRiskAllocation] = useState([]);
    useEffect(() => {
        setRiskAllocation(mockRiskAllocation);
    }, []);

    return (
        <div className={`f_c_l w_100 f_r_section_item_content f_risk_allocation`}>
            <div className={`f_r_l`}>
                <div className={`i_icon_24 i_task`}></div>
                <div className={`b m_l_5 f_r_title`}>{`Current risk allocation`}</div>
            </div>

            <div className={`f_c_l m_t_15 w_100`}>
                <div className={`f_r_b`}>
                    <div className={'f_r_l f_16'}>
                        <div className={''}>{`${riskAllocation[0]?.allocation}%`}</div>
                        <div className={'m_l_3'}>{`${riskAllocation[0]?.asset?.name}`}</div>
                    </div>
                    <div className={'f_r_l f_16'}>
                        <div className={''}>{`${riskAllocation[1]?.allocation}%`}</div>
                        <div className={'m_l_3'}>{`${riskAllocation[1]?.asset?.name}`}</div>
                    </div>
                </div>

                <div className={`f_r_l allocation_box m_t_5`}>
                    <div className={'a_item a_left'} style={riskAllocation[0]?.style}></div>
                    <div className={'a_item a_right'} style={riskAllocation[1]?.style}></div>
                </div>
            </div>
        </div>
    );
};

const OverviewStats = () => {
    const intl = useIntl();

    return (
        <div className={`f_c_l w_100 f_r_section_item_content_nb f_overview_stats`}>
            <div className={`f_r_l`}>
                <div className={`i_icon_24 i_reports`}></div>
                <div className={`b m_l_5 f_r_title`}>{`Overview stats`}</div>
            </div>

            <div className={`f_c_l f_14 m_t_15 w_100`}>
                <div className={`f_r_b`}>
                    <div className={`f_r_s_title`}>{`Average APR`}</div>
                    <div className={`b c_green`}>{`21%`}</div>
                </div>

                <div className={`f_r_b m_t_15`}>
                    <div className={`f_r_s_title`}>{`iUSDC Rate :  1 iUSDC`}</div>
                    <div className={`i_icon_24 i_arrow_right1`}></div>
                    <div className={`b`}>{`1.1 USDC`}</div>
                </div>
            </div>
        </div>
    );
};

const FundingRateStats = ({token}) => {
    const intl = useIntl();

    return (
        <div className={`f_c_l r_12 squircle_border f_r_section_item f_r_section_item_l`}>
            <FundingFeeStats/>
            <CurrentRiskAllocation/>
            <OverviewStats/>
        </div>
    );
};

export default FundingRateStats;
