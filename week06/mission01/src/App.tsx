import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5분: 캐시된 데이터를 fresh로 간주
      gcTime: 1000 * 60 * 10,    // 10분: 사용하지 않는 캐시 유지 시간
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LpListPage />} />
              <Route path="/lp/:id" element={<LpDetailPage />} />
              <Route path="/my" element={<MyPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/v1/auth/google/callback" element={<GoogleLoginRedirectPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
