import React from 'react';
import './index.scss';

import NumberPicker from 'rc-input-number';
import { numberInputValueFormat } from '../../utils/NumberFormat';
const TokenWidget = ({ tokenBal, tokenBalUsd, tokenIcon, tokenSymbol, inputValue, inputValueUsd, onMax }) => {
    return (
        <div className="br_20 p_20 option_box token_widget_wrapper">
            <div className="f_r_r">
                <div className="f_r_l_t f_14">
                    <div className="cg b">
                        Balance: {tokenBal} (~${tokenBalUsd})
                    </div>
                    <button className="cb m_l_4 b" onClick={onMax}>
                        Max
                    </button>
                </div>
            </div>
            <div className="f_r_b gap-1">
                <div className="f_r_l">
                    <div className="i_icon_40 m_r_8" style={{ backgroundImage: `url(${tokenIcon})` }} />
                    <div className="h4">{tokenSymbol}</div>
                </div>
                <div className="w-full">
                    <NumberPicker
                        formatter={numberInputValueFormat}
                        placeholder={'0.0'}
                        value={inputValue}
                        step={1}
                        precision={8}
                        min={0}
                        max={9999999999}
                        stringMode={true}
                        className={
                            'number text-primary-black font-sbold font-semibold text-base md:text-lg lg:text-2xl float-right w-36 md:w-full'
                        }
                        style={{ textAlign: 'end' }}
                    />
                </div>
            </div>
            <div className="f_r_r">
                <div className="f_14 cg">~${inputValueUsd}</div>
            </div>
        </div>
    );
};

export default TokenWidget;
