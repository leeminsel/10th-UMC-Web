import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail } from '../apis/lp';
import CommentSkeleton from '../components/CommentSkeleton';

const COMMENT_SKELETON_COUNT = 3;

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [comment, setComment] = useState('');
  const [commentTouched, setCommentTouched] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const { data: lp, isLoading, isError } = useQuery({
    queryKey: ['lp', id],
    queryFn: () => fetchLpDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setCommentsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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

      {imgError || !lp.thumbnail ? (
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
        {lp.tags.map((t) => (
          <span key={t.id} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            #{t.name}
          </span>
        ))}
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-[#1a1a2e]">댓글</h2>

        {/* 댓글 작성란 */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => setCommentTouched(true)}
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#807bff] transition-colors"
          />
          {commentTouched && !comment.trim() && (
            <p className="text-red-500 text-xs mt-1">댓글 내용을 입력해주세요.</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              disabled={!comment.trim()}
              className="px-5 py-2 bg-[#dda5e3] text-white rounded-lg text-sm font-medium hover:bg-[#c986d1] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              등록
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="flex flex-col divide-y divide-gray-100">
          {commentsLoading
            ? Array.from({ length: COMMENT_SKELETON_COUNT }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))
            : (
              <p className="text-gray-400 text-sm text-center py-6">아직 댓글이 없습니다.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
