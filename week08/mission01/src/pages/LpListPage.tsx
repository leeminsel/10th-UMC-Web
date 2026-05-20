import {  useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';

const SKELETON_COUNT = 8;

const LpListPage = () => {
  const [search, setSearch] = useState('');
  const debouncedQuery=useDebounce(search, 300);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  // 검색창 클릭 전에는 isFocused(false), enabled(true)로 LP 목록 전체 보여준다.
  const [isFocused, setIsFocused]=useState(false);
  

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', debouncedQuery, sort],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      fetchLpList(pageParam, debouncedQuery, sort),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // 검색창 포커스 상태가 아니거나, 검색어가 공백 제외하고 1글자 이상이면 ture
    enabled: !isFocused || debouncedQuery.trim().length>0,
    staleTime:1000*60*1,  // 1분간 재요청 안 함
    gcTime:1000*60*5,     // 5분간 캐시 유지
  });

  // 2. fetchNextPage를 throttle로 감싸기 (500ms 간격 제한)
  const throttledFetchNextPage=useThrottle(fetchNextPage,1000);

  useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 페이지 하단 100px 이내에 도달했을 때
    if (scrollTop + windowHeight >= documentHeight - 100) {
      if (hasNextPage && !isFetchingNextPage) {
        throttledFetchNextPage();
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasNextPage, isFetchingNextPage, throttledFetchNextPage]);


  const allLps = data?.pages.flatMap((page) => page.data) ?? [];

  if (isError) return <div className="p-5">데이터 로드 실패</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">LP Collection</h1>

      <div className="mb-5 flex gap-3">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={search}
          // 검색창 클릭 후 빈 문자열이나 공백일 경우 isFocused(true), enabled(false) 로 요청 차단
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#807bff]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </div>

      {isLoading ? (
        // 초기 로딩: 상단에 skeleton
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <LpCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {allLps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
            {/* 추가 로딩: 하단에만 skeleton */}
            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <LpCardSkeleton key={`next-${i}`} />
              ))}
          </div>
          {/* 스크롤 감지용 빈 div — 화면에 보이면 다음 페이지 요청 */}
          <div className="h-4" />
        </>
      )}
    </div>
  );
};

export default LpListPage;
