import React from "react";
import "./HeaderStyles.css";

function Logo({ children, ...restProps }) {
  return (
    <div>
      <a href="/" {...restProps}>
        {children}
        {/* <img className="logo" href="/" src="./images/misc/logo.svg" alt="Netflix logo" /> */}
        <svg className="logo" height="30" width="200" xmlns="http://www.w3.org/2000/svg">
          <text x="8" y="10" fill="red">Movies4U</text>
        </svg>
      </a>
    </div>
  );
}

export default Logo;
