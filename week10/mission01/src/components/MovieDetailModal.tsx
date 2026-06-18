import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://via.placeholder.com/500x750";
  const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-bold text-gray-900">{movie.title}</h2>
        </div>

        <div className="flex gap-6 p-6">
          <div className="w-48 flex-shrink-0">
            <img
              src={
                movie.poster_path
                  ? `${imageBaseUrl}${movie.poster_path}`
                  : fallbackImage
              }
              alt={`${movie.title} 포스터`}
              className="w-full rounded-lg object-cover shadow-md"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">개봉일</p>
              <p className="text-gray-800">{movie.release_date || "정보 없음"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">인기도</p>
              <p className="text-gray-800">{movie.popularity.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">줄거리</p>
              <p className="text-sm leading-relaxed text-gray-700">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            <div className="mt-auto flex gap-3 pt-2">
              <a
                href={imdbSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300"
              >
                IMDb 검색하기
              </a>
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
