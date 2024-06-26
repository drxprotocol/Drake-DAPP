import React, { useContext, useEffect, useState, useMemo } from 'react';
import WebThreeContext from "../components/WebThreeProvider/WebThreeContext";
import {DefaultChain} from "../contract/ChainConfig";
import {buildToken} from "./useTrdingMeta";
import {EARN_STAKE_TYPE, STAKE_VAULT_ASSETS, VAULT_ASSET_HISTORY_TYPE} from "../components/TradingConstant";
import {RedeemRequestRecord, StakingRecord, VaultToken} from "../components/StakingStructure";
import {useTokenPricesFromOracle} from "../components/TokenPrice";
import {useContractCall, useContractCalls} from "../components/ContractHooks";
import {
    Amount,
    RATIO_SHOW_DECIMALS,
    STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS,
    TokenAmount,
    TokenValueInUSD
} from "../utils/TokenAmountConverter";
import {myMoment} from "../utils/DateUtil";
import {RatioToShow} from "../contract/TokenContract";
import ContractConfig from "../contract/ContractConfig";
import Axios from "axios";
import {AssetsHistoryData} from "../components/TradingStructure";

export const useEnableStakeTokens = () => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId || DefaultChain.chainId;

    const [vaultTokens, setVaultTokens] = useState([]);

    const tokens = useMemo(() => {
        return STAKE_VAULT_ASSETS.map((tokenName) => {
            let token = buildToken(tokenName, chainId);
            token = new VaultToken(token);
            return token;
        }) ?? [];
    }, [chainId]) ?? [];
    const {loaded: tokenPricesLoaded, priceMap: tokenPriceMap} = useTokenPricesFromOracle(tokens);

    useEffect(() => {
        // console.debug(`tokens =>`, tokens, `tokenPricesLoaded =>`, tokenPricesLoaded);

        if(tokens.length && tokenPricesLoaded) {
            let _tokens = tokens.map(token => {
                let price = tokenPriceMap[token.name];
                token.updateCurrentPrice(price);
                return token;
            });

            setVaultTokens(_tokens);
        }
    }, [tokens, tokenPricesLoaded, tokenPriceMap]);

    useEffect(() => {
        if(!web3Context?.account && tokens.length && !tokenPricesLoaded) {
            let _tokens = tokens.map(token => {
                let price = new Amount(0);
                token.updateCurrentPrice(price);
                return token;
            });

            setVaultTokens(_tokens);
        }
    }, [web3Context?.account]);

    return vaultTokens;
};

