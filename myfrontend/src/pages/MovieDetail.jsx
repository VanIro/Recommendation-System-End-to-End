import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa'; // import trash icon

import CardFeatureWrapper from "../components/Movies/CardFeatureWrapper";

import CardTitle from "../components/Movies/CardTitle";
import CardDescription from "../components/Movies/CardDescription";

import PlayButton from "../components/Header/PlayButton";
import PlayerOverlay from "../components/Movies/PlayerOverlay";
import PlayerVideo from "../components/Movies/PlayerVideo";
import MovieReviewForm from "../components/Movies/MovieReviewForm";


import HeaderWrapper from "../components/Header/HeaderWrapper";
import HeaderLink from "../components/Header/HeaderLink";
import NavBar from "../components/Header/NavBar";
import Logo from "../components/Header/Logo";
import SignoutButton from "../components/Header/SignoutButton";
import FeatureWrapper from "../components/Header/FeatureWrapper";
import FeatureTitle from "../components/Header/FeatureTitle";
import FeatureSubTitle from "../components/Header/FeatureSubTitle";
import { useAuth } from '../provider/authProvider'; 

import {fetch_trailer_url} from "../custom-hooks/useContent";

import {USER_MOVIE_RATING_URL} from "../url_references"
import { TMDB_API_KEY } from "../../env";

function MovieDetail(){
    const navigate=useNavigate();
    const location = useLocation();
    const [showPlayer, setShowPlayer] = useState(true);
    const [deleteError, setDeleteError] = useState("");
    const [activeItemTrailerUrl, setActiveItemTrailerUrl] = useState("");    
    
    const {token} = useAuth();
    const data = location.state
    const movie_data = (data&&("movie_data"in data))?data["movie_data"]:null;
    const movie_category = (data&&("movie_category"in data))?data["movie_category"]:null;
    
    useEffect(
        ()=>{
            (movie_data&&movie_category)?fetch_trailer_url(movie_category,movie_data.id).then((url)=>{console.log("got trailer url: ", url);setActiveItemTrailerUrl(url)}):
            ()=>{
                console.log("movie_data or movie-category is null...");
            }
        },
        [movie_data,movie_category]
    );

    const background_path = movie_data?`https://image.tmdb.org/t/p/original${movie_data.backdrop_path}?api_key=${TMDB_API_KEY}`:"";
    const poster_path = movie_data?`https://image.tmdb.org/t/p/original${movie_data.poster_path}?api_key=${TMDB_API_KEY}`:"";
    

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
          navigate("/myRatings");
        } catch (error) {
          setDeleteError(error.message);
        }
    };


    return (<>
        <HeaderWrapper className="header-wrapper-details" >
        <NavBar className="navbar-details">
          <Logo />
          <div className="navbar-browseTypeOption">
          {/* <HeaderLink
            className={
              category === "films" ? "header-link-bold" : "header-link"
            }
            onClick={() => setCategory("films")}
          >
            Films
          </HeaderLink>
          <HeaderLink
            className={
              category === "series" ? "header-link-bold" : "header-link"
            }
            onClick={() => setCategory("series")}
            >
            Series
          </HeaderLink> */}
          <HeaderLink
            className={
              // category === "series" ? "header-link-bold" : "header-link"
              "header-link"
            }
            onClick={() => navigate("/myRatings")}
            >
            My Ratings
          </HeaderLink>
          </div>
          <SignoutButton>Logout</SignoutButton>
        </NavBar>
      </HeaderWrapper>

      <div style={{
        width:'90vw',
        margin:'auto'
      }}>
            <FeatureWrapper style={{padding:'30px 40px',margin:'auto',backgroundImage: `url(${background_path})`,backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
            
            <FeatureTitle className="feature-title-browse">
                Watch {movie_data[movie_category==="movie"?"original_title":"original_name"]} Now
                
            </FeatureTitle>
            <FeatureSubTitle className="feature-subtitle-browse">
            {movie_data.overview}
            </FeatureSubTitle>
            <PlayButton onClick={() => setShowPlayer(true)} style={{}}>Play</PlayButton>
            {showPlayer ? (
                <PlayerOverlay onClick={() => setShowPlayer(false)}>
                {/* <PlayerVideo src="./videos/video.mp4" type="video/mp4" /> */}
                </PlayerOverlay>
            ) : null}
            </FeatureWrapper>
      </div>
      
          
      
      

            {/*{movie_data&&
                (<CardFeatureWrapper
                        style={{
                        backgroundImage: `url(${background_path})`,
                        }}
                    >
                        <CardTitle>{movie_data.title}</CardTitle>
                        <CardDescription>{movie_data.overview}</CardDescription>
                        {/* <CardFeatureClose onClick={() => {
                        setShowCardFeature(false)
                        setActiveItemTrailerUrl("")
                        }
                        } /> 
                        <PlayButton onClick={() => setShowPlayer(true)}>
                        Play
                        </PlayButton>
                        {showPlayer ? ()=>{
                        console.log("final activeUrl",activeItemTrailerUrl)
                        return (
                        <PlayerOverlay onClick={() => setShowPlayer(false)}>
                            <PlayerVideo src_url={activeItemTrailerUrl} type="video/mp4" />
                        </PlayerOverlay>
                        )} : null}
                </CardFeatureWrapper>)
            }*/}
            <div style={{display:'flex',width:'90vw', margin:'auto', padding:'30px 40px', justifyContent:'space-around'}}>
                <div style={{width:'20%',height:'30vw',backgroundImage:`url(${poster_path}) `, backgroundSize:'contain', backgroundRepeat:'no-repeat'}} />
                <MovieReviewForm api_endpoint={USER_MOVIE_RATING_URL} movie_id={movie_data&&movie_data.id} movie_category={movie_category}/>
                    <div style={{width:'22%', alignItems:'center'}} >
                        <button className='delete-button' onClick={() => handleDeleteRating(movie_data.id)}
                            style={{height:'min-content'}}
                        >
                          <FaTrashAlt style={{ marginRight: '8px' }} />
                          Delete This Rating
                        </button>
                        <div style={{color:'red'}}>
                            {deleteError}
                        </div>
                    </div>
            </div>
        </>
    );

    // return "Movie Detail Page";
}

export default MovieDetail;