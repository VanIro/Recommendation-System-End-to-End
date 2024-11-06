import React from "react";
import YouTube from "react-youtube";

import "./MoviesStyles.css";


function PlayerVideo({ children, ...restProps }) {
  console.log(restProps)
  var youtube_url = new URL(restProps.src);

  return (
    // <video className="player-video" controls {...restProps}>
    //   <source {...restProps} />
    // </video>
    // <iframe
    //     width="560"
    //     height="315"
    //     {...restProps }
    //     title="YouTube video player"
    //     frameBorder="0"
    //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //     allowFullScreen
    //   ></iframe>

    <Youtube videoId={youtube_url.searchParams.get("v")}/>
  );
}

export default PlayerVideo;
