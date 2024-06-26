import './index.scss';

import React, {useContext} from 'react';
import CoinIcon from "../Coin/CoinIcon";
import { useNavigate } from 'react-router-dom';
import InstrumentContext from "../InstrumentProvider/InstrumentContext";

export const InstrumentTokenPair = ({instrument, onSelected, className='', coinClassName='coin_icon_24', tokenPairClassName=''}) => {
    const navigate = useNavigate();
    const instrumentContext = useContext(InstrumentContext);

    const onInstrumentChange = () => {
        instrumentContext.dispatch(instrument?.instrumentCode);

        onSelected && onSelected(instrument);
        navigate(`/trade?instrumentCode=${instrument?.instrumentCode}`);
    };

    return (
        <div className={`f_r_l cp token_pair_container ${className}`} onClick={onInstrumentChange}>
            <CoinIcon logo={instrument?.tokenA?.logoURI} className={coinClassName} />
            <div className={`m_l_10 b c_hl ${tokenPairClassName}`}>{`${instrument?.tokenA?.localName} / ${instrument?.tokenB?.localName}`}</div>
        </div>
    );
};

export const InstrumentTokenPairForOrderTable = ({instrument}) => {
    return (
        <InstrumentTokenPair instrument={instrument} coinClassName={'coin_icon_20'} tokenPairClassName={`token_pair_name cp`} />
    );
};

export const InstrumentTokenPairSample = ({instrument, className='', coinClassName='coin_icon_24', tokenPairClassName=''}) => {
    return (
        <div className={`f_r_l cp token_pair_container ${className}`}>
            <CoinIcon logo={instrument?.tokenA?.logoURI} className={coinClassName} />
            <div className={`m_l_10 b c_hl ${tokenPairClassName}`}>{`${instrument?.tokenA?.localName}`}</div>
        </div>
    );
};