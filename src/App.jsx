import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard';

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

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=${adult}` : `${API_URL}/discover/movie?include_adult=${adult}&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm, adult]);

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

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          <div className="search-results">
            <div className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
              <input type="checkbox" id="adult" checked={adult} onChange={() => setAdult(!adult)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
              <label className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300' htmlFor="adult">Include Adult Movies</label>
            </div>
          </div>
          {loading ? <Spinner /> : errorMessage ? <p className='text-red-500'>{errorMessage}</p> : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App