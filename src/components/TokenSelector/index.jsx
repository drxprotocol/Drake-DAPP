import './index.scss';

import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { debounce } from 'debounce';
import { useTokenList } from '@usedapp/core';
import DefaultLogo from '../../assets/img/icon_default_coin_logo.svg';
import ConditionDisplay from '../ConditionDisplay';
import { toMainnetChainId } from '../../contract/ChainConfig';
import ApplicationConfig from '../../ApplicationConfig';
import { getToken } from '../../contract/TokenContract';
import { useToken } from '../../hooks/useToken';
import { useMemo } from 'react';
import Button from 'components/Button';
import ImportToken from './ImportToken';
import useFakeLoader from '../../hooks/useFakeLoader';
import { getImportedToken, saveImpotedToken } from './webStorage';
import { DappTokenLogosMap, useTokenLogo } from '../../hooks/useTokenInfo';

const UNISWAP_DEFAULT_TOKEN_LIST_URI = ApplicationConfig.tokenListURIUniswap;

const wait = async (ms) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

const TokenSelector = ({ open, setOpen, chainId, activeToken }) => {
    const _chainId = toMainnetChainId(chainId);
    const { tokens } = useTokenList(UNISWAP_DEFAULT_TOKEN_LIST_URI, toMainnetChainId(chainId)) || {};
    const [isOpenImportToken, setOpenImportToken] = useState(false);
    const [searchAddress, setSearchAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { isLoading, reload: resetLoading } = useFakeLoader(2000);
    const [errorMsg, setErrorMsg] = useState('');

    let searchedToken = useToken(searchAddress);

    searchedToken = useMemo(() => {
        return (
            searchedToken && {
                ...searchedToken,
                address: searchAddress,
                logoURI: useTokenLogo(searchAddress),
                chainId: _chainId,
            }
        );
    }, [searchedToken]);

    const [tokensExpand, setTokensExpand] = useState([]);
    const [tokenList, setTokenList] = useState([]);

    const onSearch = debounce((event) => {
        let keywards = event.target.value;

        if (keywards === '' || keywards === undefined) {
            setTokenList(tokensExpand);
            setErrorMsg('');
            return;
        }

        keywards = keywards.toLocaleLowerCase();
        let searchTokens =
            tokensExpand.filter((item) => {
                return (
                    item.name.toLocaleLowerCase().indexOf(keywards) >= 0 ||
                    item.localName.toLocaleLowerCase().indexOf(keywards) >= 0 ||
                    item.symbol.toLocaleLowerCase().indexOf(keywards) >= 0 ||
                    item.address.toLocaleLowerCase().indexOf(keywards) >= 0
                );
            }) || [];

        setTokenList(searchTokens);
        if (searchTokens.length === 0) {
            if (keywards.toLocaleLowerCase().startsWith('0x') && keywards.length === 42) {
                setSearchAddress(keywards);
                resetLoading();
                setErrorMsg('');
            } else {
                setSearchAddress('');
                setErrorMsg('Token address wrong');
            }
        } else {
            setSearchAddress('');
            setErrorMsg('');
        }
    }, ApplicationConfig.defaultDebounceWait);

    const onSelect = async (token) => {
        if (isOpenImportToken) {
            setOpenImportToken(false);
            saveImpotedToken(token, _chainId);
            await wait(500);
            getTokenList();
            setSearchAddress('');
        }
        setSearchTerm('');
        setTokenList(tokensExpand);
        activeToken(token);
        setOpen(false);
    };

    const expand = () => {
        const expandedTokens = ApplicationConfig.expandTokens.map((token) => {
            let address = getToken(token, _chainId).address;
            let logo = DappTokenLogosMap[address.toLocaleLowerCase()] || DefaultLogo;
            return {
                chainId: _chainId,
                address: address,
                name: token,
                symbol: token,
                logoURI: logo,
                decimals: 18,
                fromWebsite: true,
                isPreloaded: true,
            };
        });

        const cachedTokens = getImportedToken(_chainId).map((token) => ({
            ...token,
            isImported: true,
        }));

        return [...expandedTokens.concat(tokens || []), ...cachedTokens];
    };
    const getTokenList = () => {
        let _tokens = expand();

        setTokenList(_tokens);
        setTokensExpand(_tokens);
    };

    useEffect(() => {
        getTokenList();
    }, [tokens]);

    return (
        <Modal
            title=""
            footer={null}
            open={open}
            width={576}
            onCancel={() => setOpen(false)}
            className={'overlay_container common_modal token_selector_modal'}
        >
            <div className={'f_r_l h3 m_title'}>
                <div
                    className={'i_icon_32 i_icon_button i_arrow_left'}
                    onClick={() => {
                        setOpen(false);
                    }}
                ></div>
                <div>Choose a token</div>
            </div>

            <div className={'f_r_b w-full br_12 search_box'}>
                <Input
                    placeholder={'Search token name or paste token address'}
                    className={'w-full s_input'}
                    value={searchTerm}
                    onChange={(event) => {
                        onSearch(event);
                        setSearchTerm(event.target.value);
                    }}
                />

                <div className={'i_icon_24 i_icon_button i_search'}></div>
            </div>

            <div className={'f_c_l w-full m_t_25'}>
                {!isLoading && !errorMsg && <div className={'cg'}>Tokens</div>}
                {isLoading && searchAddress && (
                    <div className="f_r_l">
                        <span className="i_loading i_icon_24 i_icon_a m_r_8 rotate" />
                        <span className="f_14 f_ms_r cg">Loading token...</span>
                    </div>
                )}
                {!isLoading && errorMsg && (
                    <div className="f_r_l">
                        <span className="i_info_circle_red i_icon_24 i_icon_a m_r_8" />
                        <span className="f_14 f_ms_r cr">{errorMsg}</span>
                    </div>
                )}
                <div className={'f_c_l w-full m_t_15 token_list_box'}>
                    <ConditionDisplay display={tokenList && tokenList.length}>
                        {tokenList &&
                            tokenList.length &&
                            tokenList.map((token, idx) => {
                                let coinLogo = token.logoURI || DefaultLogo;
                                coinLogo = coinLogo.startsWith('ipfs')
                                    ? coinLogo.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                    : coinLogo;

                                return (
                                    <div
                                        key={token.address}
                                        className={`f_r_l token_item ${token.fromWebsite ? 'expanded_token' : ''}`}
                                        data-chain-id={token.chainId}
                                        data-address={token.address}
                                        onClick={() => {
                                            onSelect(token);
                                        }}
                                    >
                                        <div
                                            className={'coin_icon'}
                                            style={{ backgroundImage: `url(${coinLogo})` }}
                                        ></div>
                                        <div className={'f_c_l m_l_10'}>
                                            <div className="f_r_l">
                                                <div className={'h4'}>{token.localName}</div>
                                                <ConditionDisplay display={token?.isImported}>
                                                    <div className="f_12 b imported_label">Imported </div>
                                                </ConditionDisplay>
                                                <ConditionDisplay display={token?.isPreloaded}>
                                                    <div className="m_l_2">*</div>
                                                </ConditionDisplay>
                                            </div>

                                            <div className={'c'}>{token.symbol}</div>
                                        </div>
                                    </div>
                                );
                            })}
                    </ConditionDisplay>
                    <ConditionDisplay display={!!searchedToken && !isLoading}>
                        <div
                            key={searchedToken?.address}
                            className={`f_r_b token_item`}
                            data-address={searchedToken?.address}
                            style={{ cursor: 'inherit' }}
                        >
                            <div className="f_r_l">
                                <div
                                    className={'coin_icon'}
                                    style={{ backgroundImage: `url(${searchedToken?.logoURI})` }}
                                ></div>
                                <div className={'f_c_l m_l_10'}>
                                    <div className={'h4'}>{searchedToken?.localName}</div>
                                    <div className={'c'}>{searchedToken?.symbol}</div>
                                </div>
                            </div>
                            <Button onClick={() => setOpenImportToken(true)}>Import</Button>
                        </div>
                    </ConditionDisplay>
                </div>
            </div>

            {!searchAddress && (
                <>
                    <div className={'f_r_b w-full note c_p_20 r_16 m_t_25'}>
                        <div className={'f_r_l'}>
                            <div className={'i_icon_24 i_note'}></div>
                            <div className={'f_c_l m_l_10'}>
                                <div className={'h4'}>Note</div>
                                <div className={'c'}>This is fetched from uniswap tokenlist</div>
                            </div>
                        </div>
                        <div className={'i_icon_32 i_exchange_uniswap_gray'}></div>
                    </div>
                    <div className="f_14 cg f_ms_r m_t_15">
                        <span className="m_r_4">*</span>
                        <span>This is not fetched from uniswap tokenlist. It is preloaded by the team.</span>
                    </div>
                </>
            )}

            {!!searchedToken && !isLoading && (
                <div className="f_r_l risk_note m_t_25">
                    <span className="i_info_circle_black i_icon_24 i_icon_a m_r_12" />
                    <span className="f_14 f_ms_r">Not a part of uniswap token list. Add at your own risk</span>
                </div>
            )}
            <ImportToken
                isOpen={isOpenImportToken}
                onClose={() => setOpenImportToken(false)}
                token={searchedToken}
                onImport={() => {
                    onSelect(searchedToken);
                }}
            />
        </Modal>
    );
};

export default TokenSelector;
