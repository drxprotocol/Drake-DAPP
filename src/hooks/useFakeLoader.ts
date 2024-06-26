import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const useFakeLoader = (ms: number) => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const id = setTimeout(() => {
            setLoading(false);
        }, ms);
        return () => clearTimeout(id);
    }, []);

    const reload = useCallback(() => {
        setLoading(true);
        const id = setTimeout(() => {
            setLoading(false);
        }, ms);
        return () => clearTimeout(id);
    }, []);
    return { isLoading, reload };
};

export default useFakeLoader;
