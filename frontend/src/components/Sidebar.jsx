import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => navigate("/")}>🏠 Acasă</li>
        {user ? (
          user.tip === "sportiv" ? (
            <>
              <li onClick={() => navigate("/antrenori")}>📋 Vezi Antrenori</li>
              <li onClick={() => navigate("/profil")}>👤 Profilul Meu</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate("/sportivi")}>📋 Vezi Sportivi</li>
              <li onClick={() => navigate("/profil")}>👤 Profilul Meu</li>
            </>
          )
        ) : (
          <li onClick={() => navigate("/despre")}>ℹ️ Despre Platformă</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
