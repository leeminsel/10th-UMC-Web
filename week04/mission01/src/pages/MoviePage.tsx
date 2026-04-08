import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MoiveCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch"; // 훅 불러오기

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    // ✅ 커스텀 훅 사용: URL에 category와 page를 포함시켜서 넘깁니다.
    // url이 바뀌면 훅 내부의 useEffect가 감지해서 다시 데이터를 가져옵니다.
    const { data: movies, isLoading, isError } = useCustomFetch<Movie[]>(
        `/movie/${category}?language=en-US&page=${page}`
    );

    if (isError) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <span className="text-red-500 text-2xl font-bold">에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6 mt-5">
                <button 
                    className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
            transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed" 
                    disabled={page === 1} 
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    {`<`}
                </button>
                <span>{page}페이지</span>
                <button 
                    className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
            transition-all duration-200  cursor-pointer" 
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    {`>`}
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    );
}