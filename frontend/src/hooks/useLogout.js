// File: frontend/src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });   // 🔁 Redirect to Home.jsx
    window.location.reload();           // 🔄 Reset UI state (navbar, etc.)
  };

  return logout;
};

export default useLogout;
