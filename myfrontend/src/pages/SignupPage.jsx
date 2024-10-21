import React, { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
// import { FirebaseContext } from "../context/FirbaseContext";
import HeaderWrapper from "../components/Header/HeaderWrapper";
import NavBar from "../components/Header/NavBar";
import Logo from "../components/Header/Logo";
import FooterCompound from "../compounds/FooterCompound";
import SignFormWrapper from "../components/SignForm/SignFormWrapper";
import SignFormBase from "../components/SignForm/SignFormBase";
import SignFormTitle from "../components/SignForm/SignFormTitle";
import SignFormInput from "../components/SignForm/SignFormInput";
import SignFormButton from "../components/SignForm/SignFormButton";
import SignFormText from "../components/SignForm/SignFormText";
import SignFormLink from "../components/SignForm/SignFormLink";
import SignFormCaptcha from "../components/SignForm/SignFormCaptcha";
import SignFormError from "../components/SignForm/SignFormError";
import Warning from "../components/Header/Warning";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { BACKEND_BASE_URL } from "../url_references";

function SignupPage() {
  // const history = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state
  // console.log(data)
  const email_placeholder = (data&&("email"in data))?data["email"]:"";
  // const { firebase } = useContext(FirebaseContext);

  const [firstName, setFirstName] = useState("");
  const [emailAddress, setEmailAddress] = useState(email_placeholder);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const IsInvalid = password === "" || emailAddress === "" || firstName === "";

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(BACKEND_BASE_URL+'/auth/signup', {email:emailAddress,password, firstName})
    .then(response => {
      // Handle successful response
      console.log('Registration successful:', response.data);
      toast.success("ユーザー　登録　成功！今ログインできます。");

      setTimeout(()=>navigate("/login", { replace: true }),3000);
    })
    .catch(error => {
      // Handle errors
      console.error('Registration failed:', error);

      var error_msg=""
      try{
        error_msg+=("\n"+error.response["data"]["error"])
      }catch(err){
        console.error("error->error",err)
      }

      toast.error("すみません、登録できませんでした！"+error_msg);
    });

    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(emailAddress, password)
    //   .then((result) =>
    //     result.user
    //       .updateProfile({
    //         displayName: firstName,
    //       })
    //       .then(() => {
    //         setFirstName("");
    //         setEmailAddress("");
    //         setPassword("");
    //         history.push("/browse");
    //       })
    //   )
    //   .catch((error) => setError(error.message));
  }

  return (
    <>
      <HeaderWrapper className="header-wrapper-home">
        <NavBar className="navbar-signin">
          <Logo />
        </NavBar>
        <SignFormWrapper>
          <ToastContainer />
          <SignFormBase onSubmit={handleSubmit} method="POST">
            {/* <Warning>NOT official Netflix</Warning> */}
            <SignFormTitle>Sign Up</SignFormTitle>
            {error ? <SignFormError>{error}</SignFormError> : null}
            <SignFormInput
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={({ target }) => setFirstName(target.value)}
            />
            <SignFormInput
              type="text"
              placeholder="Email Address"
              value={emailAddress}
              onChange={({ target }) => setEmailAddress(target.value)}
            />
            <SignFormInput
              type="password"
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <SignFormButton disabled={IsInvalid}>Sign Up</SignFormButton>
            <SignFormText>
              Already a user?
              <SignFormLink href="/login">Sign in now.</SignFormLink>
            </SignFormText>
            <SignFormCaptcha>
              This page is protected by Google reCAPTCHA to ensure you are not a
              bot.
            </SignFormCaptcha>
          </SignFormBase>
        </SignFormWrapper>
      </HeaderWrapper>
      <FooterCompound />
    </>
  );
}

export default SignupPage;
