import './index.scss';

const coinIconMap = {
    ETH: 'coin_icon_eth',
};

const getCoinIcon = (assetName) => {
    return coinIconMap[assetName] || '';
};

export default getCoinIcon;
