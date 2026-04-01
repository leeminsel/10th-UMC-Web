import './App.css'
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
