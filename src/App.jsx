import React, { useState, useEffect } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard';
import { updateSearchCount, getTrendingMovies } from './appwrite';
const API_URL = 'https://api.themoviedb.org/3/';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adult, setAdult] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query = '', page = 1) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_URL}search/movie?query=${encodeURIComponent(query)}&include_adult=${adult}&page=${page}`
        : `${API_URL}discover/movie?include_adult=${adult}&include_video=true&language=en-US&sort_by=popularity.desc&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const movies = await response.json();
      
      if(movies.Response === 'False') {
        setErrorMessage(movies.Error) || 'No movies found';
        setMovieList([]);
        return;
      }

      setMovieList(movies.results || []);
      setTotalPages(movies.total_pages || 1);
      setLoading(false);

      // If the search term is not empty and the movie list is not empty, update the search count in the database
      if (query && page === 1 && movies.results.length > 0) {
        await updateSearchCount(query, movies.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies');
    } finally {
      setLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const trendingMovies = await getTrendingMovies();
      setTrendingMovies(trendingMovies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  }

  // Reset to first page when search term or adult filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, adult]);

  // Fetch movies whenever filters or page change
  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, adult, currentPage]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />

          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        
        {trendingMovies.length > 0 && <section className='trending'>
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}.</p>
                <img src={movie.poster_url} alt={movie.title} />
                <h3>{movie.title}</h3>
              </li>
            ))}
          </ul>
        </section>}

        <section className='all-movies'>
          <h2>All Movies</h2>
          <div className="search-results">
            <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
              <input type="checkbox" id="adult" checked={adult} onChange={() => setAdult(!adult)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
              <label className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300' htmlFor="adult">Include Adult Movies</label>
            </div>
          </div>
          {loading ? <Spinner /> : errorMessage ? <p className='text-red-500'>{errorMessage}</p> : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
              {movieList.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    className="px-3 py-2 rounded border border-gray-600 text-white disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
                  <button
                    className="px-3 py-2 rounded border border-gray-600 text-white disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default App