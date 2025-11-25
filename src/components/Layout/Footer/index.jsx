import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import fametroLogo from "../../../assets/logo-fametro.png";
import inovatechLogo from "../../../assets/logo-inovatech.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logos">
        <div className="logo-item">
          <img src={fametroLogo} alt="Fametro" />
        </div>
        <div className="logo-item">
          <img src={inovatechLogo} alt="Inovatech" />
        </div>
        {/* <Link to="/references" className="logo-item references">
          Referências
        </Link> */}
      </div>
      <div className="copyright">
        &copy; 2025 Lumispect. Plataforma Gamificada de Auxílio Autoavaliativo
        Cognitiva.
      </div>
    </footer>
  );
};

export default Footer;
