import { useMemo } from 'react';

import DefaultLogo from '../components/Coin/img/token_default.svg';
import {TokenLogosMap} from "../contract/TokenContract";

export const DappTokenLogosMap = TokenLogosMap;


export const useTokenLogo = (tokenAddress) => {
    return DappTokenLogosMap[tokenAddress.toLocaleLowerCase()] || DefaultLogo;
};

export const fetchTokenLogo = (tokenAddress) => {
    return DappTokenLogosMap[tokenAddress.toLocaleLowerCase()] || DefaultLogo;
};
