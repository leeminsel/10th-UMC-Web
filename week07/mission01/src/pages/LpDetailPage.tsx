import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { fetchLpDetail, fetchComments, createComment, updateComment, deleteComment, likeLp, unlikeLp, deleteLp } from '../apis/lp';
import { useAuth } from '../context/AuthContext';
import CommentSkeleton from '../components/CommentSkeleton';
import EditLpModal from '../components/EditLpModal';
import type { Comment } from '../types/lp';

const COMMENT_SKELETON_COUNT = 3;

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const [imgError, setImgError] = useState(false);
  const [comment, setComment] = useState('');
  const [commentTouched, setCommentTouched] = useState(false);

  const [editLpModalOpen, setEditLpModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: lp, isLoading, isError } = useQuery({
    queryKey: ['lp', id],
    queryFn: () => fetchLpDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => fetchComments(id!),
    enabled: !!id,
  });

  const handleCommentError = (error: unknown) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해 주세요.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('이 LP에 댓글을 작성할 권한이 없습니다.');
      } else {
        alert('요청 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: (content: string) => createComment(id!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setComment('');
      setCommentTouched(false);
    },
    onError: handleCommentError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(id!, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setEditingId(null);
      setEditContent('');
    },
    onError: handleCommentError,
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(id!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
    onError: handleCommentError,
  });

  const isLiked = lp?.likes.some(like => like.userId === userId) ?? false;

  const likeMutation = useMutation({
    mutationFn: () => isLiked ? unlikeLp(id!) : likeLp(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', id] });
    },
    onError: () => {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp(id!),
    onSuccess: () => {
      navigate('/');
    },
    onError: () => {
      alert('삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDeleteLp = () => {
    if (!window.confirm('정말 이 LP를 삭제하시겠습니까?')) return;
    deleteLpMutation.mutate();
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    if (!userId) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    createMutation.mutate(comment.trim());
  };

  const handleStartEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditContent(c.content);
    setOpenMenuId(null);
  };

  const handleSubmitEdit = (commentId: number) => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ commentId, content: editContent.trim() });
  };

  const handleDelete = (commentId: number) => {
    setOpenMenuId(null);
    deleteMutation.mutate(commentId);
  };

  if (isLoading) return <div className="p-5">상세 정보 로딩 중...</div>;
  if (isError || !lp) return <div className="p-5">정보를 찾을 수 없습니다.</div>;

  const comments = commentsData?.data ?? [];

  return (
    <>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer text-sm"
        >
          ← 뒤로 가기
        </button>
        {userId === lp.authorId && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditLpModalOpen(true)}
              className="px-3 py-1 text-sm text-white bg-[#807bff] hover:bg-[#6b66e0] rounded-md transition-colors cursor-pointer"
            >
              수정
            </button>
            <button
              onClick={handleDeleteLp}
              disabled={deleteLpMutation.isPending}
              className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleteLpMutation.isPending ? '삭제 중...' : '삭제'}
            </button>
          </div>
        )}
      </div>
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
      <button
        onClick={() => {
          if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
          }
          likeMutation.mutate();
        }}
        disabled={likeMutation.isPending}
        className="flex items-center gap-1 text-red-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer mb-2"
      >
        {isLiked ? '❤️' : '🤍'}
        {lp.likes.length}개
      </button>
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
        {userId ? (
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
                onClick={handleSubmitComment}
                disabled={!comment.trim() || createMutation.isPending}
                className="px-5 py-2 bg-[#dda5e3] text-white rounded-lg text-sm font-medium hover:bg-[#c986d1] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {createMutation.isPending ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 py-4 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg">
            <button
              onClick={() => navigate('/login')}
              className="text-[#807bff] hover:underline cursor-pointer"
            >
              로그인
            </button>
            하면 댓글을 작성할 수 있습니다.
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="flex flex-col divide-y divide-gray-100">
          {commentsLoading ? (
            Array.from({ length: COMMENT_SKELETON_COUNT }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">아직 댓글이 없습니다.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="py-4 flex gap-3">
                {/* 아바타 */}
                <div className="w-9 h-9 rounded-full bg-[#dda5e3] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.author.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">{c.author.name}</span>

                    {/* 본인 댓글에만 … 메뉴 */}
                    {userId === c.author.id && (
                      <div className="relative" ref={openMenuId === c.id ? menuRef : null}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                          className="text-gray-400 hover:text-gray-600 px-1 text-lg leading-none cursor-pointer"
                        >
                          ···
                        </button>
                        {openMenuId === c.id && (
                          <div className="absolute right-0 top-6 z-10 bg-white border border-gray-200 rounded-lg shadow-md w-24 overflow-hidden">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              disabled={deleteMutation.isPending}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 댓글 내용 or 수정 폼 */}
                  {editingId === c.id ? (
                    <div className="mt-1">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        className="w-full border border-[#807bff] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end mt-1">
                        <button
                          onClick={() => { setEditingId(null); setEditContent(''); }}
                          className="px-3 py-1 text-xs rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleSubmitEdit(c.id)}
                          disabled={!editContent.trim() || updateMutation.isPending}
                          className="px-3 py-1 text-xs rounded-lg bg-[#dda5e3] text-white hover:bg-[#c986d1] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {updateMutation.isPending ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 mt-1 break-words">{c.content}</p>
                  )}

                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(c.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {editLpModalOpen && (
      <EditLpModal lp={lp!} onClose={() => setEditLpModalOpen(false)} />
    )}
  </>
  );
};

export default LpDetailPage;
