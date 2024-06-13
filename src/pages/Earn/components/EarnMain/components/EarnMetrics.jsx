import React, {useContext, useEffect, useMemo, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import {useEnableStakeTokens} from "../../../../../hooks/useStakeMeta";
import { Dropdown } from 'antd';
import {getQueryString} from "../../../../../utils/URLUtil";
import {
    Amount,
    RATIO_SHOW_DECIMALS,
    STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../../../../../utils/TokenAmountConverter";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useContractCall, useContractCalls} from "../../../../../components/ContractHooks";
import BigNumber from "bignumber.js";
import PageInfoContext from "../../../../../components/PageInfoProvider/PageInfoContext";
import {STAKE_VAULT_ASSETS_NAV_KEY} from "../../../../../components/TradingConstant";
import { useNavigate } from 'react-router-dom';
import {useIntl} from "../../../../../components/i18n";

const buildVaultItems = (tokens, selectedVault, onVaultSelected) => {
    const intl = useIntl();

    return tokens.map((token) => {
        return {
            label: (
                <div className={`cp r_12 t_selector_item ${token?.address === selectedVault.address && 'active'}`} onClick={() => {onVaultSelected && onVaultSelected(token)}}>{`${token.name} ${intl.get(`page.earn.vault.metrics.vault`)}`}</div>
            ),
            key: token?.address,
        };
    });
};

const VaultSelector = ({token, onVaultTokenChange}) => {
    const intl = useIntl();

    const web3Context = useContext(WebThreeContext);
    const pageInfoContext = useContext(PageInfoContext);
    const navigate = useNavigate();

    const [selectedVault, setSelectedVault] = useState(null);
    const onVaultSelected = (token, forward) => {
        setSelectedVault(token);
        onVaultTokenChange(token);

        if(forward){
            setTimeout(() => {
                console.debug(`forward to earn page...`);
                navigate(`/earn?vault=${token.name}`);
            },100);
        }

        let navKey = STAKE_VAULT_ASSETS_NAV_KEY[token.name];
        let _pageInfoContext = {
            ...pageInfoContext?.pageInfo,
            leftNav: navKey,
        };
        setTimeout(() => {
            pageInfoContext.dispatch(_pageInfoContext);
        },300);
    };
    const onVaultChange = (token) => {
        onVaultSelected(token, true);
    };

    const vaultTokens = useEnableStakeTokens() ?? [];
    const items = buildVaultItems(vaultTokens, token, onVaultChange);


    useEffect(() => {
        if(vaultTokens.length && (!selectedVault || pageInfoContext?.pageInfo?.leftNav)){
            let vaultToken = getQueryString('vault') || 'USDT';
            let filter = vaultTokens.filter(vault => {
                return vault.name === vaultToken;
            });

            let _token = filter.length ? filter[0] : vaultTokens[0];
            onVaultSelected(_token);
        }
    }, [web3Context?.chainId, vaultTokens, pageInfoContext?.pageInfo?.leftNav]);

    return (
        <Dropdown
            menu={{
                items,
            }}
            overlayClassName={'overlay_container portfolio_type_selector_popup'}
            placement="bottomRight"
        >
            <div className={'f_r_l r_8 squircle_border vault_selector_box'}>
                <div className={'f_r_l'}>
                    <div className={'f_12 c_hl cp'}>{`${token.name} ${intl.get(`page.earn.vault.metrics.vault`)}`}</div>
                    <div className={'i_icon_24 i_arrow_down_g cp m_l_5'}></div>
                </div>
            </div>
        </Dropdown>
    );
};

const EarnMetrics = ({token, onVaultTokenChange}) => {
    const intl = useIntl();

    const [vaultTVL, setVaultTVL] = useState(new TokenValueInUSD(0));
    const tokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: token?.address,
    };
    const getAssetBalanceCallResult = useContractCall(token?.address && token?.vault?.theAddress && tokenContract, 'balanceOf', [token?.vault?.theAddress]) ?? [];
    useEffect(() => {
        if(getAssetBalanceCallResult && getAssetBalanceCallResult.length){
            let tvl = new TokenValueInUSD(getAssetBalanceCallResult[0], token, token?.currentMarketPrice?.value, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setVaultTVL(tvl);
            // console.debug(
            //     `vaultTVL =>`, tvl,
            //     `getAssetBalanceCallResult =>`, getAssetBalanceCallResult,
            // );
        }
    }, [getAssetBalanceCallResult]);



    const [settledPnL, setSettledPnL] = useState(new TokenAmount(0));
    const [unsettledPnL, setUnsettledPnL] = useState(new TokenAmount(0));
    const [rewards, setRewards] = useState(new TokenAmount(0));
    const [dUSDTRate, setDUSDTRate] = useState(new Amount(0));

    const getMetricsCalls = useMemo(() => {
        let calls = [
            {
                contract: token?.address && token?.vault?.theAddress && ContractConfig.TradingMeta.OIAndPnLManager,
                callMethod: 'settledPnLByAsset',
                args: [token?.address]
            },
            {
                contract: token?.address && token?.vault?.theAddress && ContractConfig.TradingMeta.OIAndPnLManager,
                callMethod: 'getUnsettledPnLBySettleCcy',
                args: [token?.address]
            },
            {
                contract: token?.address && token?.vault?.theAddress && ContractConfig.TradingMeta.CMPLiabilityManager,
                callMethod: 'totalLiabilityAmt',
                args: [token?.address]
            },
            {
                contract: token?.address && token?.vault?.theAddress && token?.vault,
                callMethod: 'totalRwdDistributed',
                args: []
            },
            {
                contract: token?.address && token?.vault?.theAddress && token?.vault,
                callMethod: 'shareToAssetPrice',
                args: []
            },
        ];
        return calls;
    }, [token]) ?? [];
    const getMetricsResult = useContractCalls(getMetricsCalls) ?? [];

    useEffect(() => {
        // console.debug(
        //     `getMetricsCalls =>`, getMetricsCalls,
        //     `getMetricsResult =>`, getMetricsResult,
        // );

        if(getMetricsResult.length && getMetricsResult[0].length){
            let pnl = new TokenAmount(getMetricsResult[0][0], token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setSettledPnL(pnl);
            // console.debug(
            //     `settledPnL =>`, pnl,
            //     `getMetricsResult =>`, getMetricsResult,
            // );


            let getUnsettledPnLBySettleCcy = new Amount(getMetricsResult[1][0]);
            let outstandingLiability = new Amount(getMetricsResult[2][0]);
            let unsettledPnL = new TokenAmount(outstandingLiability.bigNumber.minus(getUnsettledPnLBySettleCcy.bigNumber), token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setUnsettledPnL(unsettledPnL);
            // console.debug(
            //     `getMetricsCalls =>`, getMetricsCalls,
            //     `getMetricsResult =>`, getMetricsResult,
            //     `outstandingLiability =>`, outstandingLiability,
            //     `getUnsettledPnLBySettleCcy =>`, getUnsettledPnLBySettleCcy,
            //     `unsettledPnL =>`, unsettledPnL,
            // );


            let totalRwdDistributed = new TokenAmount(getMetricsResult[3][0], token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
            setRewards(totalRwdDistributed);
            // console.debug(`rewards =>`, totalRwdDistributed);


            let dUSDTPrice = new BigNumber(getMetricsResult[4][0]._hex);
            let dUSDTPricePrecision = new BigNumber(getMetricsResult[4][1]._hex);
            let rate = dUSDTPricePrecision ? dUSDTPrice.times(100).div(dUSDTPricePrecision) : 0;
            let _dUSDTRate = new Amount(rate, RATIO_SHOW_DECIMALS);
            setDUSDTRate(_dUSDTRate);
        }
    }, [getMetricsResult]);


    return (
        <div className={`f_c_l_c e_main_item`}>
            <div className={'f_c_l_c r_12 squircle_border t_section t_section_np trading_form_section trading_form e_main_item_content e_main_item_content_metrics'}>
                <div className={'f_r_b p_box w_100'}>
                    <div className={'f_r_l e_i_title b'}>
                        <CoinIcon logo={token?.logoURI} className = 'coin_icon_24'/>
                        <div className={'m_l_10 f_14 b c_hl'}>{`${token?.name} ${intl.get(`page.earn.vault.metrics.vault`)}`}</div>
                    </div>
                    <div className={'f_r_l cp'}>
                        <VaultSelector token={token} onVaultTokenChange={onVaultTokenChange}/>
                    </div>
                </div>


                <div className={'f_c_l p_box w_100 m_t_15 gap-4'}>
                    <div className="f_r_b">
                        <div className="f_14 c_text">{`${intl.get(`page.earn.vault.metrics.tvl`)}:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span className={`i_icon_16 i_price_icon ${token?.priceIcon}`}></span>
                            <span>{vaultTVL.tokenAmount.amount.formativeValue}</span>
                        </div>
                    </div>

                    <div className="f_r_b">
                        <div className="f_14 c_text">{`${intl.get(`page.earn.vault.metrics.settled_pnl`)}:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span className={`i_icon_16 i_price_icon ${token?.priceIcon}`}></span>
                            <span>{settledPnL.amount.formativeValue}</span>
                        </div>
                    </div>

                    <div className="f_r_b">
                        <div className="f_14 c_text">{`${intl.get(`page.earn.vault.metrics.unsettled_pnl`)}:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span className={`i_icon_16 i_price_icon ${token?.priceIcon}`}></span>
                            <span>{unsettledPnL.amount.formativeValue}</span>
                        </div>
                    </div>

                    <div className="f_r_b">
                        <div className="f_14 c_text">{`${intl.get(`page.earn.vault.metrics.rewards`)}:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span className={`i_icon_16 i_price_icon ${token?.priceIcon}`}></span>
                            <span>{rewards.amount.formativeValue}</span>
                        </div>
                    </div>

                    <div className="f_r_b">
                        <div className="f_14 c_text">{`${intl.get(`page.earn.vault.metrics.apr`)}:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span>{`Coming soon`}</span>
                        </div>
                    </div>

                    <div className="f_r_b">
                        <div className="f_14 c_text">{`Current ${token?.dTokenName}/${token?.name} rate:`}</div>
                        <div className="f_r_l f_14 c_hl m_l_10">
                            <span>{`${dUSDTRate.formativeValue}%`}</span>
                        </div>
                    </div>
                </div>

                <div className={'f_c_l p_box w_100 m_t_15 m_b_4'}>
                    <a href={'#'} className={'c_link f_14'}>{intl.get(`commons.component.link.learn_more`)}</a>
                </div>
            </div>
        </div>
    );
};

export default EarnMetrics;
