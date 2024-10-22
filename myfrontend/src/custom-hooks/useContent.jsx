
import React, { useEffect, useState, useContext } from "react";
// import { FirebaseContext } from "../context/FirbaseContext";

// dotenv.config();
import {TMDB_API_KEY} from "../../env.jsx"
const apiKey = TMDB_API_KEY;

export async function fetch_tmdb_data(target){//target is movie or tv
  
  if (!apiKey){
    console.error("TMDB_API_KEY not set")
    return;
  }
  if(! (["tv","movie"].includes(target))) {
    console.error(`Invalid target '${target}', must be one of ['movie', 'tv'].`)
    return;
  }

  // Fetch content genres
  var fetched_data = await fetch(`https://api.themoviedb.org/3/genre/${target}/list?api_key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
      var genres_movies_data=[]
      const genresList = data.genres;

      // Fetch contents for each genre
      genresList.forEach(async genre => {
        var fetched_genre_movies_data = await fetch(`https://api.themoviedb.org/3/discover/${target}?api_key=${apiKey}&with_genres=${genre.id}`)
          .then(response => response.json())
          .then(data => {
              // console.log(`fetching movies list for genre '${genre.name}' of target '${target}' `);
              // console.log(`${target} list for genre ${genre.name}:`, data.results);
              var this_genre_movies=[]
              data.results.forEach(movie=>{
                this_genre_movies.push({
                  id:movie.id,
                  imdb_id:movie.imdb_id,
                  genre:genre.name,
                  title:movie[target==="movie"?"original_title":"original_name"],
                  overview:movie.overview,
                  popularity: movie.popularity,
                  poster_path: movie.poster_path,
                  backdrop_path: movie.backdrop_path,
                  vote_average: movie.vote_average,
                  vote_count: movie.vote_count
                })
              })

              return this_genre_movies;
          })
          .catch(error => {
            console.error(error)
          })
        
          genres_movies_data.push({
          title: genre.name,
          data: fetched_genre_movies_data
        });
      });

      return genres_movies_data;
    })
    .catch(error => console.error(error));

    return fetched_data;
}


function useContent(target, fillTargetContainer) {
  const map_target = {
    series:"tv", films:"movie"
  }
  // const [content, setContent] = useState([]);

  useEffect(() => {
    fetch_tmdb_data(map_target[target]).then(fetched_genres_movies_data=>{
      fillTargetContainer(fetched_genres_movies_data)
      console.log("setContent complete for target ",target, fetched_genres_movies_data)
    })
  },[]);




  // const { firebase } = useContext(FirebaseContext);

  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection(target)
  //     .get()
  //     .then((snapshot) => {
  //       const allContent = snapshot.docs.map((contentObj) => ({
  //         ...contentObj.data(),
  //         docId: contentObj.id,
  //       }));

  //       setContent(allContent);
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // }, []);

  // return { [target]: content };
}

export default useContent;
