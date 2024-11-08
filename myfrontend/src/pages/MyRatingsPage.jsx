import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../provider/authProvider'; 
import { Link } from 'react-router-dom'; // For routing to detail page

import { FaTrashAlt } from 'react-icons/fa'; // import trash icon

import HeaderWrapper from "../components/Header/HeaderWrapper";
import HeaderLink from "../components/Header/HeaderLink";
import NavBar from "../components/Header/NavBar";
import Logo from "../components/Header/Logo";
import SignoutButton from "../components/Header/SignoutButton";


import './MyRatingsPageStyles.css'


import {USER_MOVIE_RATING_URL, USER_RATINGS_URL} from "../url_references"
import { TMDB_API_KEY } from "../../env";


function MyRatingsPage(){
  const [ratings, setRatings] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth(); 

  //getch user's ratings data
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await fetch(USER_RATINGS_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();        
        // console.log(data.ratings)
        setRatings(data.ratings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [token]);

  //get the movie data for each movie rated by the user
  useEffect(() => {
    const fetchMovieData = async (movieId,category) => {
      
      const map_target = {
        series:"tv", films:"movie"
      }
      if(! (["tv","movie"].includes(map_target[category]))) {
        console.error(`Invalid target '${category}', must be one of ['series', 'films'].`)
        return;
      }
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${map_target[category]}/${movieId}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch movie data");
        const movieData = await response.json();
        setMovies(prevMovies => ({ ...prevMovies, [movieId]: movieData }));
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    // Fetch data for each movie in ratings if not already loaded
    ratings.forEach((movieRating) => {
      if (!movies[movieRating.movie_id]) {
        fetchMovieData(movieRating.movie_id,movieRating.category);
      }
    });
  }, [ratings, movies]);

  //render the rating as stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    const emptyStars = 5 - fullStars - (decimalPart > 0 ? 1 : 0);
  
    return (
      <span style={{ display: 'inline-flex' }}>
        {/* Full stars */}
        {"★".repeat(fullStars).split("").map((star, i) => (
          <span key={`full-${i}`} style={{ color: 'gold', fontSize: '1.5em' }}>★</span>
        ))}
  
        {/* Partial star */}
        {decimalPart > 0 && (
          <span
            style={{
              color: 'gold',
              fontSize: '1.5em',
              position: 'relative',
              display: 'inline-block',
              overflow: 'hidden',
              width: `${decimalPart * 100}%`,
            }}
          >
            ★
          </span>
        )}
  
        {/* Empty stars */}
        {"☆".repeat(emptyStars).split("").map((star, i) => (
          <span key={`empty-${i}`} style={{ color: '#ccc', fontSize: '1.5em' }}>☆</span>
        ))}
      </span>
    );
  };

  const handleDeleteRating = async (movieId) => {
    try {
      const response = await fetch(`${USER_MOVIE_RATING_URL}?movie_id=${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Remove the rating from the state after successful deletion
      setRatings(prevRatings => prevRatings.filter(rating => rating.movie_id !== movieId));
    } catch (error) {
      setError(error.message);
    }
  };
  

  if (loading) return <p>Loading ratings...</p>;
  if (error) return <p>Error: {error}</p>;


    return <>
        <HeaderWrapper className="header-wrapper-details" >
            <NavBar className="navbar-details">
            <Logo />
            <div className="navbar-browseTypeOption">
            <HeaderLink
                className={
                 "header-link"
                }
                onClick={() => navigate("/",{state:{categoryTarget:"films"}})}
            >
                Films
            </HeaderLink>
            <HeaderLink
                className={
                    "header-link"
                }
                onClick={() => navigate("/",{state:{categoryTarget:"series"}})}
                >
                Series
            </HeaderLink>
            <HeaderLink
                className={
                    "header-link-bold"
                }
                onClick={() => navigate("/myRatings")}
                >
                My Ratings
            </HeaderLink>
            </div>
            <SignoutButton>Logout</SignoutButton>
            </NavBar>
        </HeaderWrapper>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding:'40px 30px', justifyContent: 'start' }}>
          {ratings.map((movie_rating_data, i) => {
            const movie = movies[movie_rating_data.movie_id];
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '8px',
                  flexBasis: '45%', // Allows for two items per row, adjust as needed
                  maxWidth: '28%',
                  minWidth:'5cm',
                  boxSizing: 'border-box',
                }}
              >
                {movie ? 
                  (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        style={{ borderRadius: '8px', marginRight: '15px', width: '80px', height: '120px' }} // Fixed size for the image
                      />
                      <div>
                      <button className='delete-button' onClick={() => handleDeleteRating(movie_rating_data.movie_id)}
                        >
                          <FaTrashAlt style={{ marginRight: '8px' }} />
                          {/* Delete Rating */}
                        </button>
                        <p>{movie_rating_data.category}</p>
                        <h3>{movie[movie_rating_data.category==="movie"?"original_title":"original_name"]}</h3>
                        <p>{movie.overview.slice(0, 100)}...</p>
                        <p>Your Rating: {renderStars(movie_rating_data.rating)}</p>
                        

                        <button onClick={() => {
                          navigate('/movie-detail', { state: { movie_data: movie, movie_category: movie_rating_data.category } });
                        }}>
                          View Details
                        </button>
                        
                      </div>
                    </>
                  ) : (<>
                      <div>
                        <p>{movie_rating_data.category}</p>
                        <h3>Loading info...  </h3>
                        <p>id:{movie_rating_data.movie_id}</p>
                      </div>
                    </>
                  )
                }
              </div>
            );
          })}
        </div>

    </>
}

export default MyRatingsPage;