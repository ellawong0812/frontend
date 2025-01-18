import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to the backend
      await axios.post("http://localhost:5010/register", {
        username,
        password,
        role,
      });

      // Automatically log in the user after successful registration
      const response = await axios.post("http://localhost:5010/login", {
        username,
        password,
      });

      // Store the token in local storage
      localStorage.setItem("token", response.data.token);

      // Navigate directly to the home page
      navigate("/home");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container2">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
