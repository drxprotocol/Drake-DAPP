import React, { useContext, useEffect, useState, useMemo } from 'react';
import {getLocalStorage, saveToLocalStorage} from "../../../../../utils/LocalStorage";
import ConditionDisplay from "../../../../../components/ConditionDisplay";
import {getCurrentLanguageConfig, languageList, useIntl} from "../../../../../components/i18n";
import I18nContext from "../../../../../components/i18n/I18nContext";
import EnableDemoTradingDialog from "../../../../../components/Modals/EnableDemoTradingDialog";
import {useEthers} from "@usedapp/core";
import {DefaultChain} from "../../../../../contract/ChainConfig";
import DemoTradingContext from "../../../../../components/DemoTradingProvider/DemoTradingContext";
import { Popover } from 'antd';
import UIThemeContext from "../../../../../components/UIThemeProvider/UIThemeContext";
import {UIThemeConfigs} from "../../../../../components/UIThemeProvider/UIThemeConfig";
import WebThreeContext from "../../../../../components/WebThreeProvider/WebThreeContext";
import ContractConfig from "../../../../../contract/ContractConfig";
import {useConfiguredContractSend, useContractCalls} from "../../../../../components/ContractHooks";
import ApplicationConfig from "../../../../../ApplicationConfig";

const DemoTradingSetting = () => {
    const {switchNetwork} = useEthers();

    const demoTradingContext = useContext(DemoTradingContext);

    const [showDialog, setShowDialog] = useState(false);

    const doEnable = async () => {
        if(!demoTradingContext?.enable){
            setShowDialog(true);
        } else {
            let chainId = DefaultChain.chainId;
            await switchNetwork(chainId);

            demoTradingContext.dispatch(false);
        }
    };

    const onEnable = () => {
        demoTradingContext.dispatch(true);
        setShowDialog(false);
    };

    return (
        <>
            <div className={'f_c_l c_p_12 r_12 bg_tag_hover cp settings_item'} onClick={doEnable}>
                <div className={'f_r_b'}>
                    <div className={`i_icon_24 i_graph`}></div>
                    <div className={`cp ${demoTradingContext?.enable ? 'i_demo_trading_enable' : 'i_demo_trading_disable'}`}></div>
                </div>

                <div className={'m_t_15 f_16 c_c'}>{`Demo trading`}</div>
                <div className={'m_t_5 c_link_g'}>{`Test & Learn`}</div>
            </div>

            <EnableDemoTradingDialog isOpen={showDialog} onClose={() => {
                setShowDialog(false)
            }} onEnable={onEnable}/>
        </>
    );
};

const CMPRepayModeSetting = () => {
    const web3Context = useContext(WebThreeContext);
    const [enableAutoBorrow, setEnableAutoBorrow] = useState(true);
    const [enableAutoBorrowSetting, setEnableAutoBorrowSetting] = useState(true);
    const [cmpAddress, setCMPAddress] = useState('');

    const getCMPPortfolioCalls = useMemo(() => {
        let calls = [];

        if (web3Context.account) {
            let contractConfig = ContractConfig.TradingMeta.CrossMarginPortfolioFactory;
            calls.push({
                contract: contractConfig,
                callMethod: 'crossMarginPortfolio',
                args: [web3Context.account]
            });
        }

        return calls;
    }, [web3Context]);
    const getCMPCallsResult = useContractCalls(getCMPPortfolioCalls) ?? [];

    useEffect(() => {
        if (getCMPCallsResult && getCMPCallsResult.length && getCMPCallsResult[0]) {
            if (getCMPCallsResult[0].length) {
                // console.debug(`getCMPCallsResult =>`, getCMPCallsResult);
                let _portfolioAddress = getCMPCallsResult[0][0];
                // console.info(`crossMarginPortfolioAddress =>`, _portfolioAddress);
                setCMPAddress(_portfolioAddress);
            } else {
                setCMPAddress('');
            }
        }
    }, [getCMPCallsResult]);


    const [enableBorrowModeSetting, setEnableBorrowModeSetting] = useState(false);


    const getCMPBorrowModeCalls = useMemo(() => {
        let calls = [];

        if (web3Context.account && cmpAddress && cmpAddress !== ApplicationConfig.emptyContractAddress) {
            let contractConfig = ContractConfig.TradingMeta.CMPAutoRepayManager;
            calls.push({
                contract: contractConfig,
                callMethod: 'isInNonBorrowMode',
                args: [cmpAddress]
            });
        }

        return calls;
    }, [web3Context, cmpAddress]);
    const getCMPBorrowModeCallsResult = useContractCalls(getCMPBorrowModeCalls) ?? [];
    useEffect(() => {
        if (getCMPBorrowModeCallsResult && getCMPBorrowModeCallsResult.length && getCMPBorrowModeCallsResult[0]) {
            if (getCMPBorrowModeCallsResult[0].length) {
                // console.debug(`getCMPBorrowModeCallsResult =>`, getCMPBorrowModeCallsResult);
                let isInNonBorrowMode = getCMPBorrowModeCallsResult[0][0];
                // console.info(`crossMarginPortfolioAddress =>`, cmpAddress, `isInNonBorrowMode =>`, isInNonBorrowMode);

                setEnableAutoBorrow(!isInNonBorrowMode);
            } else {
                setEnableAutoBorrow(true);
            }
        }
    }, [getCMPBorrowModeCallsResult]);
    useEffect(() => {
        setEnableAutoBorrowSetting(enableAutoBorrow);
    }, [enableAutoBorrow]);


    const {sendTx: sendBorrowModeSetting} = useConfiguredContractSend(
        ContractConfig.TradingMeta.CMPAutoRepayManager,
        'changeBorrowMode',
        'Change Borrow Mode on Cross Margin',
    );

    const onEnableAutoBorrowSwitch = (_enableAutoBorrow) => {
        if(cmpAddress && cmpAddress !== ApplicationConfig.emptyContractAddress){
            setEnableAutoBorrowSetting(_enableAutoBorrow);

            onBorrowModeSetting(_enableAutoBorrow);
        }
    };

    const onBorrowModeSetting = (_enableAutoBorrow) => {
        let cmp = cmpAddress;
        let mode = _enableAutoBorrow ? 0 : 1;
        let modeStr = _enableAutoBorrow ? 'Auto Borrow Mode' : 'Non Borrow Mode';

        console.debug(
            `changeBorrowMode: cmpAddress =>`, cmpAddress,
            `mode =>`, mode,
        );

        let txContent = `Change Borrow Mode to ${modeStr} on Cross Margin`;
        sendBorrowModeSetting(txContent, cmp, mode);
    };

    return enableBorrowModeSetting && (
        <div className={'f_r_b m_t_16'}>
            <div className={'f_14'}>{`Auto Borrow on Cross Margin`}</div>
            <div
                className={`cp ${enableAutoBorrowSetting ? 'i_demo_trading_enable' : 'i_demo_trading_disable'}`}
                onClick={() => {onEnableAutoBorrowSwitch(!enableAutoBorrow)}}
            ></div>
        </div>
    );
};

