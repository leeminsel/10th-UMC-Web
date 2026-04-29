import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
// 1. 정의하신 타입을 임포트합니다. (경로는 프로젝트 구조에 맞게 수정하세요)
import type { ResponseMyInfoDto } from "../types/auth"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// 2. CommonResponse 내부의 실제 데이터 타입만 추출하거나, 직접 정의합니다.
type UserData = ResponseMyInfoDto["data"]; 

export const MyPage = () => {
  const navigate=useNavigate();
  const{logout}=useAuth();
  // 상태 타입을 UserData 또는 null로 설정
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        
        // 중요: response 자체가 아니라 response.data를 저장해야 합니다.
        // DTO 구조가 CommonResponse<T> 이므로 실제 데이터는 .data 안에 들어있습니다.
        if (response && response.data) {
          setUser(response.data);
          console.log(response);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    getData();
  }, []);

  const handleLogout=async() => {
    await logout();
    navigate("/");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-[#dda5e3]">마이페이지</h1>
      
      {user ? (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-[#dda5e3] rounded-full flex items-center justify-center text-white text-3xl mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="space-y-4">
           
            
            <div className="text-xs text-right text-gray-400">
              계정 생성일: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-6 py-3 bg-[#dda5e3] text-white rounded-xl font-bold hover:bg-[#c986d1] transition-colors cursor-pointer"
            >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 animate-pulse">
          사용자 정보를 불러오는 중입니다...
        </div>
      )}
    </div>
  );
};