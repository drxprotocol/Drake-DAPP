const _judegDevice = (deviceList) => {
    const ua = navigator.userAgent;
    for (let item of deviceList) {
        if (ua.includes(item)) {
            return true;
        }
    }
    return false;
};

// judge the device is mobile device?
export const isMobile = () => {
    const mobileDeviceList = ['iPad', 'iPhone', 'Android'];
    return _judegDevice(mobileDeviceList);
};

// judge the device is tablet? (special)
export const isTalet = () => {
    const taletDeviceList = ['iPad'];
    return _judegDevice(taletDeviceList);
};
