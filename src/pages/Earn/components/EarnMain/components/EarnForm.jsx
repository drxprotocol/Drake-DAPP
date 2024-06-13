import React, {useContext, useEffect, useState} from 'react';
import {Segmented, Dropdown} from "antd";
import {
    EARN_STAKE_TYPE, EARN_STAKE_TYPE_OPTIONS, EARN_STAKE_TYPE_OPTIONS_CN,
} from "../../../../../components/TradingConstant";
import NumberPicker from "rc-input-number/es";
import {numberInputValueFormat} from "../../../../../utils/NumberFormat";
import ApplicationConfig from "../../../../../ApplicationConfig";
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useApprove, useConfiguredContractSend, useContractCall} from "../../../../../components/ContractHooks";
import {debounce} from "debounce";
import BigNumber from "bignumber.js";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import EarnStepsDialog from "../../../../../components/Modals/EarnStepsDialog";
import {useDiscountRate} from "../../../../../hooks/useStakeMeta";
import {ConnectWalletBtnAdapter} from "../../../../../components/ConnectWalletBtn";
import {useIntl} from "../../../../../components/i18n";
import I18nContext from "../../../../../components/i18n/I18nContext";

const durationOptions = [
    {
        days: 7,
        label: '7 days',
        value: 7 * 24 * 60 * 60,
    },
    {
        days: 30,
        label: '30 days',
        value: 30 * 24 * 60 * 60,
    },
    {
        days: 180,
        label: '180 days',
        value: 180 * 24 * 60 * 60,
    },
    {
        days: 365,
        label: '365 days',
        value: 365 * 24 * 60 * 60,
    },
];

const defaultDuration = durationOptions[1];

const buildDurationItems = (selectedDuration, onDurationChange, customizedOption, onCustomizedOptionChange) => {
    let onDurationOptionChange = (option) => {
        onDurationChange && onDurationChange(option);
        onCustomizedOptionChange && onCustomizedOptionChange({});
    };

    let items = durationOptions.map((option) => {
        return {
            label: (
                <div className={`f_r_b cp r_12 t_selector_item ${option?.value === selectedDuration.value && 'active'}`} onClick={() => {onDurationOptionChange(option)}}>
                    <div>{`${option.label}`}</div>
                    <ConditionDisplay display={option?.value === selectedDuration.value}>
                        <div className={'i_icon_24 i_checked'}></div>
                    </ConditionDisplay>
                </div>
            ),
            key: option?.value,
        };
    });

    let onCustomizedClick = (e) => {
        e.stopPropagation();
    };

    let onCustomizedDaysChange = debounce((value) => {
        if(value){
            let option = {
                days: value,
                label: `${value} days`,
                value: value * 24 * 60 * 60,
            };
            onDurationChange && onDurationChange(option);
            onCustomizedOptionChange && onCustomizedOptionChange(option);
        }
    }, ApplicationConfig.defaultDebounceWait);

    let customized = {
        label: (
            <div className={'f_c_l t_selector_item has_input'} onClick={onCustomizedClick}>
                <div className={`cp r_12 `}>
                    <NumberPicker
                        formatter={numberInputValueFormat}
                        placeholder="Custom days"
                        value={customizedOption?.days || ''}
                        step={1}
                        precision={18}
                        min={7}
                        max={365}
                        stringMode={true}
                        className={'c_hl text_input i_number'}
                        onChange={onCustomizedDaysChange}
                    />
                </div>
                <div className={`f_12 c_text m_t_5`}>{`*Range 7-365 days`}</div>
            </div>
        ),
        key: 'customized',
    };
    items.push(customized);

    return items;
};

