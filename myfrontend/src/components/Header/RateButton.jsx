import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./HeaderStyles.css";

const RateButton = ({ children, ...restProps }) => {
  const navigate = useNavigate();
//   const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
    //   setLikes(likes - 1);
      setIsLiked(false);
    } else {
    //   setLikes(likes + 1);
      setIsLiked(true);
    }
    navigate("/movie-detail",{state:{movie_data:restProps["card_data"],movie_category:restProps["card_category"]}});
    console.log("rate-button card_data",restProps["card_data"])
    
  };

  return (
    // <div>
      <button className="rate-button" onClick={handleLike}>
        {/* {isLiked ? '❤️ Liked' : '🤍 Like'} */}
        {children}
      </button>
      // { <span>{likes} {likes === 1 ? 'like' : 'likes'}</span> }
    // </div>
  );
};

export default RateButton;