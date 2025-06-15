import React, { useState , useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  
  const apiKey = import.meta.env.VITE_TMBD_API_KEY;
  const apiBaseUrl = 'https://api.themoviedb.org/3/';
    
  const fetchMovies = async (query ='') => {

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,      
      }
    };

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

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
          
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }

  };

  const loadTrendingMovies = async() => {
    try {
      debugger;
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);

    } catch (error) {
      console.log('Error fetching trending movies ');
    }
  }
  useEffect( () => {    
    fetchMovies(debouncedSearchTerm);      
  },[debouncedSearchTerm]);

  useEffect( () => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" className="src" />
          <h1>Find <span className="text-gradient">Movies</span> you enjoy without the hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>

          { trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                { trendingMovies.map( 
                  (movie,i) => (
                  <li key={movie.$id}>
                    <p>{ i + 1}</p>
                    <img src={movie.poster_url} alt={movie.title}></img>
                  </li>)
                )}
              </ul>
            </section>)
          }

          <section className="all-movies">
            <h2>All Movies</h2>

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