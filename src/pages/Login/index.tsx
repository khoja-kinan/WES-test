import React, { useState } from "react";
import "../../styles/Login.scss";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (newPassword: string) => {
    const passwordErrors: string[] = [];

    if (newPassword.length < 8) {
      passwordErrors.push("Password should be at least 8 characters long.");
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
      passwordErrors.push(
        "Password should contain at least 1 lowercase letter."
      );
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
      passwordErrors.push(
        "Password should contain at least 1 uppercase letter."
      );
    }

    if (!/(?=.*\d)/.test(newPassword)) {
      passwordErrors.push("Password should contain at least 1 digit.");
    }

    if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
      passwordErrors.push(
        "Password should contain at least 1 special character."
      );
    }

    setErrors(passwordErrors);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (errors.length === 0) {
      setIsLoading(true);
      try {
        fetch(`https://api.kinan-khoja.com/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }) // Converting to JSON
          .then((response) => response.json())

          // Displaying results to console
          .then((json) => {
            if (json.status !== "error") {
              localStorage.setItem("userName", json.user.username);
              localStorage.setItem("userRole", json.user.role);

              navigate("/user-table");
              setIsLoading(false);
              setUsername("");
              setPassword("");
            } else {
              setIsLoading(false);
              setShowError(true);
              setErrorMessage(
                "user name or password isn't correct, please try again..."
              );
            }
          });
      } catch (error) {
        setIsLoading(false);
        console.error("Error updating user:", error);
      }
      setErrors([]);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {showError && (
            <div className="login-error-message">
              <h5>{errorMessage}</h5>
            </div>
          )}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {errors.length > 0 && (
          <div className="error-message">
            <p>Password must meet the following requirements:</p>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" className="custom-button" disabled={isLoading}>
          <span>{isLoading ? "Loading..." : "Login"}</span>
          <div className="custom-button__animation"></div>
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
