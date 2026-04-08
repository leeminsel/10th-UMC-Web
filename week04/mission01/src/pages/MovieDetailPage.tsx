import type { MovieDetail, Credit } from "../types/movieDetail";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch"; // 훅 임포트

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  // 1. 영화 상세 정보 가져오기
  const { data: movie, isLoading: isMovieLoading, isError: isMovieError } = 
    useCustomFetch<MovieDetail>(`/movie/${movieId}?language=en-US`);

  // 2. 출연진 정보 가져오기 (url 마지막에 cast가 results 역할을 하므로 잘 가져옵니다)
  const { data: castData, isLoading: isCreditLoading, isError: isCreditError } = 
    useCustomFetch<{ cast: Credit[] }>(`/movie/${movieId}/credits?language=en-US`);

  // 로딩 및 에러 통합 처리
  const isLoading = isMovieLoading || isCreditLoading;
  const isError = isMovieError || isCreditError;
  const credits = castData?.cast || [];

  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl font-bold">에러가 발생했습니다.</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {movie && (
        <div className="p-10">
          {/* ...기존 JSX 코드와 동일 (movie.title, img 등) ... */}
          <div className="text-2xl text-black font-bold mb-4">{movie.title}</div>
          
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-lg mb-4"
          />

          <p className="mb-2 ">{movie.overview}</p>
          <hr className="my-4 border-gray-300" />
          <p className="font-bold">평점: {movie.vote_average}</p>
          <p className="font-bold">개봉일: {movie.release_date}</p>
          <p className="font-bold">런타임: {movie.runtime}분</p>

          {/* 장르 */}
          <div className="flex gap-2 mt-2">
            <p className="font-bold">장르: </p>
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-[#dda5e3] px-2 py-1 rounded"
              >
               {genre.name}
              </span>
            ))}
          </div>
          <hr className="my-4 border-gray-300" />
          {/* 제작사 */}
          <div className="mt-4">
            <h2 className="font-semibold mb-2">제작사</h2>
            <ul>
              {movie.production_companies.map((company) => (
                <li key={company.id}>{company.name}</li>
              ))}
            </ul>
          </div>
          <hr className="my-4 border-gray-300" />

          {/* 출연진 렌더링 부분 */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">출연진</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {credits.slice(0, 10).map((actor) => (
                <div key={actor.id}>
                   <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300"
                    }
                    alt={actor.name}
                    className="rounded-lg mb-2"
                  />
                  <p className="font-semibold text-sm ">{actor.name}</p>
                  <p className="text-xs text-gray-500">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}