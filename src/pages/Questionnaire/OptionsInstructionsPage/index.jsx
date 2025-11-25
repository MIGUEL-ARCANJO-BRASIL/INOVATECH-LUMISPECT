import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import "./style.css"; // Novo arquivo CSS para esta página

// Importações das imagens das peças (mantenha os caminhos corretos)
import BLUE_PIECE from "../../../assets/p-azul.png";
import RED_PIECE from "../../../assets/p-vermelho.png";
import YELLOW_PIECE from "../../../assets/p-amarelo.png";
import GREEN_PIECE from "../../../assets/p-verde.png";

const OPTIONS_GUIDE = [
  {
    color: "Verde",
    image: GREEN_PIECE,
    significado: "Concordo Totalmente",
    descricao:
      "Você se identifica completamente com a afirmação apresentada. Esta é a opção de maior intensidade de concordância.",
    classe: "green",
  },
  {
    color: "Azul",
    image: BLUE_PIECE,
    significado: "Concordo Parcialmente",
    descricao:
      "Você se identifica em parte com a afirmação, mas tem algumas ressalvas ou exceções. É a opção de concordância moderada.",
    classe: "blue",
  },
  {
    color: "Amarelo",
    image: YELLOW_PIECE,
    significado: "Discordo Parcialmente",
    descricao:
      "Você não se identifica com a afirmação, mas pode haver casos raros ou nuances onde ela se aplica. É a opção de discordância moderada.",
    classe: "yellow",
  },
  {
    color: "Vermelho",
    image: RED_PIECE,
    significado: "Discordo Totalmente",
    descricao:
      "Você não se identifica de forma alguma com a afirmação. Esta é a opção de maior intensidade de discordância.",
    classe: "red",
  },
];

const OptionsInstructionsPage = () => {
  return (
    <div className="instructions-page-container">
      <Header />

      <main className="instructions-main">
        <div className="instructions-content">
          <h1 className="instructions-title">
            Guia de Opções: Peças Lumispect
          </h1>
          <p className="instructions-intro">
            No questionário, você selecionará uma das quatro peças a seguir.
            Elas representam seu nível de concordância ou discordância com as
            afirmações.
          </p>

          <div className="pieces-grid">
            {OPTIONS_GUIDE.map((item) => (
              <div key={item.color} className={`piece-card ${item.classe}`}>
                <img
                  src={item.image}
                  alt={`Peça ${item.color}`}
                  className="piece-image-guide"
                />
                <div className="piece-details">
                  <h3>{item.significado}</h3>
                  <p className="piece-description">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="action-buttons-section">
            <Link to="/questionnaire" className="start-button primary-button">
              <i className="fas fa-play"></i> Iniciar Questionário
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OptionsInstructionsPage;
