import { useNavigate } from "react-router-dom";
import "./style.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="nav-button back-to-game top-left-button"
    >
      <i className="fas fa-arrow-left"></i> Voltar
    </button>
  );
};

export default BackButton;
