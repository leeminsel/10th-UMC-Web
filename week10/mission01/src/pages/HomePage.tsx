import { useCallback, useMemo, useState } from "react"
import  MovieFilter  from "../components/MovieFilter"
import  MovieList from "../components/MovieList"
import { MovieDetailModal } from "../components/MovieDetailModal"
import useFetch from "../hooks/useFetch"
import type { Movie, MovieFilters, MovieResponse } from "../types/movie"

export const HomePage = () => {

    const [filters, setFilters]= useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR",
    })

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const axiosRequestConfig = useMemo(() =>({
        params:filters,
    }),[filters])

    const {data, error, isLoading} = useFetch<MovieResponse>("/search/movie", 
        axiosRequestConfig,
    )

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    },[setFilters]);

    if(error) {
        return <div>{error}</div>
    }

    
  return (
    <div className="container mx-auto px-4">
        <MovieFilter onChange={handleMovieFilters}/>
        {isLoading ? (
            <div> 로딩 중 입니다... </div>
        ):(
            <MovieList movies={data?.results || []} onMovieClick={setSelectedMovie} />
        )}
        {selectedMovie && (
            <MovieDetailModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        )}
    </div>
  )
}

// 검색 필터
// 영화 무비
