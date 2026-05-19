import { useRef, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { updateLp, uploadImage } from '../apis/lp';
import type { LpItem } from '../types/lp';

interface EditLpModalProps {
  lp: LpItem;
  onClose: () => void;
}

const EditLpModal = ({ lp, onClose }: EditLpModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(lp.thumbnail || null);
  const [thumbnailUrl, setThumbnailUrl] = useState(lp.thumbnail || '');
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState(lp.title);
  const [content, setContent] = useState(lp.content);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(lp.tags.map(t => t.name));

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateLp(String(lp.id), { title, content, thumbnail: thumbnailUrl, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', String(lp.id)] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message;
        alert(`LP 수정에 실패했습니다.\n${Array.isArray(msg) ? msg.join('\n') : msg ?? ''}`);
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setThumbnailUrl(imageUrl);
    } catch {
      setPreview(lp.thumbnail || null);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) setTags(prev => [...prev, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1a1a2e]">LP 수정</h2>
          <button
            onClick={onClose}
            aria-label="모달 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800 cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 바디 */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* 이미지 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">LP 사진</label>
            <label className="cursor-pointer block">
              <div className="w-full aspect-square max-w-[220px] mx-auto rounded-xl border-2 border-dashed border-[#dda5e3] flex items-center justify-center overflow-hidden bg-[#fdf5ff] hover:bg-[#f7eaff] transition-colors">
                {preview ? (
                  <img src={preview} alt="미리보기" className="w-full h-full object-cover" onError={() => setPreview(null)} />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#c986d1]">
                    <span className="text-4xl">🎵</span>
                    <span className="text-xs font-medium">클릭하여 이미지 변경</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {isUploading && <p className="mt-2 text-xs text-[#807bff] text-center animate-pulse">업로드 중...</p>}
            {!isUploading && thumbnailUrl && thumbnailUrl !== lp.thumbnail && (
              <p className="mt-2 text-xs text-green-500 text-center">업로드 완료</p>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#807bff] transition-colors"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-colors ${
                !content.trim() ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-[#807bff]'
              }`}
            />
            {!content.trim() && <p className="text-red-400 text-xs mt-1">내용을 입력해주세요.</p>}
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              태그 <span className="text-xs font-normal text-gray-400 ml-1">(Enter로 추가)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="#태그 입력 후 Enter"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#807bff] transition-colors"
            />
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors cursor-pointer leading-none">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-red-400 text-xs mt-1">태그를 1개 이상 입력해주세요.</p>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            취소
          </button>
          <button
            disabled={!title.trim() || !content.trim() || !thumbnailUrl || tags.length === 0 || isUploading || isPending}
            onClick={() => mutate()}
            className="px-5 py-2 text-sm rounded-lg bg-[#807bff] text-white font-semibold hover:bg-[#6b66e0] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer min-w-[60px]"
          >
            {isPending ? '수정 중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLpModal;
