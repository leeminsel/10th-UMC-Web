import { Outlet, useNavigate } from "react-router-dom"

export const HomeLayout = () => {
    const navigate=useNavigate();

  return (
    <div className="h-dvh flex flex-col">
        <nav className="flex items-center justify-between px-8 py-4  shadow-lg border-b border-gray-700">
            <div className="text-xl font-bold text-[#dda5e3]">
        Minsel
    </div>
            <div className="flex gap-3">
            <button 
            onClick={() => navigate("/signup")}
            className="px-5 py-2 text-sm font-medium bg-[#dda5e3] text-[#262626] rounded-md hover:bg-[#b2dab1] transition-all duration-200 shadow-md active:scale-95 cursor-pointer">
                회원가입</button>
            <button 
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium bg-[#dda5e3] text-[#262626] rounded-md hover:bg-[#b2dab1] transition-all duration-200 shadow-md active:scale-95 cursor-pointer">
                로그인</button>
                <button 
            onClick={() => navigate("/my")}
            className="px-5 py-2 text-sm font-medium bg-[#dda5e3] text-[#262626] rounded-md hover:bg-[#b2dab1] transition-all duration-200 shadow-md active:scale-95 cursor-pointer">
                마이페이지</button>
            </div>  
        </nav>
        <main className="flex-1">
            <Outlet />
        </main>
        <footer className="text-sm text-gray-500">민셀 로그인 화면</footer>
    </div>
  )
}
