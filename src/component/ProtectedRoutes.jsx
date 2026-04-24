
// src/component/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import React from "react";
const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/g, '');

function ProtectedRoutes({ children }) {
  const [isValid, setIsValid] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/auth/api/users/`, {
          headers: {
            "Authorization": `Token ${token}`
          }
        });
        if (response.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          setIsValid(false);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setIsValid(false);
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;