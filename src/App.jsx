import React, { useState , useEffect } from 'react'
import Search from './components/Search'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('I AM BATMAN');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  
  const apiKey = import.meta.env.VITE_TMBD_API_KEY;

  const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,      
    }
  };
    
  const fetchMovies = async () => {
    setIsLoading(true);
       
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


      //set movie list    
      setMovieList(data.results || []);
      
          
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(error);
    }

  };
  useEffect( () => {  
    console.log(`Trying to fetch data using key ${apiKey}`);
    fetchMovies();
    
  },[]);

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
            <h2>All Movies</h2>

          { errorMessage && <p className="text-red-500">{errorMessage}</p> }
          </section>
              

      </div>
    </main>
  )
}

export default App