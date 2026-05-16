import { useRef, useEffect, useState } from 'react';

interface CreateLpModalProps {
  onClose: () => void;
}

const CreateLpModal = ({ onClose }: CreateLpModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
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
          <h2 className="text-lg font-bold text-[#1a1a2e]">LP 추가</h2>
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
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">LP 사진</label>
            <label className="cursor-pointer block">
              <div className="w-full aspect-square max-w-[220px] mx-auto rounded-xl border-2 border-dashed border-[#dda5e3] flex items-center justify-center overflow-hidden bg-[#fdf5ff] hover:bg-[#f7eaff] transition-colors">
                {preview ? (
                  <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#c986d1]">
                    <span className="text-4xl">🎵</span>
                    <span className="text-xs font-medium">클릭하여 사진 업로드</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {preview && (
              <button
                onClick={() => setPreview(null)}
                className="mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors block mx-auto cursor-pointer"
              >
                이미지 제거
              </button>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">내용</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="LP에 대한 설명을 입력하세요"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#807bff] transition-colors"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              태그 <span className="font-normal text-gray-400 text-xs">(Enter로 추가)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="#태그 입력 후 Enter"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#807bff] transition-colors"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors cursor-pointer leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            disabled={!title.trim()}
            className="px-5 py-2 text-sm rounded-lg bg-[#e94560] text-white font-semibold hover:bg-[#c73652] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;
