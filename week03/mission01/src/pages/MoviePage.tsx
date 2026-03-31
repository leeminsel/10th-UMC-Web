import { useEffect, useState } from "react"
import type { Movie, MovieResponse} from "../types/movie";
import MovieCard from "../components/MoiveCard";

export default function MoviePage() {
    const [movies,setMovies] = useState<Movie[]>([]);

    {/* 마운트 될때 한번만 실행 시켜주기 위해 useEffect 선언 */}
    useEffect(() =>{
        const fetchMovies=async () => {
            {/* fetch는 제네릭 방식 못씀(axios 만 가능) */}

            const response= await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
                
            );    
            
            {/* 여기서 타입정의 */}
            const result:MovieResponse=await response.json();
            console.log(result)
            setMovies(result.results);
        };
        fetchMovies();
    },[]);

    return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies && movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
    )
}