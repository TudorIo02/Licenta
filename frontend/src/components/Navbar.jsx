import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🏋️‍♂️ Platforma Sportivă</h2>
      <div className="nav-buttons">
        {user ? (
          <>
            <span className="user-info">Bine ai venit, {user.tip}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