export const useUnlockedStakingRecords = (vaultToken) => {
    const web3Context = useContext(WebThreeContext);

    const [stakingRecord, setStakingRecord] = useState(null);

    const getMetricsCalls = useMemo(() => {
        let calls = [
            {
                contract: web3Context.account && vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'balanceOf',
                args: [web3Context.account]
            },
            {
                contract: web3Context.account && vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'getClaimableRewardAmt',
                args: [web3Context.account]
            },
        ];
        return calls;
    }, [vaultToken, web3Context.account]) ?? [];
    const getMetricsResult = useContractCalls(getMetricsCalls) ?? [];

    useEffect(() => {
        // console.debug(`getMetricsResult =>`, getMetricsResult);

        if(getMetricsResult.length && getMetricsResult[0].length){
            if(getMetricsResult[0][0] && getMetricsResult[0][0]?._hex !== '0x00'){
                let stakingAmount = new TokenValueInUSD(getMetricsResult[0][0], vaultToken, vaultToken?.currentMarketPrice.bigNumber, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
                // console.debug(`stakingAmount =>`, stakingAmount);

                let rewards = new TokenAmount(getMetricsResult[1][0], vaultToken, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
                // console.debug(`rewards =>`, rewards);

                let staking = new StakingRecord({
                    stakingAmount: stakingAmount,
                    availableRewards: rewards,
                });

                setStakingRecord(staking);
            } else {
                setStakingRecord(null);
            }
        } else {
            setStakingRecord(null);
        }
    }, [getMetricsResult]);

    return stakingRecord;
};

const buildLockedStakingRecord = (lockedTokenResponse, vaultToken, rewardsResponse) => {
    let lockType = EARN_STAKE_TYPE.Lock.value;
    let stakingId = parseInt(lockedTokenResponse[0], 10);
    let stakingAmount = new TokenValueInUSD(lockedTokenResponse?.shareAmt, vaultToken, vaultToken?.currentMarketPrice.bigNumber, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
    let depositedAmountInUSD = new TokenAmount(lockedTokenResponse?.assetDepAmt, vaultToken, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);

    let lockDurationSeconds = parseInt(lockedTokenResponse[5], 10);
    let releaseTimeUnix = parseInt(lockedTokenResponse[6], 10);

    let availableRewards = new TokenAmount(rewardsResponse[0], vaultToken, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);

    let stakingRecord = new StakingRecord({
        lockType,
        stakingId,
        stakingAmount,
        depositedAmountInUSD,
        releaseTimeUnix,
        lockDurationSeconds,
        availableRewards,
    });

    // console.debug(
    //     `buildLockedStakingRecord:`,
    //     `lockedTokenResponse =>`, lockedTokenResponse,
    //     `vaultToken =>`, vaultToken,
    //     `rewardsResponse =>`, rewardsResponse,
    //     `stakingRecord =>`, stakingRecord,
    // );

    return stakingRecord;
};

export const useLockedStakingRecords = (vaultToken) => {
    const web3Context = useContext(WebThreeContext);

    const [records, setRecords] = useState([]);




    const [lockedTokenIds, setLockedTokenIds] = useState([]);

    const getTotalTokensCalls =
        useMemo(() => {
            if (web3Context.account && vaultToken?.address && vaultToken?.nftManager?.theAddress) {
                let calls = [{
                    contract: vaultToken?.nftManager,
                    callMethod: 'balanceOf',
                    args: [web3Context.account],
                }];
                return calls;
            }
            return [];
        }, [vaultToken, web3Context.account]) ?? [];
    const getTotalTokensCallResult = useContractCalls(getTotalTokensCalls) ?? [];
    const totalTokens =
        useMemo(() => {
            if (getTotalTokensCallResult.length && getTotalTokensCallResult[0].length) {
                return getTotalTokensCallResult[0][0].toNumber();
            }
            return 0;
        }, [getTotalTokensCallResult]) ?? 0;

    const getTokenIdsCalls =
        useMemo(() => {
            if (totalTokens > 0) {
                let calls = [];
                for (let i = 0; i < totalTokens; i++) {
                    calls.push({
                        contract: web3Context.account && vaultToken?.nftManager,
                        callMethod: 'tokenOfOwnerByIndex',
                        args: [web3Context.account, i],
                    });
                }
                return calls;
            }
            return [];
        }, [totalTokens, web3Context.account]) ?? [];
    const getTokenIdsCallsResult = useContractCalls(getTokenIdsCalls) ?? [];

    useEffect(() => {
        if (getTokenIdsCallsResult.length) {
            let ids = getTokenIdsCallsResult.map((result) => {
                if (result && result.length) {
                    return result[0].toNumber();
                }
                return null;
            });
            ids = ids.filter((id) => id);

            // console.debug(`tokenIds =>`, ids);
            setLockedTokenIds(ids);
        } else {
            setLockedTokenIds([]);
        }
    }, [getTokenIdsCallsResult]);





    const getLockedTokensCalls = useMemo(() => {
        let calls = lockedTokenIds.map(id => {
            return {
                contract: vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'lockedDeposits',
                args: [id]
            };
        });
        return calls;
    }, [lockedTokenIds]) ?? [];
    const getLockedTokensResult = useContractCalls(getLockedTokensCalls) ?? [];


    const getLockedRewardsCalls = useMemo(() => {
        let calls = lockedTokenIds.map(id => {
            return {
                contract: vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'getLockedDepClaimableRwdAmt',
                args: [id]
            };
        });
        return calls;
    }, [lockedTokenIds]) ?? [];
    const getLockedRewardsResult = useContractCalls(getLockedRewardsCalls) ?? [];


    useEffect(() => {
        // console.debug(`getLockedTokensResult:`, getLockedTokensResult);

        if(getLockedTokensResult.length && getLockedTokensResult[0].length && getLockedRewardsResult.length && getLockedRewardsResult[0].length){
            let _records = getLockedTokensResult.map((response, index) => {
                let rewardsResponse = getLockedRewardsResult[index];
                if(response.length && rewardsResponse && rewardsResponse.length){
                    return buildLockedStakingRecord(response, vaultToken, rewardsResponse);
                } else {
                    return null;
                }
            }).filter(record => {
                return record;
            });

            setRecords(_records);
        } else {
            setRecords([]);
        }
    }, [getLockedTokensResult, getLockedRewardsResult]);

    return records;
};


const buildRedeemRequestRecord = (redeemResponse, expectedAssetAmountResponse, vaultToken) => {
    let stakingId = parseInt(redeemResponse[0], 10);
    let stakingAmount = new TokenValueInUSD(redeemResponse?.shareAmt, vaultToken, vaultToken?.currentMarketPrice?.bigNumber, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
    let expectedAssetAmount = new TokenValueInUSD(expectedAssetAmountResponse[0], vaultToken, vaultToken?.currentMarketPrice?.bigNumber, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS);
    let releaseTimeUnix = parseInt(redeemResponse?.releaseTimestamp, 10);

    let record = new RedeemRequestRecord({
        stakingId,
        stakingAmount,
        expectedAssetAmount,
        releaseTimeUnix,
    });

    // console.debug(
    //     `record:`, record,
    //     `redeemResponse:`, redeemResponse,
    //     `expectedAssetAmountResponse:`, expectedAssetAmountResponse,
    // );

    return record;
};

export const useRedeemRequestRecords = (vaultToken) => {
    const web3Context = useContext(WebThreeContext);

    const [records, setRecords] = useState([]);


    const [requestIds, setRequestIds] = useState([]);
    const getRequestIdsCallResult = useContractCall(web3Context?.account && vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault, 'getRedeemRequestIds', [web3Context?.account]) ?? [];
    useEffect(() => {
        if(getRequestIdsCallResult && getRequestIdsCallResult.length){
            // console.debug(`getRequestIdsCallResult:`, getRequestIdsCallResult);

            let ids = getRequestIdsCallResult[0];
            setRequestIds(ids);
            // console.debug(`requestIds =>`, ids);
        }
    }, [getRequestIdsCallResult]);

    const getRequestCalls = useMemo(() => {
        let calls = requestIds.map(id => {
            return {
                contract: vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault,
                callMethod: 'redeemRequests',
                args: [id]
            };
        });
        return calls;
    }, [requestIds]) ?? [];
    const getRequestResult = useContractCalls(getRequestCalls) ?? [];



    const getExpectedAssetAmountCalls = useMemo(() => {
        // console.debug(`getRequestResultForExpectedAssetAmount:`, getRequestResult);

        if(getRequestResult.length && getRequestResult[0].length){
            let shareAmts = getRequestResult.map(response => {
                let amount = new Amount(response?.shareAmt || 0);
                return amount.value;
            });

            return shareAmts.map(amount => {
                return {
                    contract: vaultToken?.address && vaultToken?.vault?.theAddress && amount && vaultToken?.vault,
                    callMethod: 'previewRedeem',
                    args: [amount]
                };
            });
        }
        return [];
    }, [getRequestResult]) ?? [];
    const getExpectedAssetAmountResult = useContractCalls(getExpectedAssetAmountCalls) ?? [];


    useEffect(() => {
        // console.debug(`getRequestResult:`, getRequestResult);

        if(getRequestResult.length && getRequestResult[0].length){
            if(getExpectedAssetAmountResult.length && getExpectedAssetAmountResult[0].length && getRequestResult.length === getExpectedAssetAmountResult.length){
                let _records = getRequestResult.map((response, index) => {
                    let expectedAssetAmountResponse = getExpectedAssetAmountResult[index];
                    return buildRedeemRequestRecord(response, expectedAssetAmountResponse, vaultToken);
                }).filter(record => {
                    return record?.stakingAmount.tokenAmount.amountOnChain.value > 0;
                });

                setRecords(_records);
            }
        } else {
            setRecords([]);
        }
    }, [getRequestResult, getExpectedAssetAmountResult]);

    return records;
};

export const useRedeemRequestCounter = (vaultToken) => {
    const web3Context = useContext(WebThreeContext);

    const [count, setCount] = useState(0);

    const getRequestIdsCallResult = useContractCall(web3Context?.account && vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault, 'getRedeemRequestIds', [web3Context?.account]) ?? [];
    useEffect(() => {
        if(getRequestIdsCallResult && getRequestIdsCallResult.length){
            let ids = getRequestIdsCallResult[0] || [];
            setCount(ids.length);
            // console.debug(`requestIds =>`, ids);
        } else {
            setCount(0);
        }
    }, [getRequestIdsCallResult]);


    return count;
};

export const useMaxRedeemRequestCount = (vaultToken) => {
    const web3Context = useContext(WebThreeContext);

    const [max, setMax] = useState(0);

    const getCallResult = useContractCall(web3Context?.account && vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault, 'maxRedeemRequestNum', []) ?? [];
    useEffect(() => {
        if(getCallResult && getCallResult.length){
            let max = getCallResult[0]?._hex;
            max = parseInt(max, 16);
            setMax(max);

            // console.debug(`useMaxRedeemRequestCount =>`, max);
        }
    }, [getCallResult.length]);


    return max;
};

export const useDiscountRate = (vaultToken, duration) => {
    const [discountRatio, setDiscountRatio] = useState(new TokenAmount(0));
    const getRatioCallResult = useContractCall(vaultToken?.address && vaultToken?.vault?.theAddress && vaultToken?.vault, 'getDiscountRate', [duration]) ?? [];
    useEffect(() => {
        if(getRatioCallResult && getRatioCallResult.length){
            let _ratioAmount = new TokenAmount(getRatioCallResult[0], RatioToShow, false, RATIO_SHOW_DECIMALS);
            setDiscountRatio(_ratioAmount);
            // console.debug(
            //     `discountRatio =>`, _ratioAmount,
            //     `getRatioCallResult =>`, getRatioCallResult,
            // );
        }
    }, [getRatioCallResult]);

    return discountRatio;
};


const buildSubgraphQueryCondition = (conditions) => {
    let query = '';
    conditions.forEach(condition => {
        query = `${condition?.key}:"${condition?.value}",${query}`;
    });
    query = `{${query}}`;
    return query;
};

const buildVaultAssetHistory = (token, vaultAddress, response) => {
    let history = [];

    let depositedWithDiscountAndLocks = response?.depositedWithDiscountAndLocks || [];
    let lockIds = depositedWithDiscountAndLocks.map((subgraphData, index) => {
        let id = subgraphData['transactionHash'];
        return id;
    });

    let deposits = response?.deposits || [];
    deposits.forEach((subgraphData, index) => {
        let asset = token;
        let actionType = VAULT_ASSET_HISTORY_TYPE.deposit;
        let actionTimeUnix = subgraphData['blockTimestamp'];
        let actionAmount = new TokenAmount(subgraphData['assets'], token);

        let id = subgraphData['transactionHash'];
        let lock = lockIds.includes(id);

        let data = new AssetsHistoryData({
            asset,
            actionType,
            actionTimeUnix,
            actionAmount,
            lock
        });
        history.push(data);
    });

    let withdraws = response?.withdraws || [];
    withdraws.forEach((subgraphData, index) => {
        let asset = token;
        let actionType = VAULT_ASSET_HISTORY_TYPE.withdraw;
        let actionTimeUnix = subgraphData['blockTimestamp'];
        let actionAmount = new TokenAmount(subgraphData['assets'], token);

        let data = new AssetsHistoryData({
            asset,
            actionType,
            actionTimeUnix,
            actionAmount
        });
        history.push(data);
    });


    return history.sort((a, b) =>{
        return b.actionTimeUnix - a.actionTimeUnix;
    });
};

const fetchVaultAssetHistoryFromSubgraph = ({token, chainId, account = '', startTimestamp = 0, first = 1000,}) => {
    return new Promise((resolve, reject) => {
        let url = ContractConfig.subgraph(chainId);

        let vaultAddress = token?.vault?.theAddress;

        let conditions = [];
        conditions.push({
            key: 'caller',
            value: account,
        });
        if (vaultAddress) {
            conditions.push({
                key: 'vault',
                value: vaultAddress,
            });
        }
        if (startTimestamp) {
            conditions.push({
                key: 'blockTimestamp_gte',
                value: startTimestamp,
            });
        }
        let queryConditions = buildSubgraphQueryCondition(conditions);
        // console.debug(`vault asset history: queryConditions =>`, queryConditions);

        let query = {
            query: `{
              deposits(
                first: ${first}
                where: ${queryConditions}
                orderBy: blockTimestamp
                orderDirection: desc
              ) {
                assets
                blockNumber
                blockTimestamp
                caller
                id
                owner
                shares
                vault
                transactionHash
              }
              depositedWithDiscountAndLocks(
                first: ${first}
                where: ${queryConditions}
                orderBy: blockTimestamp
                orderDirection: desc
              ) {
                _lockedDeposit_assetDepAmt
                _lockedDeposit_assetDiscAmt
                _lockedDeposit_id
                _lockedDeposit_initAccRwdPerShare
                _lockedDeposit_lockDuration
                _lockedDeposit_releaseTimestamp
                _lockedDeposit_shareAmt
                blockTimestamp
                caller
                id
                vault
                transactionHash
              }
              withdraws(
                first: ${first}
                where: ${queryConditions}
                orderBy: blockTimestamp
                orderDirection: desc
              ) {
                assets
                blockTimestamp
                caller
                id
                owner
                receiver
                shares
                vault
              }
            }`,
        };

        // console.debug(`vault asset history: request url =>`, url, `query =>`, query);

        Axios
            .post(url, query)
            .then((response) => {
                console.debug(`vault asset history: request url =>`, url, `response =>`, response);

                let _history = buildVaultAssetHistory(token, vaultAddress, response?.data?.data || {});
                resolve(_history);
                console.debug(`vault asset history:`, _history);
            })
            .catch((e) => {
                console.log(e);
                resolve([]);
            });
    });


};

export const useVaultAssetHistoryRecords = (token) => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId;

    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (chainId) {
            // console.debug(
            //     `fetch order history...  `,
            //     `portfolioAddress =>`, portfolioAddress,
            //     `blockHeight =>`, blockHeight,
            // );

            setRecords([]);

            fetchVaultAssetHistoryFromSubgraph({
                token,
                chainId,
                account: web3Context?.account,
                first: 10,
            }).then(_history => {
                setRecords(_history);
            });
        }
    }, [chainId, web3Context, token]);

    return records;
};