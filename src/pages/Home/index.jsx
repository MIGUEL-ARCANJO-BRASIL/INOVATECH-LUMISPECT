import React from "react";

import "./style.css";
import lumisLogo from "../../assets/logo-lumis.png";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY_ANSWERS = "questionnaireResultsFinal"; // ✅ LÊ DO LOCALSTORAGE
const STORAGE_KEY_INDEX = "currentQuestionIndex";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Header />

      {/* 2. CONTEÚDO PRINCIPAL (HERO) */}
      <div className="hero-container">
        <div className="hero-content">
          <main className="content-section">
            <h1 className="logo-name">Lumispect</h1>
            <p className="introduction-text">
              Descubra seus padrões de atenção, foco e velocidade de pensamento
              através de jogos cognitivos interativos.
            </p>

            <div className="buttons-section">
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY_ANSWERS);
                  sessionStorage.removeItem(STORAGE_KEY_INDEX);
                  sessionStorage.removeItem("questionnaireAnswersProgress");
                  navigate("/instructions");
                }}
                className="button primary-button"
              >
                <i className="fas fa-play"></i> Iniciar Teste
              </button>
              <a href="#sobre-projeto" className="button secondary-button">
                <i className="fas fa-info-circle"></i> Sobre o Projeto
              </a>
            </div>
          </main>
        </div>

        {/* Lado Direito - Imagem */}
        <div className="hero-image">
          <div className="image-placeholder">
            <img src={lumisLogo} width={550} alt="Projeto Lumispect" />
          </div>
        </div>
      </div>

      <div className="div-aviso-educativo">
        <p className="aviso-educativo">
          Lembrete: O Lumispect é uma ferramenta educativa e{" "}
          <strong>não substitui avaliação profissional</strong>.
        </p>
      </div>
      {/* 3. SEÇÃO SOBRE O PROJETO */}
      <section id="sobre-projeto">
        <h2>O que é o Lumispect?</h2>
        <p className="sobre-missao">
          Nossa missão é fornecer uma plataforma educativa e acessível para que
          indivíduos explorem e compreendam melhor suas próprias funções
          executivas.
        </p>

        <div className="pilares-container">
          <div className="pilar-card">
            <i className="fas fa-brain"></i>
            <h3>Avaliação Interativa</h3>
            <p>
              Utilizamos jogos de atenção, memória de trabalho e raciocínio para
              mapear de forma lúdica seu desempenho cognitivo.
            </p>
          </div>

          <div className="pilar-card">
            <i className="fas fa-graduation-cap"></i>
            <h3>Caráter Educacional</h3>
            <p>
              O projeto é uma iniciativa de pesquisa e extensão da Fametro e
              Inovatech, focado no aprendizado e autoconhecimento.
            </p>
          </div>

          <div className="pilar-card">
            <i className="fas fa-chart-line"></i>
            <h3>Descoberta de Padrões</h3>
            <p>
              Os resultados ajudam você a visualizar seus padrões de foco e
              velocidade, incentivando o desenvolvimento pessoal contínuo.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER (Componente) */}
      <Footer />
    </div>
  );
};

export default Home;
