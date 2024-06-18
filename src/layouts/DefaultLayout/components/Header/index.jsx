import './index.scss';

import React, { useCallback, useEffect, useState } from 'react';
import useHeaderVO from './HeaderVO';
import {AccountAddress, WalletConnect} from './components/CoinbaseWalletConnect';
import { useContext } from 'react';
import PageInfoContext from '../../../../components/PageInfoProvider/PageInfoContext';
import { Link } from 'react-router-dom';
import ConditionDisplay from '../../../../components/ConditionDisplay';
import Settings from "./components/Settings";
import {useIntl} from "../../../../components/i18n";
import DemoTradingContext from "../../../../components/DemoTradingProvider/DemoTradingContext";
import WebThreeContext from "../../../../components/WebThreeProvider/WebThreeContext";
import {LeftNavMenu} from "../../../../components/Navigation";
import {getLocalStorage, saveToLocalStorage} from "../../../../utils/LocalStorage";
import {TopNotificationState} from "../../../../components/TopNotificationTipsProvider/TopNotificationState";
import TopNotificationTipsContext from "../../../../components/TopNotificationTipsProvider/TopNotificationTipsContext";
import {isMobile} from "../../../../utils/checkDevice";
import ApplicationConfig from "../../../../ApplicationConfig";

const MobilePopupHeader = ({navArr, onClose}) => {
    const pageInfoContext = useContext(PageInfoContext);
    const intl = useIntl();
    const web3Context = useContext(WebThreeContext);

    const [closeSubNavItems, setCloseSubNavItems] = useState(false);

    return (
        <div className={'header_popup'}>
            <div className={'f_r_b'}>
                <div className="f_r_l">
                    <a href="/" className="i_icon_a icon_website_logo_small"></a>
                </div>

                <div className="f_r_c m_l_15 cp default_container_p settings_box" onClick={onClose}>
                    <div className={'cp i_icon_24 i_icon_24_b i_close'}></div>
                </div>
            </div>

            <ConditionDisplay display={web3Context.account}>
                <div className={`f_r_l default_container_p m_t_25`}>
                    <AccountAddress accountIcon={'wallet'}/>
                </div>
            </ConditionDisplay>

            <div className={'f_c_l'}>
                {navArr.map((navItem) => {
                    return (
                        <div key={navItem.key} className="f_c_l">
                            <ConditionDisplay display={!navItem.jump}>
                                <div className={'f_r_b w_100 m_t_25'}>
                                    <div className={''} onClick={onClose}>
                                        <Link
                                            to={navItem.url}
                                            className={`f_18 nav_link c_t ${
                                            navItem.key === pageInfoContext.pageInfo.nav && 'c_c font-semibold font-sbold'
                                                }`}
                                            target={navItem.target}
                                        >
                                            <span>{intl.get(navItem.nav)}</span>
                                        </Link>
                                    </div>

                                    <ConditionDisplay display={navItem.key === pageInfoContext.pageInfo.nav && navItem.subNavItems && navItem.subNavItems.length}>
                                        <div className={`cp i_icon_24 ${closeSubNavItems ? 'i_arrow_down' : 'i_arrow_up'}`} onClick={() => setCloseSubNavItems(!closeSubNavItems)}></div>
                                    </ConditionDisplay>
                                </div>


                                <ConditionDisplay display={navItem.key === pageInfoContext.pageInfo.nav && navItem.subNavItems && navItem.subNavItems.length && !closeSubNavItems}>
                                    <div className={'f_c_l m_t_25 r_16 sub_menu_box'}>
                                        <LeftNavMenu leftMenuItems={navItem.subNavItems} onLinked={onClose}/>
                                    </div>
                                </ConditionDisplay>
                            </ConditionDisplay>

                            <ConditionDisplay display={navItem.jump}>
                                <div className={'f_r_b w_100'}>
                                    <a
                                        href={navItem.url}
                                        className={`f_16 nav_link c_t m_t_25`}
                                        target={navItem.target}
                                    >
                                        <div className="f_r_c">
                                            {navItem.hasIcon ? (
                                                <>
                                                    <div>{intl.get(navItem.nav)}</div>
                                                    <div className={`m_l_3 i_icon_24 ${navItem.hasIcon}`}></div>
                                                </>
                                            ) : (
                                                intl.get(navItem.nav)
                                            )}
                                        </div>
                                    </a>
                                </div>
                            </ConditionDisplay>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const showDemoTradingTipsSectionCacheKey = 'showDemoTradingTipsSection';
const demoTradingTips = {
    id: 'DemoTradingTips',
    state: TopNotificationState.info,
    customContentRender: (
        <div className={`w_100 f_r_c`}>
            <div className={`i_icon_24 i_convert m_r_8`}></div>
            <div>{`You are currently in paper trading mode`}</div>
            <div className={`m_l_8 b`}>{`Change to production mode from settings`}</div>
        </div>
    ),
    onNotificationClose: () => {
        saveToLocalStorage(showDemoTradingTipsSectionCacheKey, 'false', 60 * 60 * 24 * 7 * 1000);
    }
};
const demoTradingTipsForMobile = {
    ...demoTradingTips,
    customContentRender: (
        <div className={`w_100 f_r_c`}>
            <div className={`i_icon_24 i_convert m_r_5`}></div>
            <div>{`You are currently in paper trading mode`}</div>
        </div>
    ),
};

const Header = ({ layout }) => {
    const demoTradingContext = useContext(DemoTradingContext);

    const [navArr] = useHeaderVO();
    const [showMobilePopupWindow, setShowMobilePopupWindow] = useState(false);
    const pageInfoContext = useContext(PageInfoContext);
    const intl = useIntl();

    const topNotificationTipsContext = useContext(TopNotificationTipsContext);

    const showDemoTradingTipsSectionCache = getLocalStorage(showDemoTradingTipsSectionCacheKey);
    useEffect(() => {
        let _demoTradingTips = isMobile() ? demoTradingTipsForMobile : demoTradingTips;
        if(demoTradingContext?.enable && showDemoTradingTipsSectionCache !== 'false'){
            topNotificationTipsContext.dispatch(_demoTradingTips);
        } else {
            topNotificationTipsContext.dispatch(_demoTradingTips, 'remove');
        }
    }, [demoTradingContext?.enable, showDemoTradingTipsSectionCache]);

    return (
        <div className={'w-full f_c_l'}>
            <div className="w-full f_r_c header_container">
                <div className={'section header_section'}>
                    <div className={'section_container f_c_c_l'}>
                        <div className="f_r_b">
                            <div className="f_r_l">
                                <div className="hidden lg:block">
                                    <div className={'f_c_c'}>
                                        <a href="/" className="i_icon_a icon_website_logo"></a>
                                    </div>
                                </div>
                                <div className="lg:hidden">
                                    <a href="/" className="i_icon_a icon_website_logo_small"></a>
                                </div>



                                <ConditionDisplay display={demoTradingContext?.enable}>
                                    <div className="hidden lg:block">
                                        <div className={`m_l_15 i_demo_trading`}></div>
                                    </div>
                                </ConditionDisplay>

                                <div className="hidden lg:flex m_l_40 navs">
                                    <div className={'f_r_l'}>
                                        {navArr.map((navItem) => {
                                            return (
                                                <div key={navItem.key} className="m_r_25">
                                                    <ConditionDisplay display={!navItem.jump}>
                                                        <Link
                                                            to={navItem.url}
                                                            className={`f_16 nav_link c_t ${
                                                            navItem.key === pageInfoContext.pageInfo.nav && 'c_link font-semibold font-sbold'
                                                                }`}
                                                            target={navItem.target}
                                                        >
                                                            <span>{intl.get(navItem.nav)}</span>
                                                        </Link>
                                                    </ConditionDisplay>

                                                    <ConditionDisplay display={navItem.jump}>
                                                        <a
                                                            href={navItem.url}
                                                            className={`f_16 nav_link c_t`}
                                                            target={navItem.target}
                                                        >
                                                            <div className="f_r_c">
                                                                {navItem.hasIcon ? (
                                                                    <>
                                                                        <div>{intl.get(navItem.nav)}</div>
                                                                        <div className={`m_l_3 i_icon_24 ${navItem.hasIcon}`}></div>
                                                                    </>
                                                                ) : (
                                                                    intl.get(navItem.nav)
                                                                )}
                                                            </div>
                                                        </a>
                                                    </ConditionDisplay>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>


                            <ConditionDisplay display={layout !== 'Landing'}>
                                <div className="f_r_l operations">
                                    <div className="hidden lg:block">
                                        <WalletConnect />
                                    </div>
                                    <div className="mobile_connect_box lg:hidden">
                                        <WalletConnect size={'small'} />
                                    </div>


                                    <div className="f_r_c m_l_10 cp default_container settings_box">
                                        <div className={'more_btn_mobile lg:hidden'}>
                                            <div className={'cp i_icon_24 i_icon_24_b i_menu_more'} onClick={() => {setShowMobilePopupWindow(true)}}></div>
                                        </div>
                                        <div className={'settings_split lg:hidden'}></div>

                                        <Settings/>
                                    </div>
                                </div>
                            </ConditionDisplay>

                            <ConditionDisplay display={layout === 'Landing'}>
                                <div className="f_r_l operations">
                                    <div
                                        className={`f_r_b cp r_12 launch_app_btn ${ApplicationConfig.comingSoon ? 'launch_app_btn_disable' : ''}`}
                                        onClick={() => {
                                            window.open("/trade", '_self');
                                        }}
                                    >
                                        <div className={'b'}>{ApplicationConfig.comingSoon ? 'Coming soon' : intl.get(`commons.header.links.launch_app`)}</div>
                                        <div className={'i_icon_24 i_arrow_right_up_w'}></div>
                                    </div>
                                </div>
                            </ConditionDisplay>
                        </div>
                    </div>
                </div>

                <ConditionDisplay display={showMobilePopupWindow}>
                    <MobilePopupHeader navArr={navArr} onClose={() => {setShowMobilePopupWindow(false)}}/>
                </ConditionDisplay>
            </div>
        </div>
    );
};

export default Header;
