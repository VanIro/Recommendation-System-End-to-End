import React from "react";
import "./HeaderStyles.css";

function SigninButton({ children, ...restProps }) {
  return (
    <div>
      <a className="signin-button" href="/login" {...restProps}>
        {children}
      </a>
    </div>
  );
}

export default SigninButton;
