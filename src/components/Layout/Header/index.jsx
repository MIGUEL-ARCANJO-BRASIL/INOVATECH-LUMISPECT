import { Link } from "react-router-dom";
import "./style.css";

const Header = () => {
  
  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        Lumispect
      </Link>
      <nav className="header-nav">
        <Link to="/instructions" title="Veja como o teste funciona">
          Instruções
        </Link>
        <Link to="/about-us">Sobre Nós</Link>
      </nav>
    </header>
  );
};

export default Header;
