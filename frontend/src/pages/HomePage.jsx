import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles.css"; // 🔥 Importă stilurile aici

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificăm dacă utilizatorul este logat
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} />
      <div className="main-content">
        <Sidebar user={user} />
        <div className="content">
          <h1>Bine ai venit pe platformă!</h1>
          <p>Aici va fi conținutul principal al aplicației.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
