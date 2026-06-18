import { useMemo, useState } from "react"
import { MovieFilter } from "../components/MovieFilter"
import  MovieList from "../components/MovieList"
import useFetch from "../hooks/useFetch"
import type { MovieFilters, MovieResponse } from "../types/movie"

export const HomePage = () => {

    const [filters, setFilters]= useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR",
    })

    const axiosRequestConfig = useMemo(() =>({
        params:filters,
    }),[filters])

    const {data, error, isLoading} = useFetch<MovieResponse>("/search/movie", 
        axiosRequestConfig,
    )

    if(error) {
        return <div>{error}</div>
    }

    
  return (
    <div className="container mx-auto px-4">
        <MovieFilter onChange={setFilters}/>
        {isLoading ? (
            <div> 로딩 중 입니다... </div>
        ):(
            <MovieList movies={data?.results || []} />
        )}

    </div>
  )
}

// 검색 필터
// 영화 무비
