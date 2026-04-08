// hooks/useCustomFetch.ts
import { useEffect, useState } from "react";
import axios from "axios";

const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3${url}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                // 중요: 응답 데이터에 results가 있으면 그것을, 없으면 전체(객체)를 저장
                setData(response.data.results !== undefined ? response.data.results : response.data);
            } catch (err) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};

export default useCustomFetch;