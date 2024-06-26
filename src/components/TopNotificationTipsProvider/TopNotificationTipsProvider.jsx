import './index.scss';

import React, {useContext, useEffect, useMemo, useState} from 'react';
import TopNotificationTipsContext from './TopNotificationTipsContext';
import {isMobile} from "../../utils/checkDevice";
import {TopNotificationState} from "./TopNotificationState";
import NotificationContext from "../NotificationProvider/NotificationContext";
import {NotificationPosition} from "../NotificationProvider/NotificationState";

const defaultNotification = {
    id: '0',
    state: TopNotificationState.tips, // state: [pending|success|failed|warning]
    content: 'content',
    timestamp: 0,
    customContentRender: undefined,
    onNotificationClose: () => {},
};

const TopNotificationTipsProvider = (props) => {
    const notificationContext = useContext(NotificationContext);

    const [notificationsBoxOffset, setNotificationsBoxOffset] = useState({});
    const [notifications, setNotifications] = useState([]);

    const onResetNotificationsBoxOffset = () => {
        // console.log(`offset`, window.scrollY);
        let defaultTop = isMobile() ? 115 : 50;
        let position = window.scrollY >= defaultTop ? 'fixed' : 'relative';
        setNotificationsBoxOffset({
            position: position,
        });
    };
    useEffect(() => {
        onResetNotificationsBoxOffset();
    }, [notifications.length]);

    const onPageScroll = () => {
        onResetNotificationsBoxOffset();
    };
    useEffect(() => {
        window.addEventListener('scroll', onPageScroll, true);
        return () => {
            window.removeEventListener('scroll', onPageScroll);
        }
    }, []);

    const onNotificationsChange = (notification, action) => {
        // console.debug(`top notification =>`, notification, `action =>`, action);

        if(action !== 'remove'){
            let _notifications = [];

            if(notification?.id !== undefined){
                _notifications = notifications.filter(_notification => {
                    return _notification?.id !== notification?.id;
                });
            } else {
                _notifications = notifications;
            }

            let _notification = {
                ...notification,
                timestamp: new Date().getTime(),
            };

            _notifications.push(_notification);
            setNotifications(_notifications);

            notificationContext && notificationContext.dispatch(undefined, NotificationPosition.underTopBar);
        } else {
            onRemoveNotification(notification, action);
        }
    };

    const onRemoveNotification = (notification, action) => {
        // console.debug(`notifications =>`, notifications);

        let _notifications = notifications.filter(_notification => {
            return _notification?.id !== notification?.id;
        });

        setNotifications(_notifications);

        if(!_notifications.length){
            notificationContext && notificationContext.dispatch(undefined, NotificationPosition.top);
        }

        action !== 'remove' && notification.onNotificationClose && notification.onNotificationClose();
    };

    useEffect(() => {
        // onNotificationsChange(defaultNotification);
    }, []);

    const contextWrapper = useMemo(
        () => ({
            dispatch: onNotificationsChange,
        }),
        [notifications],
    );


    return (
        <TopNotificationTipsContext.Provider value={contextWrapper}>
            <div className={`f_c_l_c w_100 top_notification_box ${notifications.length ? 'top_notification_box_has_items' : ''}`} style={notificationsBoxOffset}>
                {notifications.map((notification, index) => {
                    let zIndex = {
                        zIndex: 13 + index
                    };

                    return (
                        <div className={`f_r_c w_100 n_item n_b_${notification.state}`} style={zIndex} key={index}>
                            <div className={'section'}>
                                {notification.customContentRender ? notification.customContentRender : notification.content }
                            </div>

                            <div className={`i_icon_24 i_close_w cp`} onClick={()=>{onRemoveNotification(notification)}}></div>
                        </div>
                    );
                })}
            </div>

            {props.children}
        </TopNotificationTipsContext.Provider>
    );
};

export default TopNotificationTipsProvider;
