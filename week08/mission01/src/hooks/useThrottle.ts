import { useCallback,  useRef } from "react";


export function useThrottle<T extends(... args:any[])=> void>(fn:T,delay:number): T {
   const lastRun=useRef(0);

   return useCallback((...args:Parameters<T>) => {
    const now=Date.now();
    if(now-lastRun.current >= delay) {
        lastRun.current=now;
        fn(...args);
    }
   },[fn,delay]) as T;
}