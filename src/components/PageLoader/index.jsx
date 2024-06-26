import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';
const PageLoader = ({ wrapperCName, elementCName }) => {
    const eventListeners = useRef();
    const [top, setTop] = useState(69);
    const scrollHandler = useCallback((ev) => {
        var someDiv = document.getElementById('root');
        var distanceToTop = someDiv.getBoundingClientRect().top;
        setTop(69 + distanceToTop > 0 ? 69 + distanceToTop : 0);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', eventListeners.current, true);
        eventListeners.current = scrollHandler;
        return () => {
            window.removeEventListener('scroll', eventListeners.current, true);
        };
    }, [scrollHandler]);

    return (
        <div className={`loader ${wrapperCName}`} style={{ top }}>
            <div className={`loader__element ${elementCName}`}></div>
        </div>
    );
};
export default PageLoader;
