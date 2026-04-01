import { useEffect, useState } from "react";
import type { MovieDetail } from "../types/movieDetail";
import type { CreditsResponse, Credit } from "../types/movieDetail";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credit[]>([]);

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const { movieId } = useParams<{ movieId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);

      try {
        // 1. 영화 상세
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        const movieData: MovieDetail = await movieRes.json();
        setMovie(movieData);

        // 2. 출연진 (크레딧)
        const creditRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        const creditData: CreditsResponse = await creditRes.json();
        setCredits(creditData.cast);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 font-2xl">
          에러가 발생했습니다.
        </span>
      </div>
    );
  }

  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && movie && (
        <div className="p-10">
          {/* 제목 */}
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

          {/* 포스터 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-lg mb-4"
          />

          {/* 기본 정보 */}
          <p className="mb-2">{movie.overview}</p>
          <p>평점: {movie.vote_average}</p>
          <p>개봉일: {movie.release_date}</p>
          <p>런타임: {movie.runtime}분</p>

          {/* 장르 */}
          <div className="flex gap-2 mt-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* 제작사 */}
          <div className="mt-4">
            <h2 className="font-semibold mb-2">제작사</h2>
            <ul>
              {movie.production_companies.map((company) => (
                <li key={company.id}>{company.name}</li>
              ))}
            </ul>
          </div>

          {/* 출연진 (크레딧) */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">출연진</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {credits.slice(0, 10).map((actor) => (
                <div key={actor.id} >
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