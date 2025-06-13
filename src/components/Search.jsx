import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
    // props are readonly
  return (
    <div className='search'>
        <div>
            <img src="search.svg" alt="search" />
            <input type="text"  
                   placeholder='search throug thousands of movies' 
                   value={searchTerm}     
                   onChange={(event) => setSearchTerm(event.target.value)}  />
        </div>
    </div>
  )
}

export default Search