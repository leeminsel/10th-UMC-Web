import { useEffect, useState } from "react"
import type { Movie } from "../types/movie";

export default function MoviePage() {
    const [movies,setMovies] = useState<Movie[]>([]);

    {/* 마운트 될때 한번만 실행 시켜주기 위해 useEffect 선언 */}
    useEffect(() =>{
        const fetchMovies=async () => {
            const response= await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
                
            );    

            const result=await response.json();
            
            setMovies(result.results);
        };
        fetchMovies();
    },[]);

    return (
    <div>
        {movies && movies.map((movie) =>(
            <div key={movie.id}>
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
            </div>
        ))}
    </div>
    )
}