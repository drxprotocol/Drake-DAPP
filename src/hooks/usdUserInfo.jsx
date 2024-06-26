import Axios from "axios";
import {useContext, useEffect, useState} from "react";
import WebThreeContext from "../components/WebThreeProvider/WebThreeContext";
import ApplicationConfig from "../ApplicationConfig";
import {getQueryValue} from "../utils/URLUtil";
import {getLocalStorage, saveToLocalStorage} from "../utils/LocalStorage";
import {useAllPortfolioAddress} from "./useTrdingMeta";

const fetchReferralCodeFromDRXAPI = ({address = '', referredCode = '', impAddress = '', cmpAddress = ''}) => {
    return new Promise((resolve, reject) => {
        let url = `/drx-api/referral?address=${address}&impAddress=${impAddress}&cmpAddress=${cmpAddress}`;
        if(referredCode){
            url = `${url}&referredCode=${referredCode}`;
        }

        Axios.get(url)
            .then((response) => {
                console.debug(`fetchReferralCodeFromDRXAPI response =>`, response);

                let referral = response?.data;
                resolve(referral);
            })
            .catch((error) => {
                console.log(error);
                resolve({});
            });
    });
};

const referredCodeCacheKey = 'referredCodeCache';

export const useReferralCode = () => {
    const web3Context = useContext(WebThreeContext);


    const [referralCode, setReferralCode] = useState('');
    const {isolatedActivated, impAddress, crossActivated, cmpAddress} = useAllPortfolioAddress();

    useEffect(() => {
        if (web3Context.account && isolatedActivated && impAddress && crossActivated && cmpAddress) {
            let address = web3Context.account;

            let referredCodeQuery = getQueryValue('referredCode');
            let enableLocalForkSession = getLocalStorage(referredCodeCacheKey);

            let referredCode = referredCodeQuery ? referredCodeQuery : (enableLocalForkSession || '');
            fetchReferralCodeFromDRXAPI({address, referredCode, impAddress, cmpAddress}).then(referral => {
                let _referralCode = referral?.referralCode || '';
                setReferralCode(_referralCode);
            });
        } else {
            setReferralCode('');
        }
    }, [web3Context.account, isolatedActivated, impAddress, crossActivated, cmpAddress]);

    return referralCode;
};

export const cacheReferredCode = () => {
    let referredCodeQuery = getQueryValue('referredCode');
    if(referredCodeQuery){
        saveToLocalStorage(referredCodeCacheKey, referredCodeQuery);
    }
};