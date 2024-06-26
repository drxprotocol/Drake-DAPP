import React, {useContext, useEffect, useState} from 'react';
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import {Amount, TokenAmount} from "../../../../../utils/TokenAmountConverter";
import {useIntl} from "../../../../../components/i18n";
import CoinIcon from "../../../../../components/Coin/CoinIcon";
import {buildToken} from "../../../../../hooks/useTrdingMeta";
import {numberInputValueFormat} from "../../../../../utils/NumberFormat";
import ApplicationConfig from "../../../../../ApplicationConfig";
import NumberPicker from "rc-input-number/es";


const ProfitCalculator = ({token}) => {
    const intl = useIntl();

    const [amount, setAmount] = useState('10000');
    const [rate, setRate] = useState('25');
    const [length, setLength] = useState('30');

    return (
        <div className={`f_r_l r_12 squircle_border f_r_section_item f_r_section_item_ll trade_sections profit_calculator`}>
            <div className={`f_r_l w_100 f_r_section_item_content`}>
                <div className={`f_r_l_t`}>
                    <div className={`i_icon_24 i_pulse_new`}></div>
                    <div className={`b m_l_5 f_r_title f_r_title_w`}>{`Estimated Profit Calculator`}</div>
                </div>


                <div className={`f_r_b_t f_12`}>
                    <div className={`f_c_l input_amount`}>
                        <div className={`m_b_5`}>{`Deposit  Amount`}</div>
                        <NumberPicker
                            formatter={numberInputValueFormat}
                            placeholder={intl.get(`commons.component.input.placeholder`)}
                            value={amount}
                            step={1}
                            precision={18}
                            min={0}
                            max={ApplicationConfig.maxNumberPickerValue}
                            stringMode={true}
                            disabled={true}
                            className={'c_hl text_input i_number'}
                        />
                    </div>

                    <div className={`f_c_l input_rate`}>
                        <div className={`m_b_5`}>{`Funding Rate`}</div>

                        <div className={'f_r_b c_hl text_input i_number_has_icon'}>
                            <NumberPicker
                                formatter={numberInputValueFormat}
                                placeholder={intl.get(`commons.component.input.placeholder`)}
                                value={rate}
                                step={1}
                                precision={18}
                                min={0}
                                max={ApplicationConfig.maxNumberPickerValue}
                                stringMode={true}
                                disabled={true}
                                className={'c_hl text_input i_number'}
                            />

                            <div className={'f_r_l c_text'}>{`%`}</div>
                        </div>

                        {/*
                        <div className={`c_text m_t_5 t_dashed_underline`}>{`Use current rate`}</div>
                        */}
                    </div>

                    <div className={`f_c_l input_deposit_length`}>
                        <div className={`m_b_5`}>{`Deposit  Length(in days)`}</div>
                        <NumberPicker
                            formatter={numberInputValueFormat}
                            placeholder={intl.get(`commons.component.input.placeholder`)}
                            value={length}
                            step={1}
                            precision={18}
                            min={0}
                            max={ApplicationConfig.maxNumberPickerValue}
                            stringMode={true}
                            disabled={true}
                            className={'c_hl text_input i_number'}
                        />
                    </div>
                    <div className={`input_split`}></div>
                </div>
            </div>

            <div className={`profit_calculator_split`}></div>

            <div className={`f_r_r gap-3 f_r_section_item_content_nb profit_calculator_days`}>
                <div className={`f_c_c_c estimated_pnl r_6`}>
                    <span className={`txt`}>{`Estimated pnl`}</span>
                    <span className={`c_green f_32`}>{`83.33 USDC`}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfitCalculator;