const SettingsPopup = ({closeAllSettingItems, onClose}) => {
    const intl = useIntl();

    const uiThemeContext = useContext(UIThemeContext);
    const [theme, setTheme] = useState(uiThemeContext?.theme || UIThemeConfigs[0]);
    const [language, setLanguage] = useState(languageList[0]);

    const [showTheme, setShowTheme] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);

    useEffect(() => {
        if(closeAllSettingItems){
            setShowTheme(false);
            setShowLanguage(false);
        }
    }, [closeAllSettingItems]);

    const needToConfirmCacheKey = 'NEED_TO_CONFIRM_ORDER';
    const [enableOrderConfirmation, setEnableOrderConfirmation] = useState(true);

    const i18nContext = useContext(I18nContext);

    const changeThemeEvent = (themeName) => {
        let filters = UIThemeConfigs.filter(config => {
            return config.name === themeName;
        });
        if(filters.length){
            let themeConfig = filters[0];

            setTheme(themeConfig);
            uiThemeContext.dispatch(themeConfig);
        }
    };

    const changeLanguageEvent = (lang) => {
        setLanguage(lang);
        i18nContext.dispatch(lang.value);

        setTimeout(() => {
            window.location.reload(); // todo need to research that how to reset the language without refresh the page.
        }, 500);
    };

    const onEnableOrderConfirmation = (enable) => {
        setEnableOrderConfirmation(enable);
        saveToLocalStorage(needToConfirmCacheKey, enable);
    };

    useEffect(() => {
        let themeName = uiThemeContext?.theme?.name;
        changeThemeEvent(themeName);

        let _language = getCurrentLanguageConfig();
        setLanguage(_language);

        let enableOrderConfirmationCache = getLocalStorage(needToConfirmCacheKey);
        let _enableOrderConfirmation = enableOrderConfirmationCache === false ? false : true;
        setEnableOrderConfirmation(_enableOrderConfirmation);
    }, []);

    return (
        <div className={'f_c_l settings_container'}>
            <ConditionDisplay display={!showTheme && !showLanguage}>
                <div className={'f_c_l default_container_p_s settings_content'}>
                    <div className={'f_c_l p_16'}>
                        <div className={'f_r_b'}>
                            <div className={'f_16 b c_high_light'}>{intl.get(`commons.component.settings.title`)}</div>
                            <div className={'cp i_icon_24 i_close'} onClick={() => {onClose && onClose()}}></div>
                        </div>

                        <div className={'f_r_b m_t_15'}>
                            <div className={'f_c_l c_p_12 r_12 bg_tag_hover cp settings_item'} onClick={() => {setShowTheme(!showTheme)}}>
                                <div className={'f_r_b'}>
                                    <div className={`i_icon_24 ${theme.icon}`}></div>
                                    <div className={'cp i_icon_24 i_arrow_right_gray'}></div>
                                </div>

                                <div className={'m_t_15 f_16 c_c'}>{intl.get(`commons.component.settings.theme`)}</div>
                                <div className={'m_t_5 c_link_g'}>{intl.get(theme.nameI18nKey)}</div>
                            </div>

                            <div className={'f_c_l c_p_12 r_12 bg_tag_hover cp settings_item'} onClick={() => {setShowLanguage(!showLanguage)}}>
                                <div className={'f_r_b'}>
                                    <div className={'i_icon_24 i_global'}></div>
                                    <div className={'cp i_icon_24 i_arrow_right_gray'}></div>
                                </div>

                                <div className={'m_t_15 f_16 c_c'}>{intl.get(`commons.component.settings.language`)}</div>
                                <div className={'m_t_5 c_link_g'}>{language.label}</div>
                            </div>
                        </div>

                        <div className={'f_r_b m_t_15'}>
                            <DemoTradingSetting/>
                        </div>
                    </div>

                    <div className={'f_c_l p_16 settings_content_split'}>
                        <div className={'f_r_b'}>
                            <div className={'f_14'}>{`Order confirmation`}</div>
                            <div className={`cp ${enableOrderConfirmation ? 'i_demo_trading_enable' : 'i_demo_trading_disable'}`} onClick={() => {onEnableOrderConfirmation(!enableOrderConfirmation)}}></div>
                        </div>

                        <CMPRepayModeSetting/>
                    </div>
                </div>
            </ConditionDisplay>

            <ConditionDisplay display={showTheme}>
                <div className={'f_c_l default_container_p_s settings_content'}>
                    <div className={'f_c_l p_16'}>
                        <div className={'f_r_l'}>
                            <div className={'cp i_icon_24 i_arrow_left_gray'} onClick={() => {setShowTheme(false)}}></div>
                            <div className={'w_100 text_center b f_16 c_high_light'}>{intl.get(`commons.component.settings.theme.title`)}</div>
                        </div>

                        <div className={'f_c_l m_t_5'}>
                            {UIThemeConfigs.map((themeConfig) => {
                                let isCurrentTheme = themeConfig.name === theme.name;

                                return (
                                    <div key={themeConfig.name} className={`f_r_b c_p_12 r_12 cp m_t_10 ${isCurrentTheme ? 'c_c bg_tag_hover' : 'c_mark'}`}
                                         onClick={() => {changeThemeEvent(themeConfig.name)}}>
                                        <div className={'f_r_l'}>
                                            <div className={`i_icon_24 ${themeConfig.icon}`}></div>
                                            <div className={'m_l_10'}>{intl.get(themeConfig.nameI18nKey)}</div>
                                        </div>
                                        {isCurrentTheme && (
                                            <div className={'i_icon_24 i_checked'}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ConditionDisplay>

            <ConditionDisplay display={showLanguage}>
                <div className={'f_c_l default_container_p_s settings_content'}>
                    <div className={'f_c_l p_16'}>
                        <div className={'f_r_l'}>
                            <div className={'cp i_icon_24 i_arrow_left_gray'} onClick={() => {setShowLanguage(false)}}></div>
                            <div className={'w_100 text_center b f_16 c_high_light'}>{intl.get(`commons.component.settings.language.title`)}</div>
                        </div>

                        <div className={'f_c_l m_t_15'}>
                            {languageList.map((lang, index) => {
                                let isCurrentLang = lang.label === language.label;
                                return (
                                    <div key={index} className={`f_r_b c_p_12 r_12 cp m_5_10 ${isCurrentLang ? 'c_c bg_tag_hover' : 'c_mark'}`}
                                         onClick={() => {changeLanguageEvent(lang)}}>
                                        <div className={'f_r_l'}>
                                            <div className={`s_l_icon ${lang.icon}`}></div>
                                            <div className={'m_l_10'}>{lang.label}</div>
                                        </div>
                                        {isCurrentLang && <div className={'i_icon_24 i_checked'}></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ConditionDisplay>
        </div>
    );
};

const Settings = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [closeAllSettingItems, setCloseAllSettingItems] = useState(false);

    const handleOpenChange = (show) => {
        if(!show){
            setTimeout(() => {
                setShowSettings(show);
                console.debug(`showSettings =>`, show);
            }, 100);

            setCloseAllSettingItems(() => {
                return true;
            });
        } else {
            setShowSettings(show);
            setCloseAllSettingItems(false);
        }
    };
    const onClose = () => {
        handleOpenChange(false);
    };

    return (
        <Popover
            content={<SettingsPopup closeAllSettingItems={closeAllSettingItems} onClose={onClose}/>}
            trigger="click"
            open={showSettings}
            onOpenChange={handleOpenChange}
            overlayClassName={'overlay_container settings_view_pop'}
            arrow={false}
            placement="bottomRight"
        >
            <div className={'settings_btn'}>
                <div className={'i_icon_24 i_icon_24_b i_settings'}></div>
            </div>
        </Popover>
    );
};

export default Settings;