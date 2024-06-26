import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {Amount, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {useIntl} from "../../../../../components/i18n";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import {buildToken} from "../../../../../hooks/useTrdingMeta";
import NumberPicker from "rc-input-number/es";
import {numberInputValueFormat} from "../../../../../utils/NumberFormat";
import ApplicationConfig from "../../../../../ApplicationConfig";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useApprove, useConfiguredContractSend, useContractCall} from "../../../../../components/ContractHooks";
import {debounce} from "debounce";
import BigNumber from "bignumber.js";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import {ConnectWalletBtnAdapter} from "../../../../../components/ConnectWalletBtn";

const FundingRateForm = ({token}) => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [tab, setTab] = useState('Deposit');

    const [amount, setAmount] = useState('');
    const [txAmount, setTxAmount] = useState(new TokenAmount(0, token, true));
    const [maxAmount, setMaxAmount] = useState(new TokenAmount(0));
    const [amountChecked, setAmountChecked] = useState(false);
    const [amountOverflow, setAmountOverflow] = useState(false);

    const [balanceAmount, setBalanceAmount] = useState(new TokenAmount(0));

    const tokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: token?.address,
    };
    const getAssetBalanceCallResult = useContractCall(tab === 'Deposit' ? web3Context.account && tokenContract : web3Context.account && token?.vault, tab === 'Deposit' ? 'balanceOf' : 'availableBalanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        if(getAssetBalanceCallResult && getAssetBalanceCallResult.length){
            setBalanceAmount(new TokenAmount(getAssetBalanceCallResult[0], token));
        }
    }, [getAssetBalanceCallResult]);

    const [percent, setPercent] = useState('');

    const doUpdateAmount = (_amount) => {
        if(_amount && parseFloat(_amount) > 0){
            setAmount(_amount);
            let inputAmount = new TokenAmount(_amount, token, true);
            setTxAmount(inputAmount);
            setAmountChecked(true);

            if(maxAmount && inputAmount.amount.bigNumber.comparedTo(maxAmount.amount.bigNumber) <= 0){
                setAmountOverflow(false);
            }else{
                setAmountOverflow(true);
            }
        }else{
            setAmountChecked(false);
            setAmountOverflow(false);
        }
    };

    const onAmountChange = debounce((value) => {
        doUpdateAmount(value);
        setPercent('');
    }, ApplicationConfig.defaultDebounceWait);

    const resetForm = () => {
        doUpdateAmount('');
        setAmount('');
        setPercent('');
        setTxAmount(new TokenAmount(0, token, true));
    };

    useEffect(() => {
        if(tab && balanceAmount?.amount?.value){
            setMaxAmount(balanceAmount);
        }
    }, [tab, balanceAmount]);


    useEffect(() => {
        if(tab && percent && balanceAmount?.amount?.value){
            let baseAmount = balanceAmount.amountOnChain.bigNumber;
            let percentValue = new BigNumber(percent).div(100);
            let _amount = baseAmount.times(percentValue).toFixed(0);

            let inputAmount = new TokenAmount(_amount, token);
            setAmount(inputAmount.amount.value);
            setTxAmount(inputAmount);
            setAmountChecked(true);
            setAmountOverflow(false);
        }
    }, [tab, balanceAmount, percent]);




    const {
        loaded: tokenApproveLoaded,
        needToApprove: tokenNeedToApprove,
        defaultApproveAmount,
        send: sendApprove,
    } = useApprove(
        token,
        txAmount,
        token?.vault?.theAddress,
        `Approve ${token?.symbol} spend on Funding Rare Vault Contract`
    );
    useEffect(() => {
        console.debug(`tokenApproveLoaded =>`, tokenApproveLoaded, `tokenNeedToApprove =>`, tokenNeedToApprove);
    }, [tokenApproveLoaded, tokenNeedToApprove]);







    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState(tab);

    const updateSubmitTxt = () => {
        if(tab === 'Deposit'){
            amountOverflow ? setSubmitTxt(`Insufficient Balance`) : (tokenApproveLoaded && tokenNeedToApprove ? setSubmitTxt(`Deposit(2/2)`) : setSubmitTxt(tab) );
        } else {
            amountOverflow ? setSubmitTxt(`Insufficient Balance`) : setSubmitTxt(tab);
        }
    };

    useEffect(() => {
        updateSubmitTxt();

        if(tab === 'Deposit'){
            setSubmitEnable(amountChecked && !amountOverflow && tokenApproveLoaded && !tokenNeedToApprove);
        } else {
            setSubmitEnable(amountChecked && !amountOverflow);
        }
    }, [amountChecked, amountOverflow, tab, tokenApproveLoaded, tokenNeedToApprove]);


    const onApprove = () => {
        if(tokenNeedToApprove){
            let defaultApproveAllowance = defaultApproveAmount?.amountOnChain?.value;
            console.debug(`approve token: defaultApproveAmount =>`, defaultApproveAmount);

            sendApprove(token?.vault?.theAddress, defaultApproveAllowance);
        }
    };



    const { sendTx: sendDeposit } = useConfiguredContractSend(
        token.vault,
        'deposit',
        'Deposit',
        null,
        () => {
            resetForm()
        }
    );

    const { sendTx: sendWithdraw } = useConfiguredContractSend(
        token.vault,
        'requestToRedeem',
        'Request To Redeem',
        null,
        () => {
            resetForm()
        }
    );

    const onDeposit = () => {
        let _amount = txAmount.amountOnChain.value;
        let receiver = web3Context.account;
        console.debug(
            `deposit: `,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );

        let txContent = `Deposit ${txAmount.amount.formativeValue} ${txAmount.token.name} to Funding Rate Vault`;
        sendDeposit(txContent, _amount, receiver);
    };

    const onWithdraw = () => {
        let _amount = txAmount.amountOnChain.value;
        let receiver = web3Context?.address;
        console.debug(
            `withdraw: address =>`, receiver,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );

        let txContent = `Withdraw ${txAmount.amount.formativeValue} ${token.dTokenName} from Funding Rate Vault`;
        sendWithdraw(txContent, _amount);
    };

    const onSubmit = () => {
        if(tab === 'Deposit'){
            onDeposit();
        } else {
            onWithdraw();
        }
    };

    return (
        <div className={`f_c_l r_12 squircle_border f_r_section_item f_r_section_item_l trade_sections funding_rate_form`}>
            <div className={`f_c_l w_100 f_r_section_item_content tab_box`}>
                <div className={`f_r_b operations_tab w_100`}>
                    <div className={'f_r_l gap-5 cp'}>
                        <div className={`tab_item cp ${tab === 'Deposit' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('Deposit')}}>{`Deposit`}</div>
                        <div className={`tab_item cp ${tab === 'Withdraw' ? 'c_hl b active' : 'c_text'}`} onClick={() => {setTab('Withdraw')}}>{`Withdraw`}</div>
                    </div>
                </div>
            </div>

            <div className={`f_c_b w_100 f_r_section_item_content_nb form_box`}>
                <div className={'f_c_l'}>
                    <div className={'f_r_b f_12'}>
                        <div>{`${tab} asset`}</div>
                        <div className={'f_r_l'}>
                            <span className={'c_text'}>{`Available:`}</span>
                            <span className={'m_l_5'}>{`${maxAmount.amount.formativeValue} ${tab === 'Deposit' ? token?.name : token?.dTokenName}`}</span>
                        </div>
                    </div>

                    <div className={'f_r_b c_hl text_input i_number_has_icon m_t_10'}>
                        <NumberPicker
                            formatter={numberInputValueFormat}
                            placeholder={intl.get(`commons.component.input.placeholder`)}
                            value={amount}
                            step={1}
                            precision={18}
                            min={0}
                            max={ApplicationConfig.maxNumberPickerValue}
                            stringMode={true}
                            className={'c_hl text_input i_number'}
                            onChange={onAmountChange}
                        />

                        <div className={'f_r_l'}>
                            <CoinIcon logo={token?.logoURI} className = 'coin_icon_20'/>
                            <div className={'m_l_10 f_14 b c_hl'}>{`${tab === 'Deposit' ? token?.name : token?.dTokenName}`}</div>
                        </div>
                    </div>

                    <div className={'f_r_l gap-3 m_t_10 percent_amount_box'}>
                        <div className={`p_item r_8 squircle_border cp ${percent === '10' ? 'active' : 'c_text'}`} onClick={() => {setPercent('10')}}>{`10%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '20' ? 'active' : 'c_text'}`} onClick={() => {setPercent('20')}}>{`20%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '50' ? 'active' : 'c_text'}`} onClick={() => {setPercent('50')}}>{`50%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '100' ? 'active' : 'c_text'}`} onClick={() => {setPercent('100')}}>{`100%`}</div>
                    </div>
                </div>

                <div className={'f_c_l'}>
                    <ConditionDisplay display={tab === 'Deposit' && tokenApproveLoaded && tokenNeedToApprove}>
                        <div className={`f_14 m_t_25 r_12 squircle_border c_text deposit_tips_box`}>
                            <span className={`index_box`}>1</span>
                            <span>{`Approve USDC for deposit`}</span>
                            <span className={`index_box`}>2</span>
                            <span>{`Confirm deposit transaction`}</span>
                        </div>
                    </ConditionDisplay>

                    <ConditionDisplay display={tab !== 'Deposit'}>
                        <div className={`f_14 m_t_25 r_12 squircle_border c_text deposit_tips_box`}>
                            {`Withdrawal has a 24-hour delay`}
                        </div>
                    </ConditionDisplay>

                    <div className={`f_r_b p_box w_100 ${web3Context.account ? 'm_t_25' : 'm_t_20'} gap-5`}>
                        <ConditionDisplay display={web3Context.account}>
                            <ConditionDisplay display={tokenApproveLoaded && tokenNeedToApprove}>
                                <button className="i_btn w_100 sub_btn_primary sub_btn_long_default" onClick={() => {onApprove()}}>{`${intl.get(`commons.component.input.approve`)}(1/2)`}</button>
                            </ConditionDisplay>

                            <button className="i_btn w_100 sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{submitTxt}</button>
                        </ConditionDisplay>

                        <ConditionDisplay display={!web3Context.account}>
                            <ConnectWalletBtnAdapter className={'w_100'}/>
                        </ConditionDisplay>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingRateForm;
