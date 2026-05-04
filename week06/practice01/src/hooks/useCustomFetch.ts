import { useEffect, useMemo, useState } from 'react'

const STALE_TIME=0.5*60*1000 //5분

// 로컬스토리지에 저장할 데이터 구조
interface CacheEntry<T> {
  data: T;
  lastFetched:number;  //마지막으로 데이터를 가져온 시점 타임스탬프
}

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T|null>(null);
  const [isPending, setIsPending]=useState<boolean>(false);
  const[isError, setIsError] = useState<boolean>(false);
  
  const storageKey = useMemo(() => url+'cache',[url]);


  useEffect(():void => {
    setIsError(false);

   const fetchData=async():Promise<void> => {
    const currentTime=new Date().getTime();
    const cachedItem=localStorage.getItem(storageKey);

    //캐시 데이터 확인, 신선도 검증
    if(cachedItem) {
        try{
            const cachedData: CacheEntry<T>=JSON.parse(cachedItem)
            
            // 캐시가 신선한 경우(5분 이내)
            if(currentTime - cachedData.lastFetched <STALE_TIME){
                setData(cachedData.data);
                setIsPending(false);
                console.log('캐시된 데이터 사용', url);
                return;
            }

            //캐시가 만료된 경우
            setData(cachedData.data);
        }catch{
            localStorage.removeItem(storageKey);
            console.warn('캐시 에러: 캐시 삭제함',url);
        }
    }





    setIsPending(true);
    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const newData=(await response.json()) as T;
        setData(data);

        const newCacheEntry: CacheEntry<T> = {
            data: newData,
            lastFetched:new Date().getTime(), //현재 시간을 타임스탬프로 저장
        };

        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
    }catch(error) {
        setIsError(true);
        console.log(error);
    }finally {
        setIsPending(false);
    }
   };
   fetchData();
 },[url,storageKey]);

 return {data,isPending,isError};
}
