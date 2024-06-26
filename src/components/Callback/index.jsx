import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
const Callback = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const id = setTimeout(() => {
            navigate(-1);
        }, 200);
        return () => {
            clearTimeout(id);
        };
    }, []);
    return (
        <div className="callback_wrapper">
            <div>Loading...</div>
        </div>
    );
};

export default Callback;
