import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

import PageContainer from "../components/PageContainer";
import ErrorMessage from "../components/ErrorMessage";
import LoginUserForm from "../components/LoginUserForm";


const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(mobileNumber, "username")
    console.log(password, "=password")
    if (!mobileNumber || !password) {
      setErrorMsg("All fields are required!");
      return null
    } else {
      try {
       
        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber,
            password,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        
        setUser(data.user);

        toast.success("Login successful!");

       
       navigate("/dashboard");
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <PageContainer>
      <div className="form-container">
        <h1>Login</h1>
        <ErrorMessage errorMsg={errorMsg} />
        <LoginUserForm
          onSubmit={handleLogin}
          action="Login"
          password={password}
          setPassword={setPassword}
          setMobileNumber={setMobileNumber}
        />
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </PageContainer>
  );
};

export default LoginPage;