import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./style.css";

const STORAGE_KEY_ANSWERS = "questionnaireResultsFinal";
const STORAGE_KEY_INDEX = "currentQuestionIndex";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const hasActiveSession = () => {
    const answers = localStorage.getItem(STORAGE_KEY_ANSWERS);
    const progress = sessionStorage.getItem("questionnaireAnswersProgress");
    const index = sessionStorage.getItem(STORAGE_KEY_INDEX);
    return !!answers || !!progress || !!index;
  };

  const handleNavigateWithConfirm = (event, path) => {
    event.preventDefault();

    // Se já está na rota alvo, não faz nada
    if (location.pathname === path) {
      closeMenu();
      return;
    }

    // Se não tem sessão ativa, navega direto
    if (!hasActiveSession()) {
      closeMenu();
      navigate(path);
      return;
    }

    // Senão, abre modal de confirmação
    setPendingPath(path);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // limpa questionário e resultado
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    sessionStorage.removeItem(STORAGE_KEY_INDEX);
    sessionStorage.removeItem("questionnaireAnswersProgress");

    const target = pendingPath || "/";
    setShowConfirm(false);
    setPendingPath(null);
    closeMenu();
    navigate(target);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingPath(null);
    closeMenu();
  };

  return (
    <>
      <header className={`main-header ${isOpen ? "menu-open" : ""}`}>
        <Link to="/" className="header-logo" onClick={closeMenu}>
          Lumispect
        </Link>

        {/* Menu desktop */}
        <nav className="header-nav">
          <Link
            to="/instructions"
            title="Veja como o teste funciona"
            onClick={(e) => handleNavigateWithConfirm(e, "/instructions")}
          >
            Instruções
          </Link>
          <Link
            to="/about-us"
            onClick={(e) => handleNavigateWithConfirm(e, "/about-us")}
          >
            Sobre Nós
          </Link>
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
          <Link
            to="/instructions"
            onClick={(e) => handleNavigateWithConfirm(e, "/instructions")}
          >
            Instruções
          </Link>
          <Link
            to="/about-us"
            onClick={(e) => handleNavigateWithConfirm(e, "/about-us")}
          >
            Sobre Nós
          </Link>
        </nav>
      </header>

      {showConfirm && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Deseja sair do teste?</h3>
            <p>
              Se continuar, o questionário e o resultado atual serão apagados.
              Deseja prosseguir?
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-button danger"
                onClick={handleConfirm}
              >
                Sim, continuar
              </button>
              <button
                type="button"
                className="confirm-button secondary"
                onClick={handleCancel}
              >
                Não, voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
