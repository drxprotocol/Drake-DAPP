import React, {useContext, useEffect, useMemo, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {
    Amount,
    RATIO_SHOW_DECIMALS,
    STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS,
    TokenAmount
} from "../../../../../utils/TokenAmountConverter";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useContractCalls} from "../../../../../components/ContractHooks";
import BigNumber from "bignumber.js";
import {useIntl} from "../../../../../components/i18n";

const MyStakingMetrics = ({token, totalLockedAmount, totalRewardsAmount, onAvailableAmountChange}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [availableAmount, setAvailableAmount] = useState(new TokenAmount(0));
    const [totalUnlockedAmount, setTotalUnlockedAmount] = useState(new TokenAmount(0));
    const [totalAmount, setTotalAmount] = useState(new TokenAmount(0));

    const [lockedAmount, setLockedAmount] = useState(new TokenAmount(0));
    const [totalUnclaimedRewards, setTotalUnclaimedRewards] = useState(new TokenAmount(0));
    useEffect(() => {
        setLockedAmount(totalLockedAmount);
        setTotalUnclaimedRewards(totalRewardsAmount);
    }, [totalLockedAmount, totalRewardsAmount]);
    useEffect(() => {
        if(!web3Context?.account){
            setLockedAmount(new TokenAmount(0));
            setTotalUnclaimedRewards(new TokenAmount(0));
        }
    }, [web3Context?.account]);


    const getMetricsCalls = useMemo(() => {
        let calls = [
            {
                contract: web3Context.account && token?.address && token?.vault?.theAddress && token?.vault,
                callMethod: 'availableBalanceOf',
                args: [web3Context.account]
            },
            {
                contract: web3Context.account && token?.address && token?.vault?.theAddress && token?.vault,
                callMethod: 'balanceOf',
                args: [web3Context.account]
            },
        ];
        return calls;
    }, [token, web3Context.account]) ?? [];
    const getMetricsResult = useContractCalls(getMetricsCalls) ?? [];

    useEffect(() => {
        if(getMetricsResult.length && getMetricsResult[0].length){
            let _availableAmount = new TokenAmount(getMetricsResult[0][0], token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setAvailableAmount(_availableAmount);
            onAvailableAmountChange && onAvailableAmountChange(_availableAmount);
            // console.debug(`_availableAmount =>`, _availableAmount);

            let _totalAmount = new TokenAmount(getMetricsResult[1][0], token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setTotalUnlockedAmount(_totalAmount);
            // console.debug(`_totalAmount =>`, _totalAmount);
        } else {
            let _availableAmount = new TokenAmount(0, token);
            setAvailableAmount(_availableAmount);
            onAvailableAmountChange && onAvailableAmountChange(_availableAmount);

            let _totalAmount = new TokenAmount(0, token);
            setTotalUnlockedAmount(_totalAmount);
        }
    }, [getMetricsResult]);

    useEffect(() => {
        let total = totalUnlockedAmount.amountOnChain.bigNumber.plus(totalLockedAmount.amountOnChain.bigNumber);
        let amount = new TokenAmount(total, token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
        setTotalAmount(amount);
    }, [totalUnlockedAmount, totalLockedAmount]);

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
                <div className="c_text">{intl.get(`page.earn.vault.staking.metrics.locked`)}</div>

                <div className="c_hl">
                    <span className={`b`}>{lockedAmount.amount.formativeValue}</span>
                    <span className={`c_mark m_l_3`}>{token?.dTokenName}</span>
                </div>
            </div>
            <div className="f_c_l m_s_m_item">
                <div className="c_text">{intl.get(`page.earn.vault.staking.metrics.total`)}</div>

                <div className="c_hl">
                    <span className={`b`}>{totalAmount.amount.formativeValue}</span>
                    <span className={`c_mark m_l_3`}>{token?.dTokenName}</span>
                </div>
            </div>
            <div className="f_c_l m_s_m_item">
                <div className="c_text">{intl.get(`page.earn.vault.staking.metrics.rewards`)}</div>
                <div className="f_r_l b c_hl">
                    <span className={`i_icon_24 ${token?.priceIcon}`}></span>
                    <span>{totalUnclaimedRewards.amount.formativeValue}</span>
                </div>
            </div>
        </div>
    );
};

export default MyStakingMetrics;
