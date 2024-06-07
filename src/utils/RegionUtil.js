import axios from 'axios';
import ApplicationConfig from "../ApplicationConfig";
import {getLocalStorage, saveToLocalStorage} from "./LocalStorage";

export function getRegionByIP() {
    let regionCacheKey = 'CURRENT_REGION';
    let regionCache = getLocalStorage(regionCacheKey);

    let getRegionUrl = `https://api.ip.sb/geoip`;

    return new Promise((resolve, reject) => {
        if(regionCache){
            resolve(regionCache);
        }else{
            axios
                .get(getRegionUrl)
                .then((response) => {
                    // log.debug(`response:`);
                    // log.debug(response.request.responseText);

                    if (response && response.data) {
                        let data = response.data;

                        console.debug(`region response => `, data);
                        let countryCode = data?.country_code || 'N/A';
                        saveToLocalStorage(regionCacheKey, countryCode, 5 * 60 * 1000);
                        resolve(countryCode);
                    } else {
                        resolve('N/A');
                    }
                })
                .catch((e) => {
                    console.error(e);

                    resolve('N/A');
                });
        }
    });
}

export function checkBlockedRegion(callback, intercept) {
    let blockedRegions = ApplicationConfig.blockedRegions;

    let blockedRegionsEnv = import.meta.env.VITE_BLOCKED_REGIONS;
    if(blockedRegionsEnv){
        blockedRegions = blockedRegionsEnv.split(',');
    }

    if (!blockedRegions.length || window.location.pathname === '/blocked') {
        callback(true);
        return;
    }

    getRegionByIP().then((countryCode) => {
        console.debug(`blockedRegions =>`, blockedRegions, `Current countryCode =>`, countryCode);

        if (blockedRegions.includes(countryCode)) {
            console.info(`blocked in ${countryCode} region!`);

            if(intercept){
                window.open('/blocked', '_self');
            } else {
                callback(false);
            }
        } else {
            callback(true);
        }
    }).catch((e) => {
        callback(true);
    });
}
