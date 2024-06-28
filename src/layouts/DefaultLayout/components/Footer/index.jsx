import React, { useState } from 'react';
import './index.scss';
import {useIntl} from "../../../../components/i18n";

const FooterLinksConfig = [
    {
        name: 'Trade',
        nameI18nKey: 'commons.footer.links.trade',
        link: '/trade',
        target: '_self',
    },
    {
        name: 'Earn',
        nameI18nKey: 'commons.footer.links.earn',
        link: '/earn/overview',
        target: '_self',
    },
    // {
    //     name: 'Staking',
    //     nameI18nKey: 'commons.footer.links.staking',
    //     link: '/staking/vedrx_staking',
    //     target: '_self',
    // },
    {
        name: 'Docs',
        nameI18nKey: 'commons.footer.links.docs',
        link: 'https://docs.drake.exchange/',
        target: '_blank',
    },
    {
        name: 'Whitepaper',
        nameI18nKey: 'commons.footer.links.whitepaper',
        link: '#',
        target: '_blank',
    },
];

const FooterLinks = () => {
    const intl = useIntl();

    return (
        <div className="f_r_c  flex-wrap  gap-8 f_links">
            {FooterLinksConfig.map((item) => (
                <a key={item.name} href={item.link} target={item.target} rel="noreferrer" className={'f_16 c_mark link'}>{`${intl.get(item.nameI18nKey)}`}</a>
            ))}
        </div>
    );
};

const FooterSocialMediaLinksConfig = [
    {
        name: 'Discord',
        icon: 'i_social_media_discord',
        link: 'https://discord.gg/ZtKakXFu7m',
    },
    {
        name: 'Twitter',
        icon: 'i_social_media_twitter',
        link: 'https://x.com/DrakeExchange',
    },
    // {
    //     name: 'Telegram',
    //     icon: 'i_social_media_telegram',
    //     link: '#',
    // },
    {
        name: 'Warpcast',
        icon: 'i_social_media_warpcast',
        link: 'https://warpcast.com/drake-exchange',
    },
    {
        name: 'GitHub',
        icon: 'i_social_media_gitHub',
        link: 'https://github.com/drxprotocol',
    },
];

const FooterSocialMediaLinks = () => (
    <div className="w-full f_r_c f_sm_links">
        <div className={'f_r_c flex-wrap gap-6 r_90 squircle_border links'}>
            {FooterSocialMediaLinksConfig.map((item) => (
                <a key={item.name} href={item.link} target="_blank" rel="noreferrer" className={`i_icon_a i_icon_32 ${item.icon}`}>
                </a>
            ))}
        </div>
    </div>
);

export default ({ layout }) => {
    let today = new Date();
    let year = today.getFullYear();

    return (
        <div className="w-full f_r_c footer_container">
            <div className={'section footer_section'}>
                <div className={'section_container f_c_c_c'}>
                    <a href={'/'} className={'i_icon_a icon_website_logo_gray'}></a>

                    <FooterLinks/>
                    <FooterSocialMediaLinks/>

                    <div className="f_cg c c_mark">{`© ${year} Drake exchange. All rights reserved.`}</div>
                </div>
            </div>
        </div>
    );
};
