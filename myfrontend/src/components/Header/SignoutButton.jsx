import React from "react";
import "./HeaderStyles.css";

function SignoutButton({ children, ...restProps }) {
  return (
    <div>
      <a className="signout-button " href="/logout" {...restProps}>
        {children}
      </a>
    </div>
  );
}

export default SignoutButton;
