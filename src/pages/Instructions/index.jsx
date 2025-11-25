import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import "./style.css"; // Importa o CSS da página

const Instructions = () => {
  // Array para o conteúdo dos 4 pilares - REFORMULADO PARA QUESTIONÁRIO
  const instructionSteps = [
    {
      icon: "fas fa-brain",
      title: "Reflexão Sincera",
      text: "Responda pensando em como você geralmente se sente ou se comporta, e não em como gostaria de ser.",
    },
    {
      icon: "fas fa-ruler-combined",
      title: "Entenda a Afirmação",
      text: "Leia cada frase com atenção. O questionário aborda diferentes traços de sensibilidade e rigidez cognitiva.",
    },
    {
      icon: "fas fa-check-double",
      title: "Escolha o Grau",
      text: "Selecione a opção que melhor reflete sua experiência: (Concordo/Discordo totalmente, Sempre/Nunca, etc.).",
    },
    {
      icon: "fas fa-heart", // Mantido o ícone ou trocado para algo mais neutro
      title: "Sem Certo ou Errado",
      text: "Não há respostas boas ou ruins. Sua honestidade garante o resultado mais fiel ao seu perfil.",
    },
  ];

  return (
    <div className="instructions-page">
      <Header />

      <main className="instructions-main">
        {/* Conteúdo Centralizado */}
        <div className="instructions-content">
          <h1 className="instructions-title">
            <span className="title-prefix">Guia para o</span>
            <span className="title-highlight"> Questionário Lumispect</span>
          </h1>
          <h2 className="instructions-subtitle">
            Esta é uma autoavaliação desenvolvida para mapear a intensidade de
            traços relacionados ao Espectro Autista.
          </h2>

          <hr className="divider" />

          {/* SEÇÃO DE INSTRUÇÕES REFORMULADA */}
          <div className="steps-container">
            {instructionSteps.map((step, index) => (
              <div key={index} className="step-card">
                <i className={`${step.icon} step-icon`}></i>

                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>
          {/* FIM DA SEÇÃO DE INSTRUÇÕES */}

          <div className="ready-section">
            <p className="ready-text">
              Ao iniciar, você responderá a 10 afirmações com base nas suas
              experiências pessoais.
            </p>

            <Link
              to="/instructions-options" // MUDANÇA: Direciona diretamente para o Questionário
              className="start-button button primary-button"
            >
              <i className="fas fa-play"></i> Iniciar Autoavaliação
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instructions;
