import './App.css'
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import  MovieDetailPage  from './pages/MovieDetailPage';

// createBrowserRouter v6 기준

const router = createBrowserRouter([
  
  {
    path:'/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path:'/',
        element: <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
      {/* 메인 멘트: 텍스트 그라데이션 & 초대형 굵은 글씨 */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dda5e3] to-[#b2dab1]">
          당신을 위한 완벽한 영화 가이드!
        </span>
        <span className="block mt-2">🍿</span>
      </h1>

      {/* 서브 멘트: 읽기 편한 크기 & 부드러운 회색 */}
      <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
        지금 가장 핫한 영화부터 평점 높은 명작까지,<br />
        한눈에 확인해 보세요.
      </p>

      {/* 시작 유도 버튼 (선택 사항) */}
      <Link to="/movies/popular">
      <button className="cursor-pointer mt-12 px-8 py-4 bg-[#dda5e3] text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-[#dda5e3]/30">
        인기 영화 구경하기
      </button></Link>
    </div>
      },
      {
        path:'movies/:category',
        element: <MoviePage/>,
      },
     {
      path:'movie/:movieId',
      element: <MovieDetailPage/>,
     }
    ]
  },
]);

// movies/upcoming
// movies/popular
// movies/now_playing
// movies/top_rated
// movies/category{movie.id}

// 쿼리파라미터 추천하심
// movies?category=upcoming
// movies?category=popular
// movie/123




function App() {

  return <RouterProvider router={router} />;
}

export default App
