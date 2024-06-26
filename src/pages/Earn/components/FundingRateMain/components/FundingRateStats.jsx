import React, {useContext, useEffect, useState} from 'react';
import {useIntl} from "../../../../../components/i18n";
import {buildToken, useInstrument, useInstrumentMetrics} from "../../../../../hooks/useTrdingMeta";
import {InstrumentTokenPairSample} from "../../../../../components/InstrumentTokenPair";
import {ENABLE_INSTRUMENTS} from "../../../../../components/TradingConstant";
import {useContractCall} from "../../../../../components/ContractHooks";
import {Amount, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import BigNumber from "bignumber.js";

const FundingFeeStatsItem = ({instrumentCode}) => {
    const intl = useIntl();

    const instrument = useInstrument(instrumentCode);
    const instrumentMetrics = useInstrumentMetrics(instrument);

    return (
        <div className={`f_r_b s_item w_100`}>
            <div className={'f_r_l s_item_token'}>
                <InstrumentTokenPairSample instrument={instrument} coinClassName='coin_icon_20'/>
            </div>

            <div className={'f_r_l s_item_metric'}>
                <div className={`f_r_s_title`}>{intl.get(`page.trading.metrics.funding_fee_l`)}</div>
                <div className={`m_l_10 b c_hl ${instrumentMetrics?.fundingFeeAPRLong?.equalsZero ? '' : (instrumentMetrics?.fundingFeeAPRLong?.lessThanZero ? 'cr' : 'c_green')}`}>{`${instrumentMetrics?.fundingFeeAPRLong?.amount?.fixedFormativeValue}% / 1h`}</div>
            </div>

            <div className={'f_r_l s_item_metric'}>
                <div className={`f_r_s_title`}>{intl.get(`page.trading.metrics.funding_fee_s`)}</div>
                <div className={`m_l_10 b c_hl ${instrumentMetrics?.fundingFeeAPRShort?.equalsZero ? '' : (instrumentMetrics?.fundingFeeAPRShort?.lessThanZero ? 'cr' : 'c_green')}`}>{`${instrumentMetrics?.fundingFeeAPRShort?.amount?.fixedFormativeValue}% / 1h`}</div>
            </div>
        </div>
    );
};

const FundingFeeStats = () => {
    const intl = useIntl();

    const instrumentCodes = ENABLE_INSTRUMENTS;

    return (
        <div className={`f_c_l w_100 f_r_section_item_content`}>
            <div className={`f_c_l w_100 f_r_s_bg r_12 squircle_border funding_fee_stats`}>
                {instrumentCodes.map((record, index) => {
                    return (
                        <FundingFeeStatsItem instrumentCode={record} key={index} />
                    );
                })}
            </div>
        </div>
    );
};


const mockRiskAllocation = [
    {
        asset: buildToken('WBTC'),
        allocation: 50,
        style: {
            width: `50%`,
        }
    },
    {
        asset: buildToken('ETH'),
        allocation: 50,
        style: {
            width: `50%`,
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
                        <div className={'m_l_3'}>{`${riskAllocation[0]?.asset?.localName}`}</div>
                    </div>
                    <div className={'f_r_l f_16'}>
                        <div className={''}>{`${riskAllocation[1]?.allocation}%`}</div>
                        <div className={'m_l_3'}>{`${riskAllocation[1]?.asset?.localName}`}</div>
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

const OverviewStats = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [price, setPrice] = useState(new Amount(0));

    const getPriceCallResult = useContractCall(token?.vault, 'shareToAssetPrice', []) ?? [];
    useEffect(() => {
        if(getPriceCallResult && getPriceCallResult.length){
            // console.debug(`getPriceCallResult:`, getPriceCallResult);
            let amount = new BigNumber(getPriceCallResult[0]?._hex).div(getPriceCallResult[1]?._hex);
            let priceAmount = new Amount(amount);
            setPrice(priceAmount);
        }
    }, [getPriceCallResult]);

    return (
        <div className={`f_c_l w_100 f_r_section_item_content_nb f_overview_stats`}>
            <div className={`f_r_l`}>
                <div className={`i_icon_24 i_reports`}></div>
                <div className={`b m_l_5 f_r_title`}>{`Overview stats`}</div>
            </div>

            <div className={`f_c_l f_14 m_t_15 w_100`}>
                {/*
                <div className={`f_r_b`}>
                    <div className={`f_r_s_title`}>{`Average APR`}</div>
                    <div className={`b c_green`}>{`21%`}</div>
                    <div className={`b`}>{`--%`}</div>
                </div>
                */}

                <div className={`f_r_b`}>
                    <div className={`f_r_s_title`}>{`frUSDC Price`}</div>
                    <div className={`f_r_l`}>
                        <div className={`b`}>{`1 frUSDC`}</div>
                        <div className={`i_icon_24 i_arrow_right1`}></div>
                        <div className={`b`}>{`${price.formativeValue} USDC`}</div>
                    </div>
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
            <OverviewStats token={token}/>
        </div>
    );
};

export default FundingRateStats;
