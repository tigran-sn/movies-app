import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
      <div className='search-icon'>
        <img src="./search.svg" alt="Search" />
        <input type="text" placeholder='Search for a movie...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
    </div>
  )
}

export default Search