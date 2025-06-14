import React, { useState , useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  


  
  const apiKey = import.meta.env.VITE_TMBD_API_KEY;
  const apiBaseUrl = 'https://api.themoviedb.org/3/';

  

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,      
    }
  };
    
  const fetchMovies = async (query ='') => {

    const url = query 
  ? `${apiBaseUrl}search/movie?query=${encodeURI(query)}&include_adult=false&language=en-US&page=1`
  : `${apiBaseUrl}discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
         
    try {    
      const response = await fetch(url, options); 

      if(!response.ok){
        throw new Error('Failed to fetch movies.')
      }
      const data = await response.json();

      if(!data.results ) {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setIsLoading(false);
        setMovieList([]);
        return;
      }
    
      setMovieList(data.results || []);
      setIsLoading(false);
          
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }

  };
  useEffect( () => {  
    console.log(`Trying to fetch data using key ${apiKey}`);
    fetchMovies(debouncedSearchTerm);
    
  },[debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" className="src" />
          <h1>Find <span className="text-gradient">Movies</span> you enjoy without the hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>

          <section className="all-movies">
            <h2 className='mt-[40px]'>All Movies</h2>

          { isLoading ? 
          (
            <Spinner/>
          ) : errorMessage ? 
          ( 
            <p className="text-red-500">{errorMessage}</p>
          ):
          (
            <ul>
              {movieList.map( (m) => (
                <MovieCard key={m.id} movie={m}/>
                )
              )}
              
            </ul>
          )} 
            
          </section>
              

      </div>
    </main>
  )
}

export default App