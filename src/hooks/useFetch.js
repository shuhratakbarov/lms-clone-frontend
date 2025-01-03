import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetch = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (url, options = {}) => {
        setLoading(true);
        try {
            const response = await axios(url, options);
            setData(response.data);
            setError(null);
        } catch (error) {
            setError(error.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, error, loading, fetchData };
};

export default useFetch;
