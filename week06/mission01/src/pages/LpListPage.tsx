import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLpList } from '../apis/lp';
import LpCard from '../components/LpCard';

const LpListPage = () => {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lps', search, order],
    queryFn: () => fetchLpList(undefined, search, order),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading) return <div className="p-5">LP 목록을 불러오는 중...</div>;
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
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
        {data?.data.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
};

export default LpListPage;
