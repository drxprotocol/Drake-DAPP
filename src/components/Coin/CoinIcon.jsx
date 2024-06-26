import './index.scss';
import DefaultLogo from './img/token_default.svg';
import React from 'react';

const CoinIcon = ({ logo, className = 'coin_icon_24' }) => {
    return <div className={className} style={{ backgroundImage: `url(${logo ? logo : DefaultLogo})` }}></div>;
};

export default CoinIcon;
