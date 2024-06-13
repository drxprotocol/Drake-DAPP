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
import {useContractCall} from "../../../../../components/ContractHooks";
import {debounce} from "debounce";
import BigNumber from "bignumber.js";

const FundingRateForm = () => {
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [tab, setTab] = useState('Deposit');

    const token = buildToken('USDC', web3Context.chainId);
    const asset = {
        token,
    };

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
    const getAssetBalanceCallResult = useContractCall(web3Context.account && tokenContract, 'balanceOf', [web3Context.account]) ?? [];
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

    const [currentBalance, setCurrentBalance] = useState(new TokenAmount(0, token));

    useEffect(() => {
        if(tab && currentBalance?.amount?.value && balanceAmount?.amount?.value){
            if(tab === 'Deposit'){
                setMaxAmount(balanceAmount);
            }else{
                setMaxAmount(currentBalance);
            }
        }
    }, [tab, currentBalance, balanceAmount]);


    useEffect(() => {
        if(tab && percent && currentBalance?.amount?.value && balanceAmount?.amount?.value){
            let baseAmount = balanceAmount.amountOnChain.bigNumber;
            if(tab !== 'Deposit'){
                baseAmount = currentBalance.amountOnChain.bigNumber;
            }

            let percentValue = new BigNumber(percent).div(100);
            let _amount = baseAmount.times(percentValue).toFixed(0);

            let inputAmount = new TokenAmount(_amount, token);
            setAmount(inputAmount.amount.value);
            setTxAmount(inputAmount);
            setAmountChecked(true);
            setAmountOverflow(false);
        }
    }, [tab, currentBalance, balanceAmount, percent]);



    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState('Confirm');

    const updateSubmitTxt = () => {
        amountOverflow ? setSubmitTxt(`Insufficient Balance`) : setSubmitTxt(`Confirm`);
    };

    useEffect(() => {
        updateSubmitTxt();
        setSubmitEnable(amountChecked && !amountOverflow);
    }, [amountChecked, amountOverflow]);

    const onDeposit = () => {
        let _amount = txAmount.amountOnChain.value;
        // let address = asset.portfolio.address;
        console.debug(
            // `deposit: address =>`, address,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );

        // let txContent = `Deposit ${txAmount.amount.formativeValue} ${txAmount.token.name} to ${asset.portfolio.portfolioType} margin`;
        // sendDeposit(txContent, address, _amount);
    };

    const onWithdraw = () => {
        let _amount = txAmount.amountOnChain.value;
        let address = token?.address;
        console.debug(
            `withdraw: address =>`, address,
            `amountO =>`, txAmount.amount.value,
            `amountH =>`, txAmount.amountOnChain.formativeNumber,
            `amount =>`, _amount,
        );

        // let txContent = `Withdraw ${txAmount.amount.formativeValue} ${txAmount.token.localName} from ${asset.portfolio.portfolioType} margin`;
        // sendWithdraw(txContent, address, _amount);
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

            <div className={`f_c_l w_100 f_r_section_item_content_nb form_box`}>
                <div className={'f_c_l'}>
                    <div className={'f_r_b f_12'}>
                        <div>{`Deposit asset`}</div>
                        <div className={'f_r_l'}>
                            <span className={'c_text'}>{`Available:`}</span>
                            <span className={'m_l_5'}>{`${maxAmount.amount.formativeValue} ${tab === 'Deposit' ? asset?.token?.name : asset?.token?.localName}`}</span>
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
                            <div className={'m_l_10 f_14 b c_hl'}>{`${token?.name}`}</div>
                        </div>
                    </div>

                    <div className={'f_r_l gap-3 m_t_10 percent_amount_box'}>
                        <div className={`p_item r_8 squircle_border cp ${percent === '10' ? 'active' : 'c_text'}`} onClick={() => {setPercent('10')}}>{`10%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '20' ? 'active' : 'c_text'}`} onClick={() => {setPercent('20')}}>{`20%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '50' ? 'active' : 'c_text'}`} onClick={() => {setPercent('50')}}>{`50%`}</div>
                        <div className={`p_item r_8 squircle_border cp ${percent === '100' ? 'active' : 'c_text'}`} onClick={() => {setPercent('100')}}>{`100%`}</div>
                    </div>
                </div>

                <div className={`f_r_l m_t_25`}>
                    <div className={`i_icon_24 i_checkbox_checked`}></div>
                    <div className={`c_text f_14 m_l_12`}>{`Automatically withdraw if funding rate becomes negative`}</div>
                </div>

                <div className={`f_r_l f_14 m_t_25 r_12 squircle_border c_text deposit_tips_box`}>{`1.Approve USDC for deposit | 2. Confirm deposit transaction`}</div>

                <div className={'f_c_c m_t_25'}>
                    <button className="i_btn sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{submitTxt}</button>
                </div>
            </div>
        </div>
    );
};

export default FundingRateForm;
