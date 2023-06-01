import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignupPage.css";

import PageContainer from "../components/PageContainer";
import ErrorMessage from "../components/ErrorMessage";
import UserForm from "../components/SignupUserForm";


const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!username || !mobileNumber || !role || !password || !repeatPassword) {
      setErrorMsg("All fields are required!");
    } else if (password !== repeatPassword) {
      setErrorMsg("Passwords do not match");
    } else {
      try {
        const response = await fetch("http://localhost:8000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            mobileNumber,
            role,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        
        toast.success("Signup successful!");

      } catch (error) {
        setErrorMsg(error.message);
      }
    }
  };
  
  return (
    <PageContainer className="centered-container">
      <main>
        <div className="form-container">
          <h1>Sign Up</h1>
          <ErrorMessage errorMsg={errorMsg} className="error-message" />
          <UserForm
            onSubmit={handleSignup}
            action="Sign Up"
            username={username}
            setUsername={setUsername}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            role={role}
            setRole={setRole}
            password={password}
            setPassword={setPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            className="form-items-right"
          />
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </PageContainer>
  );
};

export default SignupPage;
