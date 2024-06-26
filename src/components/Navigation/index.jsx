import './index.scss';

import React, { useContext, useEffect, useState } from 'react';
import PageInfoContext from "../PageInfoProvider/PageInfoContext";
import { useNavigate } from 'react-router-dom';
import {useIntl} from "../i18n";
import {PORTFOLIO_TYPE} from "../TradingConstant";
import ConditionDisplay from "../ConditionDisplay";

export const LEFT_MENU_ITEMS_FOR_EARN = [
    {
        group: {
            name: 'commons.component.left.menu.earn.items.group.overview.name',
            link: '/earn/overview',
            key: 'about_earn',
        },
        items: [
            {
                key: 'liquidity_earn',
                name: 'commons.component.left.menu.earn.items.group.overview.items.liquidity_earn',
                icon: 'i_link_icon_money',
                link: '/earn/overview',
            },
            {
                key: 'funding_rate_earn',
                name: 'commons.component.left.menu.earn.items.group.overview.items.funding_rate_earn',
                icon: 'i_link_icon_stack',
                link: '/funding_rate_vault/overview',
            },
        ]
    },
    {
        group: {
            name: 'commons.component.left.menu.earn.items.group.earn.name',
            link: '/earn',
            key: 'dusdt_vault',
        },
        items: [
            {
                key: 'dusdc_vault',
                name: 'commons.component.left.menu.earn.items.group.earn.items.dusdc_vault',
                icon: 'i_link_icon_bank_usdc',
                link: '/earn?vault=USDC',
            },
        ]
    },
    {
        group: {
            name: 'commons.component.left.menu.earn.items.group.funding_rate_vault.name',
            link: '#',
            key: 'funding_rate_vault',
            beta: true,
        },
        items: [
            {
                key: 'frusdc_vault',
                name: 'commons.component.left.menu.earn.items.group.funding_rate_vault.items.frusdc_vault',
                icon: 'i_link_icon_frv_usdc',
                link: '/funding_rate_vault?vault=USDC',
            },
        ]
    },
];

export const LEFT_MENU_ITEMS_FOR_STAKING = [
    {
        group: {
            name: 'commons.component.left.menu.staking.items.group.overview.name',
            link: '/earn/overview',
            key: 'about_staking',
        },
        items: [
            {
                key: 'about_staking',
                name: 'commons.component.left.menu.staking.items.group.overview.items.about_staking',
                icon: 'i_link_icon_stack',
                link: '/staking/overview',
            },
        ]
    },
    {
        group: {
            name: 'commons.component.left.menu.staking.items.group.staking.name',
            key: 'vedrx_staking',
        },
        items: [
            {
                key: 'vedrx_staking',
                name: 'commons.component.left.menu.staking.items.group.staking.items.vedrx_staking',
                icon: 'i_link_icon_pulse',
                link: '/staking/vedrx_staking',
            },
        ]
    }
];

export const HEADER_NAV_DATA = [
    {
        key: 'Home',
        url: '/',
        nav: 'commons.header.nav.home',
        className: 'nav_link',
    },
    {
        key: 'Trade',
        url: '/trade',
        nav: 'commons.header.nav.trade',
        className: 'nav_link',
    },
    {
        key: 'Earn',
        url: '/earn/overview',
        nav: 'commons.header.nav.earn',
        className: 'nav_link',
        subNavItems: LEFT_MENU_ITEMS_FOR_EARN,
    },
    // {
    //     key: 'Staking',
    //     url: '/staking/overview',
    //     nav: 'commons.header.nav.staking',
    //     className: 'nav_link',
    // },
    {
        key: 'Leaderboard',
        url: '/leaderboard',
        nav: 'commons.header.nav.leaderboard',
        className: 'nav_link',
    },
    {
        key: 'Statistics',
        url: '#',
        nav: 'commons.header.nav.statistics',
        className: 'nav_link',
    },
    {
        key: 'Doc',
        url: 'https://docs.drake.exchange/',
        nav: 'commons.header.nav.doc',
        className: 'nav_link',
        target: '_blank',
        hasIcon: 'i_external_link',
        jump: true,
    },
];

export const LeftNavMenu = ({onLinked, leftMenuItems = []}) => {
    const intl = useIntl();

    const navigate = useNavigate();
    const [currentMenuItem, setCurrentMenuItem] = useState('');

    const pageInfoContext = useContext(PageInfoContext);
    useEffect(() => {
        // console.debug(`pageInfoContext =>`, pageInfoContext);
        if(pageInfoContext?.pageInfo?.leftNav){
            setCurrentMenuItem(pageInfoContext?.pageInfo?.leftNav);
        }
    }, [pageInfoContext]);

    const linkTo = (link, navKey) => {
        navigate(link);

        let _pageInfoContext = {
            ...pageInfoContext?.pageInfo,
            leftNav: navKey,
        };
        setTimeout(() => {
            pageInfoContext.dispatch(_pageInfoContext);
        },300);

        onLinked && onLinked();
        // window.open(link, '_self');
    };

    return (
        <div className={'f_c_l_c w_100 left_nav_menus gap-10'}>
            {
                leftMenuItems.map((menuGroup) => (
                    <div className={'f_c_l w_100'} key={menuGroup.group.name}>
                        <ConditionDisplay display={menuGroup.group.link}>
                            <div className={'f_r_l cp l_m_item_title'} onClick={()=>linkTo(menuGroup.group.link, menuGroup.group.key)}>
                                <div className={`m_r_5`}>{intl.get(menuGroup.group.name)}</div>
                                <ConditionDisplay display={menuGroup.group.beta}>
                                    <div className={`i_beta`}></div>
                                </ConditionDisplay>
                            </div>
                        </ConditionDisplay>
                        <ConditionDisplay display={!menuGroup.group.link}>
                            <div className={'f_r_l l_m_item_title'}>
                                <div className={`m_r_5`}>{intl.get(menuGroup.group.name)}</div>
                                <ConditionDisplay display={menuGroup.group.beta}>
                                    <div className={`i_beta`}></div>
                                </ConditionDisplay>
                            </div>
                        </ConditionDisplay>

                        <div className={'f_c_l m_t_20 gap-5'}>
                            {
                                menuGroup.items.map(menuItem => (
                                    <div key={menuItem.key} className={`f_r_l cp ${menuItem.icon}_hover_box ${menuItem.key === currentMenuItem && 'active b'}`}>
                                        <div className={`i_icon_24 ${menuItem.icon}`}></div>
                                        <div className={'cp m_l_5 l_m_item_sub_title'} onClick={()=>linkTo(menuItem.link, menuItem.key)}>{intl.get(menuItem.name)}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
};