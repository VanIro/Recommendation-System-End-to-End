import React, { useState } from "react";
import OptFormWrapper from "../components/OptForm/OptFormWrapper.jsx";
import OptFormText from "../components/OptForm/OptFormText";
import OptFormEmail from "../components/OptForm/OptFormEmail";
import OptFormButton from "../components/OptForm/OptFormButton";

function OptFormCompound() {
  const [emailAddress, setEmailAddress] = useState("");
  return (
    <>
      <OptFormText>
        Ready to watch? Enter your email to create or restart your membership.
      </OptFormText>
      <OptFormWrapper>
        <OptFormEmail placeholder="Email Address" value={emailAddress}
              onChange={({ target }) => {setEmailAddress(target.value)}}/>
        <OptFormButton filled_value={emailAddress}>Get Started</OptFormButton>
      </OptFormWrapper>
    </>
  );
}

export default OptFormCompound;
