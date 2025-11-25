import { useNavigate } from "react-router-dom";
import "./style.css";

const BackButton = ({ label = "Voltar" }) => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <button className="back-button-global" onClick={handleBack}>
      <i className="fas fa-arrow-left back-button-icon" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
