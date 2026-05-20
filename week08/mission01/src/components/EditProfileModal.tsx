import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/lp';
import { useAuth } from '../context/AuthContext';

interface UserData {
  name: string;
  bio: string | null;
  avatar: string | null;
}

interface Props {
  user: UserData;
  onClose: () => void;
  onSuccess: (updated: UserData) => void;
}

const EditProfileModal = ({ user, onClose, onSuccess }: Props) => {
  const { updateName, name:currentName } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar ?? '');
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateMyInfo({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatarUrl || undefined,
      }),
      onMutate: () => {
        const previousName=currentName; // 롤백용 저장
        updateName(name.trim());        // Navbar 즉시 반영
        return {previousName};          // context로 전달
      },
    onSuccess: (data) => {
      onSuccess(data.data);  // MyPage 로컬 state 업데이트
      onClose();
    },
    onError: (_err,_vars, context) => {
      if(context?.previousName) {
        updateName(context.previousName); // 롤백 
      }
      alert('프로필 수정에 실패했습니다.');
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setAvatarUrl(url);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
      setAvatarPreview(user.avatar ?? '');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-bold mb-6 text-[#1a1a2e]">프로필 수정</h2>

        {/* 프로필 사진 */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full bg-[#dda5e3] flex items-center justify-center text-white text-3xl mb-2 overflow-hidden cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-sm text-[#807bff] hover:underline cursor-pointer disabled:opacity-50"
          >
            {uploading ? '업로드 중...' : '사진 변경'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 이름 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#807bff] transition-colors"
            placeholder="이름을 입력하세요"
          />
          {!name.trim() && (
            <p className="text-red-500 text-xs mt-1">이름은 필수입니다.</p>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:border-[#807bff] transition-colors"
            placeholder="자기소개를 입력하세요"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || uploading || updateMutation.isPending}
            className="flex-1 py-2 rounded-xl bg-[#dda5e3] text-white text-sm font-medium hover:bg-[#c986d1] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
