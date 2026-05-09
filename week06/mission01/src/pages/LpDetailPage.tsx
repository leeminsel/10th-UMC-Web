import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail } from '../apis/lp';

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { data: lp, isLoading, isError } = useQuery({
    queryKey: ['lp', id],
    queryFn: () => fetchLpDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading) return <div className="p-5">상세 정보 로딩 중...</div>;
  if (isError || !lp) return <div className="p-5">정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-sm"
      >
        ← 뒤로 가기
      </button>
      <hr className="mb-4" />

      {imgError ? (
        <div className="w-full max-w-[400px] aspect-square bg-[#e0e0e0] flex items-center justify-center text-[#999] rounded-lg mb-4">
          No Image
        </div>
      ) : (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full max-w-[400px] block rounded-lg mb-4"
          onError={() => setImgError(true)}
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>
      <p className="text-gray-600 mb-4">{lp.content}</p>
      <div className="text-red-400 mb-2">❤️ 좋아요: {lp.likes.length}개</div>
      <div className="flex gap-2 flex-wrap mt-2">
        {lp.tags.map(t => (
          <span key={t.id} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">#{t.name}</span>
        ))}
      </div>
    </div>
  );
};

export default LpDetailPage;
