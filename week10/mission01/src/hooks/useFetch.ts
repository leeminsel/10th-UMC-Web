import type { AxiosRequestConfig } from "axios";
import {  useEffect, useState } from "react";
import { axiosClient } from "../apis/axiosClient";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
    const [data, setData] = useState<T|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const fetchData=async():Promise<void> => {
            setIsLoading(true);
            try{
               const {data} = await axiosClient.get(url,{...options});

               setData(data);
            } catch {
                setError("데이터를 가져오는데 에러 발생");
            } finally {
                setIsLoading(false);
            }
            
        }
        fetchData();
    },[url, options])
    
return {
    data,
    error,
    isLoading,
}

}

export default useFetch;