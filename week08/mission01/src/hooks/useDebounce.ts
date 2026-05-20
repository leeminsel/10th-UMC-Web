import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number) {
    // 여기에 지연된 값을 보관한 state가 필요하다
    const [debouncedValue, setDebouncedValue] = useState(value);
    // 여기에 타이머를 돌리는 로직이 들어간다.
    useEffect(() => {
        // 입력(value)이 들어오면 delay 후에 상태를 변경하는 타이머 설정
        const timer=setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 타이머 지우기
        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]); // delay가 중간에 바뀌어도 즉시 반영
    return debouncedValue;
}