import { Link } from "react-router-dom";
import { useState } from "react";
import "./style.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`main-header ${isOpen ? "menu-open" : ""}`}>
      <Link to="/" className="header-logo" onClick={closeMenu}>
        Lumispect
      </Link>

      {/* Menu desktop */}
      <nav className="header-nav">
        <Link to="/instructions" title="Veja como o teste funciona">
          Instruções
        </Link>
        <Link to="/about-us">Sobre Nós</Link>
      </nav>

      {/* Botão hamburger (mobile) */}
      <button
        className={`hamburger-btn ${isOpen ? "is-open" : ""}`}
        onClick={toggleMenu}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay + menu mobile */}
      <div
        className={`mobile-overlay ${isOpen ? "show" : ""}`}
        onClick={closeMenu}
      />

      <nav className={`mobile-nav modern ${isOpen ? "show" : ""}`}>
        <Link to="/instructions" onClick={closeMenu}>
          Instruções
        </Link>
        <Link to="/about-us" onClick={closeMenu}>
          Sobre Nós
        </Link>
      </nav>
    </header>
  );
};

export default Header;
