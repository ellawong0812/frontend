import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5010/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container2">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pw"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="register-box">
        <p>
          If you still don't have an account, please click "Register" button
          below
        </p>
        <button onClick={navigateToRegister} style={{ marginTop: "10px" }}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
