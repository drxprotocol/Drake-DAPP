import React from 'react';

const ConditionDisplay = ({ display, children }) => {
    return display ? children : '';
};

export default ConditionDisplay;
