import { useEffect, useState } from "react"
import type { Movie, MovieResponse} from "../types/movie";
import MovieCard from "../components/MoiveCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
    const [movies,setMovies] = useState<Movie[]>([]);

    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태
    const [isError, setIsError] = useState(false);
    // 3. 페이지
    const [page, setPage] = useState(1);

    {/* 마운트 될때 한번만 실행 시켜주기 위해 useEffect 선언 */}
    useEffect(() =>{
        const fetchMovies=async () => {
            setIsPending(true)

            {/* fetch는 제네릭 방식 못씀(axios 만 가능) */}
           try{
             const response= await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
                
            );    
            
            {/* 여기서 타입정의 */}
            const result:MovieResponse=await response.json();

            setMovies(result.results);
            }catch{
                setIsError(true);
            } finally {
                setIsPending(false)
            }
        };
           
        fetchMovies();
    },[page]);

    if(isError) {
    return  (
    <div>
        <span className="text-red-500 font-2xl">에러가 발생했습니다.</span>
    </div>
    );
   }
   
    return (
        <>
        <div className="flex items-center justify-center gap-6 mt-5">
            <button className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
            transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed" 
            disabled={page===1} onClick={() => setPage((prev) => prev-1)}>{`<`}</button>
            <span>{page}페이지</span>
            <button className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] 
            transition-all duration-200  cursor-pointer" 
            onClick={() => setPage((prev) => prev+1)}>{`>`}</button>
        </div>
        {isPending &&  (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        )}
        {!isPending && (
            <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies && movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        )}
        
        </>
    )
}