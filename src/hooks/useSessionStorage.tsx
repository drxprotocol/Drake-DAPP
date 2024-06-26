import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSessionStorage(key: string, initialValue: any) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.sessionStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue

            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            if (!item) {
                window.sessionStorage.setItem(key, JSON.stringify(initialValue));
            }
        } catch (error) {}
    }, [initialValue, key]);
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to sessionStorage.
    const setValue = useCallback(
        (value: any) => {
            try {
                // Save state
                setStoredValue(value);
                // Save to local storage
                window.sessionStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                // A more advanced implementation would handle the error case
            }
        },
        [key],
    );

    return [storedValue, setValue];
}
