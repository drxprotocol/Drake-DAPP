export function getLocalStorage(key) {
    if (window.localStorage) {
        let storage = window.localStorage;
        let value = storage.getItem(key);
        if (!value) {
            return '';
        }
        try {
            let now = new Date();
            let obj = JSON.parse(storage.getItem(key));
            if (obj.expiry) {
                // If the obj is expired, delete the item from storage
                // and return null
                if (now.getTime() > obj.expiry) {
                    localStorage.removeItem(key);
                    return '';
                }
                return obj.data;
            }
            return obj;
        } catch (e) {
            console.error(e);
            storage.removeItem(key);
        }
    }
    return '';
}

export async function saveToLocalStorage(key, value, ttl = 0) {
    if (window.localStorage) {
        let storage = window.localStorage;
        let now = new Date();
        let data = ttl > 0 ? { data: value, expiry: now.getTime() + ttl } : value;
        storage.setItem(key, JSON.stringify(data));
    }
}
