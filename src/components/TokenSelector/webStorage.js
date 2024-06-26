import { getLocalStorage, saveToLocalStorage } from 'utils/LocalStorage';
const TOKEN_LOCAL_STORAGE_KEY = 'IMPORTED_TOKENS_IN_LOCAL_STORAGE';
export const saveImpotedToken = (tokenObj, chainId) => {
    const cache = {};
    const cacheTokenList = cache[chainId] || [];
    const newCache = { ...cache, [chainId]: [...cacheTokenList, tokenObj] };
    saveToLocalStorage(TOKEN_LOCAL_STORAGE_KEY, newCache);
};
export const getImportedToken = (chainId) => {
    const cache = getLocalStorage(TOKEN_LOCAL_STORAGE_KEY);
    return cache[chainId] || [];
};
