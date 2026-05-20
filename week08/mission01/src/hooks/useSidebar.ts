import { useEffect, useState } from 'react';


export function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // keydown 이벤트 핸들러 정의
        const handleKeyDown=(e:KeyboardEvent) => {
            if(e.key==="Escape") {
                setIsOpen(false);
            }
        };

        //이벤트 리스너 등록
        window.addEventListener('keydown', handleKeyDown);

        // 클린업: 컴포넌트 언마운드 시 이벤트 리스너 해제 -> 메모리 누수 방지
        return () => {
            window.removeEventListener('keydown',handleKeyDown);
        }
    },[]);  // 빈배열: 마운트 시 한 번만 등록

    useEffect(() => {
        if(isOpen) {
            document.body.style.overflow='hidden'; // 스크롤 막기
        } else {
            document.body.style.overflow=''; // 스크롤 복원
        }

        // 클린업 : 훅이 언마운트될 때 항상 복원
        return () => {
            document.body.style.overflow='';
        };
    }, [isOpen]);  // isOpen 이 바뀔 때마다 실행
  

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return { isOpen, open, close, toggle };
}