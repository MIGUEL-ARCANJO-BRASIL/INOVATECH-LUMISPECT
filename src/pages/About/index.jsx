import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import "./style.css"; // Importa os estilos específicos desta página

const AboutUsPage = () => {
  return (
    <div className="about-page">
      <Header />

      <main className="about-main">
        <div className="about-container">
          <h1 className="about-title">
            Conheça o <span className="title-highlight">Lumispect</span>
          </h1>
          <h2 className="about-subtitle">
            Tecnologia, Acessibilidade e Autoconhecimento.
          </h2>

          <hr className="divider" />

          {/* SEÇÃO 1: HISTÓRIA E EQUIPE */}
          <section className="about-section">
            <h3 className="section-heading">
              <i className="fas fa-graduation-cap icon-lg"></i> Nossa História e
              Equipe
            </h3>
            <p className="section-text">
              O Lumispect é uma iniciativa desenvolvida por estudantes do 4º
              Período de Sistemas de Informação da Faculdade Metropolitana de
              Manaus (FAMETRO).
            </p>
            <p className="section-text">
              Nossa ideia nasceu de uma atividade acadêmica com foco em
              acessibilidade digital e design para pessoas no Espectro Autista
              (TEA). Percebendo a carência de ferramentas de triagem online que
              fossem acolhedoras e otimizadas, decidimos transformar o projeto
              de sala de aula em uma plataforma real, unindo a expertise em
              tecnologia com a responsabilidade social.
            </p>
          </section>

          <section className="about-section">
            <h3 className="section-heading">
              <i className="fas fa-eye icon-lg"></i> Design Acessível e
              Propósito
            </h3>
            <p className="section-text">
              A plataforma foi construída sobre o princípio da inclusão digital.
              Priorizamos um layout acessível, com cores suaves e um design
              menos agressivo visualmente. Nosso objetivo é proporcionar um
              ambiente confortável e seguro, reduzindo a sobrecarga sensorial
              que pode ser comum em muitas plataformas digitais.
            </p>
            <p className="section-text">
              O Lumispect oferece questionários estruturados que permitem aos
              usuários realizar uma autoavaliação inicial e explorar a
              intensidade de traços relacionados ao Espectro Autista. O foco é
              fornecer uma ferramenta de primeiro passo para o autoconhecimento.
            </p>
          </section>

          {/* SEÇÃO 3: BASE E AVISO LEGAL */}
          <section className="about-section disclaimer-section">
            <h3 className="section-heading">
              <i className="fas fa-balance-scale icon-lg"></i> Base Científica e
              Aviso Legal
            </h3>
            <p className="section-text">
              Os questionários utilizados são instrumentos de triagem baseados
              em escalas reconhecidas internacionalmente (como o AQ-10,
              Quociente do Espectro Autista, e módulos de avaliação de rigidez e
              sensibilidade).
            </p>
            <div className="disclaimer-box">
              <p>
                ⚠️ Atenção: O Lumispect é uma ferramenta acadêmica de
                autoavaliação e não substitui um diagnóstico clínico formal. Os
                resultados obtidos são apenas um indicador para subsidiar a
                busca por um profissional de saúde qualificado (neurologista,
                psiquiatra ou psicólogo) para uma avaliação completa.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
