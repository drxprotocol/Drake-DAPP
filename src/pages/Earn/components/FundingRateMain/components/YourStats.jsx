import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {useIntl} from "../../../../../components/i18n";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useContractCall} from "../../../../../components/ContractHooks";
import {TokenAmount} from "../../../../../utils/TokenAmountConverter";

const YourStats = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [availableAmount, setAvailableAmount] = useState(new TokenAmount(0));
    const [frBalanceAmount, setFRBalanceAmount] = useState(new TokenAmount(0));
    const [balanceAmount, setBalanceAmount] = useState(new TokenAmount(0));

    const iTokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: token?.address,
    };
    const getAvailableBalanceCallResult = useContractCall(web3Context.account && token?.vault, 'availableBalanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getAvailableBalanceCallResult && getAvailableBalanceCallResult.length){
            setAvailableAmount(new TokenAmount(getAvailableBalanceCallResult[0], token));
        }
    }, [getAvailableBalanceCallResult]);

    const getITokenBalanceCallResult = useContractCall(web3Context.account && token?.vault, 'balanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getITokenBalanceCallResult && getITokenBalanceCallResult.length){
            setFRBalanceAmount(new TokenAmount(getITokenBalanceCallResult[0], token));
        }
    }, [getITokenBalanceCallResult]);


    const getTokenBalanceCallResult = useContractCall(web3Context.account && iTokenContract, 'balanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getTokenBalanceCallResult && getTokenBalanceCallResult.length){
            setBalanceAmount(new TokenAmount(getTokenBalanceCallResult[0], token));
        }
    }, [getTokenBalanceCallResult]);


    return (
        <div className={`f_c_l r_12 squircle_border f_r_section_item f_r_section_item_s trade_sections your_stats`}>
            <div className={`f_c_l w_100 f_r_section_item_content`}>
                <div className={`f_r_l`}>
                    <div className={`i_icon_24 i_reports`}></div>
                    <div className={`b m_l_5 f_r_title`}>{`Your Stats`}</div>
                </div>
            </div>

            <div className={`f_c_l gap-3 w_100 f_r_section_item_content_nb f_14`}>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your Available frUSDC Balance`}</div>
                    <div className={`t_dashed_underline`}>{`${availableAmount.amount.formativeValue} USDC`}</div>
                </div>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your frUSDC Balance`}</div>
                    <div className={`t_dashed_underline`}>{`${frBalanceAmount.amount.formativeValue} frUSDC`}</div>
                </div>
                <div className={`f_r_b w_100`}>
                    <div className={`c_text`}>{`Your USDC Balance`}</div>
                    <div className={`t_dashed_underline`}>{`${balanceAmount.amount.formativeValue} USDC`}</div>
                </div>
            </div>
        </div>
    );
};

export default YourStats;
