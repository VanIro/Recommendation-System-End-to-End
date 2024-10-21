import React from "react";
import "./OptFormStyles.css";
import { useNavigate } from "react-router-dom";


function optFormButton({ children, ...restProps }) {
  const navigate = useNavigate();
  var handleOnClick = (target)=>{
    // console.log("clicked!!!")
    navigate("/signup",{state:{email:restProps["filled_value"]}});

  };
  return (
    <div>
      <a className="optform-button" onClick={handleOnClick} {...restProps}>
        {children}
        <img
          className="optform-button-image"
          src="../images/icons/chevron-right.png"
          alt="Try Now"
        />
      </a>
    </div>
  );
}

export default optFormButton;
