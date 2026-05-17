import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";

type UserData = ResponseMyInfoDto["data"];

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        console.log('[내 정보 응답]', response);
        if (response && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-[#dda5e3]">마이페이지</h1>

      {user ? (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-[#dda5e3] rounded-full flex items-center justify-center text-white text-3xl mb-4 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {user.bio && (
              <p className="text-gray-400 text-sm mt-1 text-center">{user.bio}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-xs text-right text-gray-400">
              계정 생성일: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-full py-3 bg-white border border-[#dda5e3] text-[#dda5e3] rounded-xl font-bold hover:bg-[#fdf4ff] transition-colors cursor-pointer"
            >
              설정
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-[#dda5e3] text-white rounded-xl font-bold hover:bg-[#c986d1] transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 animate-pulse">
          사용자 정보를 불러오는 중입니다...
        </div>
      )}

      {isEditOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onSuccess={(updated) => setUser((prev) => prev ? { ...prev, ...updated } : prev)}
        />
      )}
    </div>
  );
};