const LockDurationSelector = ({onDurationChange}) => {
    const [selectedOption, setSelectedOption] = useState(defaultDuration);
    useEffect(() => {
        onDurationChange(selectedOption);
    }, [selectedOption]);

    const [customizedOption, setCustomizedOption] = useState({});

    const items = buildDurationItems(selectedOption, setSelectedOption, customizedOption, setCustomizedOption);

    return (
        <Dropdown
            menu={{
                items,
            }}
            overlayClassName={'overlay_container portfolio_type_selector_popup portfolio_type_selector_small_popup trade_sections'}
            placement="bottomLeft"
        >
            <div className={'f_r_l r_8 squircle_border duration_selector_box m_t_10'}>
                <div className={'f_r_b cp'}>
                    <div className={'f_r_l'}>
                        <div className={'i_icon_24 i_calendar'}></div>
                        <div className={'f_12 c_hl m_l_5'}>{`${selectedOption.label}`}</div>
                    </div>
                    <div className={'i_icon_24 i_arrow_down_g'}></div>
                </div>
            </div>
        </Dropdown>
    );
};

const EarnForm = ({token}) => {
    const intl = useIntl();
    const i18nContext = useContext(I18nContext);
    const web3Context = useContext(WebThreeContext);

    const [earnType, setEarnType] = useState(EARN_STAKE_TYPE.Unlock.label);
    const onEarnTypeSelected = (type) => {
        setEarnType(type);
    };


    const [options, setOptions] = useState(EARN_STAKE_TYPE_OPTIONS);
    useEffect(() => {
        if(i18nContext?.lang === 'zh-CN'){
            setOptions(EARN_STAKE_TYPE_OPTIONS_CN);
        }
    }, [i18nContext]);


    const [showEarnSteps, setShowEarnSteps] = useState(false);


    const [amount, setAmount] = useState('');
    const [txAmount, setTxAmount] = useState(new TokenAmount(0, token, true));
    const [maxAmount, setMaxAmount] = useState(new TokenAmount(0));
    const [amountChecked, setAmountChecked] = useState(false);
    const [amountOverflow, setAmountOverflow] = useState(false);

    const [balanceAmount, setBalanceAmount] = useState(new TokenAmount(0));
    const [percent, setPercent] = useState('');
    const [enablePercent, setEnablePercent] = useState(false);

    const updatePercent = (percentValue) => {
        setEnablePercent(true);
        setPercent(percentValue);
    };

    const tokenContract = {
        ...ContractConfig.asset.ERC20,
        theAddress: token?.address,
    };
    const getAssetBalanceCallResult = useContractCall(web3Context.account && web3Context?.chainId === token?.chainId && tokenContract, 'balanceOf', [web3Context.account]) ?? [];
    useEffect(() => {
        // console.debug(`getAssetBalanceCallResult:`, getAssetBalanceCallResult);

        if(getAssetBalanceCallResult && getAssetBalanceCallResult.length){
            setBalanceAmount(new TokenAmount(getAssetBalanceCallResult[0], token, false, STABLE_COIN_TOKEN_AMOUNT_SHOW_DECIMALS));
        }
    }, [getAssetBalanceCallResult]);
    useEffect(() => {
        if(!web3Context?.account){
            setBalanceAmount(new TokenAmount(0, token));
        }
    }, [web3Context?.account]);




    useEffect(() => {
        setMaxAmount(balanceAmount);
    }, [balanceAmount]);

    useEffect(() => {
        if(enablePercent && percent){
            if(balanceAmount?.amount?.value > 0){
                let baseAmount = balanceAmount.amountOnChain.bigNumber;

                let percentValue = new BigNumber(percent).div(100);
                let _amount = baseAmount.times(percentValue).toFixed(0);

                let inputAmount = new TokenAmount(_amount, token);
                setAmount(inputAmount.amount.value);
                setTxAmount(inputAmount);
                setAmountChecked(true);
                setAmountOverflow(false);
            } else {
                setAmountChecked(false);
                setAmountOverflow(false);
            }
        }
    }, [balanceAmount, percent, enablePercent]);


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
        setEnablePercent(false);
        setPercent('');
    }, ApplicationConfig.defaultDebounceWait);


    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
    const discountRatio = useDiscountRate(token, selectedDuration?.value);

    const resetForm = () => {
        doUpdateAmount('');
        setAmount('');
        setEnablePercent(false);
        setPercent('');
        setTxAmount(new TokenAmount(0, token, true));
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

    const { sendTx: sendDepositWithDiscountAndLock } = useConfiguredContractSend(
        token.vault,
        'depositWithDiscountAndLock',
        'Deposit and lock',
        null,
        () => {
            resetForm()
        }
    );


    const {
        loaded: tokenApproveLoaded,
        needToApprove: tokenNeedToApprove,
        defaultApproveAmount,
        send: sendApprove,
    } = useApprove(
        token,
        txAmount,
        token?.vault?.theAddress,
        `Approve ${token?.symbol} spend on Earn Contract`
    );
    useEffect(() => {
        console.debug(`tokenApproveLoaded =>`, tokenApproveLoaded, `tokenNeedToApprove =>`, tokenNeedToApprove);
    }, [tokenApproveLoaded, tokenNeedToApprove]);

    const [submitEnable, setSubmitEnable] = useState(false);
    const [submitTxt, setSubmitTxt] = useState('page.earn.vault.form.submit');

    const updateSubmitTxt = () => {
        if(amountOverflow){
            setSubmitTxt(`commons.component.input.insufficient_balance`)
        } else {
            tokenApproveLoaded && tokenNeedToApprove ? setSubmitTxt(`page.earn.vault.form.submit.step2`) : setSubmitTxt(`page.earn.vault.form.submit`);
        }
    };

    useEffect(() => {
        updateSubmitTxt();
        if(earnType === EARN_STAKE_TYPE.Unlock.label){
            setSubmitEnable(amountChecked && !amountOverflow && tokenApproveLoaded && !tokenNeedToApprove);
        } else {
            setSubmitEnable(amountChecked && !amountOverflow && tokenApproveLoaded && !tokenNeedToApprove);
        }
    }, [earnType, amountChecked, amountOverflow, tokenApproveLoaded, tokenNeedToApprove]);


    const onApprove = () => {
        if(tokenNeedToApprove){
            let defaultApproveAllowance = defaultApproveAmount?.amountOnChain?.value;
            console.debug(`approve token: defaultApproveAmount =>`, defaultApproveAmount);

            sendApprove(token?.vault?.theAddress, defaultApproveAllowance);
        }
    };

    const onSubmit = () => {
        let amount = txAmount.amountOnChain.value;
        let receiver = web3Context.account;
        let lockDuration = selectedDuration.value;
        console.debug(
            `Deposit: `,
            `vault =>`, token,
            `earnType =>`, earnType,
            `txAmount =>`, txAmount,
            `amount =>`, amount,
            `selectedDuration =>`, selectedDuration,
            `lockDuration =>`, lockDuration,
            `receiver =>`, receiver,
        );

        if(earnType === EARN_STAKE_TYPE.Unlock.label){
            let txContent = `Deposit ${txAmount.amount.formativeValue} ${txAmount.token.name} to ${txAmount.token.name} Vault`;
            sendDeposit(txContent, amount, receiver);
        } else {
            let txContent = `Deposit and lock ${txAmount.amount.formativeValue} ${txAmount.token.name} to ${txAmount.token.name} Vault`;
            sendDepositWithDiscountAndLock(txContent, amount, lockDuration, receiver);
        }
    };


    return (
        <div className={`f_c_l_c e_main_item`}>
            <div className={'f_c_l_c r_12 squircle_border t_section t_section_np trading_form_section trading_form e_main_item_content'}>
                <div className={'f_r_b p_box w_100'}>
                    <div className={'e_i_title b'}>{intl.get(`page.earn.vault.title`)}</div>
                    <div className={'f_r_l cp'}>
                        <div className={'i_icon_24 i_dropdown'}></div>
                        <div className={'f_14 c_link m_l_8 cp'} onClick={()=>setShowEarnSteps(true)}>{intl.get(`page.earn.vault.form.steps`)}</div>
                    </div>

                    <EarnStepsDialog vaultToken={token} isOpen={showEarnSteps} onClose={()=>setShowEarnSteps(false)}/>
                </div>

                <div className={'f_r_l p_box w_100 m_t_20'}>
                    <Segmented options={options} value={earnType} onChange={onEarnTypeSelected} />
                </div>

                <div className={'f_r_b_t_w p_box w_100 m_t_25 gap-5'}>
                    <div className={`f_c_l ${earnType === EARN_STAKE_TYPE.Lock.label ? 'amount_box' : 'w_100'}`}>
                        <div className={'f_r_b f_12'}>
                            <div>{intl.get(`page.earn.vault.form.amount`)}</div>
                            <div className={'f_r_l'}>
                                <span className={'c_text'}>{intl.get(`page.earn.vault.form.available`)}</span>
                                <span className={'m_l_5'}>{`${maxAmount.amount.formativeValue} ${token?.name}`}</span>
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
                                className={''}
                                onChange={onAmountChange}
                            />

                            <div className={'f_r_l'}>
                                <CoinIcon logo={token?.logoURI} className = 'coin_icon_20'/>
                                <div className={'m_l_10 f_14 b c_hl'}>{`${token?.name}`}</div>
                            </div>
                        </div>


                        <div className={'f_r_l gap-3 m_t_10 percent_amount_box'}>
                            <div className={`p_item r_8 squircle_border cp ${percent === '10' ? 'active' : 'c_text'}`} onClick={() => {updatePercent('10')}}>{`10%`}</div>
                            <div className={`p_item r_8 squircle_border cp ${percent === '20' ? 'active' : 'c_text'}`} onClick={() => {updatePercent('20')}}>{`20%`}</div>
                            <div className={`p_item r_8 squircle_border cp ${percent === '50' ? 'active' : 'c_text'}`} onClick={() => {updatePercent('50')}}>{`50%`}</div>
                            <div className={`p_item r_8 squircle_border cp ${percent === '100' ? 'active' : 'c_text'}`} onClick={() => {updatePercent('100')}}>{`100%`}</div>
                        </div>
                    </div>


                    <ConditionDisplay display={earnType === EARN_STAKE_TYPE.Lock.label}>
                        <div className={'f_c_l calendar_box'}>
                            <div className={'f_r_b f_12'}>
                                <div>{intl.get(`page.earn.vault.form.lock_duration`)}</div>
                            </div>

                            <LockDurationSelector onDurationChange={setSelectedDuration}/>

                            <div className={`f_r_l f_12 m_t_10`}>
                                <span>{intl.get(`page.earn.vault.form.discount`)}</span>
                                <span className={'m_l_3 c_green'}>{`${discountRatio.amount.formativeValue}%`}</span>
                            </div>
                        </div>
                    </ConditionDisplay>
                </div>

                <div className={`f_r_b p_box w_100 ${web3Context.account ? 'm_t_25' : 'm_t_20'} gap-5`}>
                    <ConditionDisplay display={web3Context.account}>
                        <ConditionDisplay display={tokenApproveLoaded && tokenNeedToApprove}>
                            <button className="i_btn w_100 sub_btn_primary sub_btn_long_default" onClick={() => {onApprove()}}>{`${intl.get(`commons.component.input.approve`)}(1/2)`}</button>
                        </ConditionDisplay>

                        <button className="i_btn w_100 sub_btn_primary sub_btn_long_default" disabled={!submitEnable} onClick={() => {onSubmit()}}>{intl.get(submitTxt)}</button>
                    </ConditionDisplay>

                    <ConditionDisplay display={!web3Context.account}>
                        <ConnectWalletBtnAdapter className={'w_100'}/>
                    </ConditionDisplay>
                </div>
            </div>
        </div>
    );
};

export default EarnForm;
