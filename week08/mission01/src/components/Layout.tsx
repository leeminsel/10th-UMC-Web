import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateLpModal from './CreateLpModal';
import { useMutation } from '@tanstack/react-query';
import { deleteAccount, postLogout } from '../apis/auth';



const BurgerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
  </svg>
);

const Layout = () => {
  const { accessToken, name, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const {mutate:withdraw,isPending} = useMutation ({
  mutationFn:deleteAccount,
  onSuccess: () => {
    setWithdrawModalOpen(false);
    clearAuth();
    alert("탈퇴가 완료되었습니다.");
    navigate("/login");
  },
  onError:()=>{
    alert("탈퇴 처리 중 오류가 발생했습니다.");
  },
});

const {mutate:logout, isPending:isLogoutPending} = useMutation ({
  mutationFn:postLogout,
  onSuccess: () => {
    clearAuth();
    alert("로그아웃 성공");
  },
  onError: () =>{
    alert("로그아웃 실패");
  }
});

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[#1a1a2e] text-white flex items-center justify-between px-6 z-[200] shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="bg-transparent border-none text-white cursor-pointer flex items-center p-0"
            aria-label="메뉴 열기"
          >
            <BurgerIcon />
          </button>
          <Link to="/" className="text-white no-underline font-bold text-xl">
            🎵 LP Collection
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {accessToken ? (
            <>
              <span className="text-sm">{name}님 반갑습니다</span>
              <button
                onClick={() => navigate('/my')}
                className="px-3 py-1.5 cursor-pointer rounded-md border border-white bg-transparent text-white text-sm hover:bg-white/10 transition-colors"
              >
                마이페이지
              </button>
              <button
                onClick={() => logout()}
                disabled={isLogoutPending}
                className="px-3 py-1.5 cursor-pointer rounded-md border-none bg-[#e94560] text-white text-sm hover:bg-[#c73652] transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 cursor-pointer rounded-md border border-white bg-transparent text-white text-sm hover:bg-white/10 transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-3 py-1.5 cursor-pointer rounded-md border-none bg-[#e94560] text-white text-sm hover:bg-[#c73652] transition-colors"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/40 z-[150]" />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-[60px] left-0 bottom-0 w-[220px] bg-[#16213e] text-white overflow-y-auto z-[160] transition-transform duration-[250ms] ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="pt-4">
          <Link
            to="/"
            onClick={closeSidebar}
            className="block px-6 py-3 text-white no-underline text-[0.95rem] hover:bg-white/10 transition-colors"
          >
            🎶 LP 목록
          </Link>
        </nav>
        {accessToken && (
          <div className='absolute bottom-4 w-full px-6'>
              <button onClick={()=> setWithdrawModalOpen(true)}
                      className='w-full py-2 text-sm text-red-400 hover:text-red-300
                      transition-colors'> 탈퇴하기</button>

          </div>
        )}
      </aside>
      {withdrawModalOpen && (
    <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 flex flex-col gap-4 w-[280px]">
            <p className="text-center font-medium">정말 탈퇴하시겠습니까?</p>
            <div className="flex gap-3">
                <button
                    onClick={() => setWithdrawModalOpen(false)}
                    className="flex-1 py-2 border rounded-md text-sm"
                >
                    아니오
                </button>
                <button
                    onClick={() => withdraw()}
                    disabled={isPending}
                    className="flex-1 py-2 bg-red-500 text-white rounded-md text-sm disabled:bg-gray-300"
                >
                    {isPending ? "처리 중..." : "예"}
                </button>
            </div>
        </div>
    </div>
)}

      {/* Main */}
      <main className={`mt-[60px] min-h-[calc(100vh-60px)] p-6 bg-[#f5f5f5] flex flex-col transition-[margin] duration-[250ms] ease-in-out ${sidebarOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <Outlet />
      </main>

      {/* Floating Button */}
      <button
        onClick={() => accessToken ? setModalOpen(true) : navigate('/login')}
        title="LP 추가"
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-[#e94560] text-white text-3xl border-none cursor-pointer z-[300] shadow-lg flex items-center justify-center hover:bg-[#c73652] transition-colors leading-none"
      >
        +
      </button>

      {/* LP 작성 모달 */}
      {modalOpen && <CreateLpModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Layout;
