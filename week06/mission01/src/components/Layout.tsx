import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BurgerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
  </svg>
);

const Layout = () => {
  const { accessToken, name, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                onClick={logout}
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
      </aside>

      {/* Main */}
      <main className="mt-[60px] min-h-[calc(100vh-60px)] p-6 bg-[#f5f5f5]">
        <Outlet />
      </main>

      {/* Floating Button */}
      <button
        onClick={() => navigate('/lp/new')}
        title="LP 추가"
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-[#e94560] text-white text-3xl border-none cursor-pointer z-[300] shadow-lg flex items-center justify-center hover:bg-[#c73652] transition-colors leading-none"
      >
        +
      </button>
    </div>
  );
};

export default Layout;
