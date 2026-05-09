import { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';

const SKELETON_COUNT = 8;

const LpListPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', search, sort],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      fetchLpList(pageParam, search, sort),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          <div ref={bottomRef} className="h-4" />
        </>
      )}
    </div>
  );
};

export default LpListPage;
