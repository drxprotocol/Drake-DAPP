import './index.scss';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import ApplicationConfig from '../../../ApplicationConfig';
import CoinIcon from "../../Coin/CoinIcon";
import {useConfiguredContractSend, useContractCall, useContractCalls} from "../../ContractHooks";
import WebThreeContext from "../../WebThreeProvider/WebThreeContext";
import {useEnableTokens} from "../../../hooks/useTrdingMeta";
import {DEFAULT_CLAIM_TEST_TOKEN_AMOUNT, GET_TEST_ETH_URL} from "../../TradingConstant";
import {Amount, TokenAmount} from "../../../utils/TokenAmountConverter";
import {DefaultChain, DemoTradingChains} from "../../../contract/ChainConfig";
import ContractConfig from "../../../contract/ContractConfig";
import ConditionDisplay from "../../ConditionDisplay";
import TokenTransferDialog from "../TokenTransferDialog";

const TokenItem = ({tokenValueInUSD, onTransfer}) => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId || DefaultChain.chainId;

    const tokenContract = {
        ...ContractConfig.asset.TestERC20,
        theAddress: tokenValueInUSD?.token?.address,
    };

    const getTokenInfoCalls = useMemo(() => {
        if(web3Context?.account && !tokenValueInUSD?.token.native  && DemoTradingChains.includes(chainId)){
            return [
                {
                    contract: tokenContract,
                    callMethod: 'claimedAmt',
                    args: [web3Context?.account]
                },
                {
                    contract: tokenContract,
                    callMethod: 'claimableAmtCap',
                    args: []
                }
            ];
        }

        return [];
    }, [web3Context?.account, tokenValueInUSD?.token, chainId]) ?? [];
    const getTokenInfoResult = useContractCalls(getTokenInfoCalls) ?? [];
    const [claimAble, setClaimAble] = useState(false);
    useEffect(() => {
        // console.debug(`getTokenInfoResult =>`, getTokenInfoResult, `getTokenInfoCalls =>`, getTokenInfoCalls);

        if(getTokenInfoResult && getTokenInfoResult.length && getTokenInfoResult[0] && getTokenInfoResult[0].length){
            let claimedAmt = new Amount(getTokenInfoResult[0][0]);
            let claimableAmtCap = new Amount(getTokenInfoResult[1][0]);
            let _claimAble = claimedAmt.bigNumber.comparedTo(claimableAmtCap.bigNumber) < 0;
            setClaimAble(_claimAble);
        }
    }, [getTokenInfoResult]);

    useEffect(() => {
        if(tokenValueInUSD?.token.native && DemoTradingChains.includes(chainId)){
            setClaimAble(true);
        }
    }, [tokenValueInUSD?.token, chainId]);

    const { send: sendClaim } = useConfiguredContractSend(
        tokenContract,
        'claim',
        `Claim Test ${tokenValueInUSD?.token?.symbol}`,
    );

    const onClaim = (token) => {
        if(token?.native){
            window.open(GET_TEST_ETH_URL, '_blank');
        } else {
            let amount = token.claimAmountForTesting || DEFAULT_CLAIM_TEST_TOKEN_AMOUNT;
            let tokenAmount = new TokenAmount(amount, token, true);
            console.debug(`claim amount =>`, tokenAmount);
            sendClaim(tokenAmount.amountOnChain.value);
        }
    };


    const onTransferClick = () => {
        onTransfer && onTransfer(tokenValueInUSD?.tokenAmount);
    };

    return (
        <div className={'f_r_b token_item'}>
            <div className={'f_r_l'}>
                <CoinIcon logo={tokenValueInUSD?.token?.logoURI} className = 'coin_icon'/>

                <div className={'f_c_l m_l_10'}>
                    <div className={'f_14 b c_hl'}>
                        {`${tokenValueInUSD?.tokenAmount?.amount?.formativeValue} ${tokenValueInUSD?.token?.name}`}
                        {tokenValueInUSD?.token?.testToken && (
                            <span className={'test_flag'}>P</span>
                        )}
                    </div>
                    <div className={'f_12 c_t'}>{`$${tokenValueInUSD?.valueInUSD?.formativeNumber}`}</div>
                </div>
            </div>

            <div className={'f_r_l gap-3'}>
                {claimAble && (
                    <div className={`t_btn_ss f_12 cp`} onClick={() => {onClaim(tokenValueInUSD?.token)}}>{tokenValueInUSD?.token?.native ? `Claim more` : 'Claim'}</div>
                )}

                <div className={`t_btn_ss f_12 cp`} onClick={onTransferClick}>{'Transfer'}</div>
            </div>
        </div>
    );
};

const TokenBalancesDialog = ({ isOpen, onClose }) => {
    const web3Context = useContext(WebThreeContext);
    const chainId = web3Context.chainId || DefaultChain.chainId;

    const tokens = useEnableTokens() ?? [];
    useEffect(() => {
        // console.debug(`tokens =>`, tokens);
    }, [tokens]);

    const [showTransfer, setShowTransfer] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(new TokenAmount(0));
    const onTransfer = (tokenBalance) => {
        setTokenBalance(tokenBalance);
        setShowTransfer(true);
    };

    return (
        <Modal
            title=""
            footer={null}
            open={isOpen}
            width={ApplicationConfig.popupSmallWindowWidth}
            onCancel={onClose}
            className={'overlay_container common_modal token_balances_window'}
        >
            <div className={`w_100 f_c_l trade_sections`}>
                <div className={'f_r_b tb_title b'}>
                    <div className={'cp i_icon_24 i_arrow_left_gray'} onClick={onClose}></div>
                    <div className={'w-full dialog_title b text_center'}>{`All balances`}</div>

                    <TokenTransferDialog assetToken={tokenBalance?.token} availableAmount={tokenBalance} isOpen={showTransfer} onClose={()=>setShowTransfer(false)} onTransferSuccessful={()=>setShowTransfer(false)} />
                </div>

                <ConditionDisplay display={DemoTradingChains.includes(chainId)}>
                    <div className={'f_r_l r_8 warning_tips'}>
                        <div className={'i_icon_24 i_tips_info_blue'}></div>
                        <div className={'m_l_5 f_12 c_link '}>{`You are currently in paper trading mode`}</div>
                    </div>
                </ConditionDisplay>

                <div className={'f_c_l token_list gap-3'}>
                    {tokens.map((tokenValueInUSD, key) => {
                        return (
                            <TokenItem tokenValueInUSD={tokenValueInUSD} key={key} onTransfer={onTransfer}/>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default TokenBalancesDialog;
