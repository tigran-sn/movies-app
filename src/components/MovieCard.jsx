import React from 'react'

const MovieCard = ({ movie: { poster_path, title, overview, release_date, vote_average, original_language, adult, backdrop_path } }) => {
  return (
    <li className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-movie.png'} alt={title} />
        <div className='mt-4'>
            <h3 className='text-white text-lg font-bold'>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src="/star.svg" alt="star" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    <span>•</span>
                    <p className="lang">{original_language ? original_language : 'N/A'}</p>
                    <span>•</span>
                    <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                    {adult && <span>•</span>}
                    {adult && <p className="adult text-red-500">18+</p>}
                </div>
                <div className="backdrop">
                    <img src={backdrop_path ? `https://image.tmdb.org/t/p/w500${backdrop_path}` : '/no-movie.png'} alt={title} />
                </div>
                <p className="overview text-sm text-gray-400">{overview}</p>
            </div>
        </div>
    </li>
  )
}

export default MovieCard