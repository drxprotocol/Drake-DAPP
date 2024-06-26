import './index.scss';

import React, {useMemo, useRef, useState, useEffect,} from 'react';
import NotificationContext from './NotificationContext';
import ApplicationConfig from "../../ApplicationConfig";
import {isMobile} from "../../utils/checkDevice";
import {NotificationPosition, NotificationState} from "./NotificationState";

const defaultNotification = {
    id: '0',
    state: NotificationState.success, // state: [pending|success|failed|warning]
    title: 'title',
    content: 'content',
    timestamp: 0,
    operations: <div></div>,
};

const NotificationProvider = (props) => {
    const notificationRootBoxRef = useRef(null);
    const [notificationsBoxOffset, setNotificationsBoxOffset] = useState({});
    const [notificationsPosition, setNotificationsPosition] = useState(NotificationPosition.top);
    const [notifications, setNotifications] = useState([]);
    const [nextRemoveTriggerId, setNextRemoveTriggerId] = useState(0);
    const [removeTriggerId, setRemoveTriggerId] = useState(0);
    const [hoveredNotificationId, setHoveredNotificationId] = useState('');

    const onResetNotificationsBoxOffset = () => {
        // console.log(`offset`, window.scrollY);
        let defaultTop = isMobile() ? 115 : 80;
        if(notificationsPosition === NotificationPosition.underTopBar){
            defaultTop = defaultTop + 48;
        }

        let boxOffsetTop = window.scrollY >= defaultTop ? 10 : defaultTop;
        if(notificationRootBoxRef?.current){
            let boxOffsetLeft = notificationRootBoxRef.current.offsetLeft;
            setNotificationsBoxOffset({
                top: `${boxOffsetTop}px`,
                right: `${boxOffsetLeft}px`,
            });
        }
    };
    useEffect(() => {
        onResetNotificationsBoxOffset();
    }, [notifications.length, notificationsPosition]);

    const onPageScroll = () => {
        onResetNotificationsBoxOffset();
    };
    useEffect(() => {
        window.addEventListener('scroll', onPageScroll, true);
        return () => {
            window.removeEventListener('scroll', onPageScroll);
        }
    }, []);

    const onNotificationsChange = (notification, position) => {
        if(position){
            setNotificationsPosition(() => {
                return position;
            });
        }

        if(notification){
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

            _notifications.unshift(_notification);
            setNotifications(_notifications);

            if(notification.state !== NotificationState.pending){
                let _removeTriggerId = nextRemoveTriggerId + 1;
                setNextRemoveTriggerId(_removeTriggerId);

                setTimeout(() => {
                    console.debug(`nextRemoveTriggerId =>`, nextRemoveTriggerId, `removeTriggerId =>`, _removeTriggerId);
                    setRemoveTriggerId(_removeTriggerId);
                }, ApplicationConfig.defaultTimeoutToCloseTXWindow);
            }
        }
    };

    const onRemoveNotification = (notification) => {
        // console.debug(`notifications =>`, notifications);

        let _notifications = notifications.filter(_notification => {
            return _notification?.id !== notification?.id;
        });

        setNotifications(_notifications);
    };

    useEffect(() => {
        console.debug(
            `removeTriggerId =>`, removeTriggerId,
            `notifications =>`, notifications,
            `hoveredNotificationId =>`, hoveredNotificationId,
        );

        let now = new Date().getTime();
        let _notifications = notifications.filter(_notification => {
            let over = (_notification.timestamp + ApplicationConfig.defaultTimeoutToCloseTXWindow) <= now;
            let isNotPending = _notification.state !== NotificationState.pending;
            let notHover = _notification.id !== hoveredNotificationId;
            let needToRemove = over && notHover && isNotPending;
            return !needToRemove;
        });

        setNotifications(_notifications);
    }, [removeTriggerId]);

    const onNotificationHover = (notification) => {
        setHoveredNotificationId(notification?.id || '');
    };

    const onNotificationHoverOut = (e) => {
        e && e.stopPropagation();

        setHoveredNotificationId('');

        let _removeTriggerId = nextRemoveTriggerId + 1;
        setNextRemoveTriggerId(_removeTriggerId);

        setTimeout(() => {
            // console.debug(`onNotificationHoverOut: nextRemoveTriggerId =>`, nextRemoveTriggerId, `removeTriggerId =>`, _removeTriggerId);
            setRemoveTriggerId(_removeTriggerId);
        }, ApplicationConfig.defaultTimeoutToCloseTXWindow);
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
        <NotificationContext.Provider value={contextWrapper}>
            <div className={`overlay_container`}>
                <div className={`f_c_l_c w_100`}>
                    <div className={`f_r_l section notification_root`} ref={notificationRootBoxRef}>
                        <div className={`notification_box`} style={notificationsBoxOffset}>
                            {notifications.map((notification, index) => {
                                return (
                                    <div className={`f_r_b_t n_box r_12 squircle_border n_b_${notification.state}`} key={index} onMouseOver={()=>{onNotificationHover(notification)}} onMouseOut={onNotificationHoverOut}>
                                        <div className={`f_r_l_t`}>
                                            <div className={`n_icon icon_n_${notification.state}`}></div>
                                            <div className={`f_c_l m_l_8`}>
                                                <div className={`n_title b f_16`}>{notification.title}</div>
                                                <div className={`n_content f_14`}>{notification.content}</div>
                                            </div>
                                        </div>
                                        <div className={`f_r_l`}>
                                            {notification.operations}
                                            <div className={`i_icon_24 i_close cp`} onClick={()=>{onRemoveNotification(notification)}}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {props.children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;