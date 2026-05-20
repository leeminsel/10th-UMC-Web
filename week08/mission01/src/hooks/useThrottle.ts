import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value:T, interval:number): T {
    // 스로틀링된 값을 보관할 상태
    const [throttledValue, setThrottledValue] = useState<T>(value);

    // 현재 스로틀링 상태인지 기억할 플래그 변수
    const isThrottled=useRef<boolean>(false);

    // 타이머 ID를 보관할 ref(클린업할 때 사용)
    const timeoutId=useRef<ReturnType<typeof setTimeout> |null>(null);

    useEffect(()=>{
        //이미 락이 걸려있으면, 새로 들어온 값은 쿨타임이 돌 때까지 그냥 무시
        if(isThrottled.current) return;

        // leading 실행 락이 안결려 있으면 즉시 값 업데이트
        setThrottledValue(value);

        // 즉시 락을 건다
        isThrottled.current=true;
        
        // 지정된 interval 시간이 지나면 차단막을 열어주는 타이머 설정
        timeoutId.current=setTimeout(() =>{
            isThrottled.current=false;
        }, interval);

        // 언마운트되거나 interval이 바뀌면 타이머 청소
        return () => {
            if(timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        }
    }, [value,interval]) // value 나 interval이 변결될 때마다 체크
    
    return throttledValue;
}