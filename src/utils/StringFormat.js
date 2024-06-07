import { hexlify } from '@ethersproject/bytes';

export function generateAddressSummary(address, headChartCount, tailChartCount = 4) {
    if (!address) {
        return '';
    } else {
        let _headChartCount = headChartCount || 3;
        let addressSummary = `${address.substring(0, _headChartCount)}...${address.substring(
            address.length - tailChartCount,
            address.length,
        )}`;
        return addressSummary;
    }
}

export const encodeFormatData = (data) => {
    let hex = hexlify(data).substr(2);
    let str = '0x';
    for (let i = 0; i < 64 - hex.length; i++) {
        str += '0';
    }
    return str + hex;
};
