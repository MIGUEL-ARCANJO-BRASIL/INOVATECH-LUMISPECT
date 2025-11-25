import React, { useState, useEffect, useCallback } from "react";
import "./style.css";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import { useNavigate } from "react-router-dom";

// Importações das imagens das peças (deve estar no caminho correto)
import BLUE_PIECE from "../../../assets/p-azul.png";
import RED_PIECE from "../../../assets/p-vermelho.png";
import YELLOW_PIECE from "../../../assets/p-amarelo.png";
import GREEN_PIECE from "../../../assets/p-verde.png";

// Chaves de armazenamento
const STORAGE_KEY_ANSWERS = "questionnaireResultsFinal"; // Resultados finais
const STORAGE_KEY_INDEX = "currentQuestionIndex"; // Índice de progresso

// ===========================================
// 1. CONSTANTES DE OPÇÕES
// ===========================================

const BASE_OPTIONS_MAP = {
  "Concordo totalmente": {
    label: "Totalmente",
    color: "green",
    piece: GREEN_PIECE,
  },
  "Concordo parcialmente": {
    label: "Parcialmente",
    color: "blue",
    piece: BLUE_PIECE,
  },
  "Discordo parcialmente": {
    label: "Parcialmente",
    color: "yellow",
    piece: YELLOW_PIECE,
  },
  "Discordo totalmente": {
    label: "Totalmente",
    color: "red",
    piece: RED_PIECE,
  },
};

// A ORDEM DESTA ARRAY DEFINE A ORDEM NO GRID
const BASE_OPTIONS = [
  "Concordo totalmente", // 1. VERDE
  "Concordo parcialmente", // 2. AZUL
  "Discordo parcialmente", // 3. AMARELO
  "Discordo totalmente", // 4. VERMELHO
];

// 2. MATRIZES DE PERGUNTAS
const baseQuestions = [
  {
    id: 1,
    text: "Quando estou lendo uma história, normalmente me concentro mais nos personagens do que nos fatos.",
    options: BASE_OPTIONS,
  },
  {
    id: 2,
    text: "Frequentemente me pego mais concentrado em detalhes do que no quadro geral.",
    options: BASE_OPTIONS,
  },
  {
    id: 3,
    text: "Costumo ter dificuldades em entender o que outra pessoa está pensando ou sentindo.",
    options: BASE_OPTIONS,
  },
  {
    id: 4,
    text: "Costumo gostar de planejar todas as minhas atividades de forma minuciosa.",
    options: BASE_OPTIONS,
  },
  {
    id: 5,
    text: "Costumo me perder durante conversas porque tenho dificuldades em acompanhar o ritmo.",
    options: BASE_OPTIONS,
  },
  {
    id: 6,
    text: "Costumo gostar de realizar atividades sociais só quando estritamente necessário.",
    options: BASE_OPTIONS,
  },
  {
    id: 7,
    text: "Frequentemente me sinto mais confortável fazendo as mesmas coisas de forma repetitiva.",
    options: BASE_OPTIONS,
  },
  {
    id: 8,
    text: "Normalmente percebo pequenos sons que outras pessoas não percebem.",
    options: BASE_OPTIONS,
  },
  {
    id: 9,
    text: "Normalmente consigo manter conversas regulares com outras pessoas.",
    options: BASE_OPTIONS,
  },
  {
    id: 10,
    text: "Costumo perceber padrões em coisas ao meu redor que outras pessoas não veem.",
    options: BASE_OPTIONS,
  },
];

const allQuestions = [...baseQuestions];
const TOTAL_QUESTIONS = allQuestions.length;

// ===========================================
// COMPONENTE AUXILIAR: Legenda de Cores
// ===========================================
const ColorKey = () => (
  <div className="color-key-legend">
    <h3 className="key-title">Respostas:</h3>

    <div className="key-items">
      {BASE_OPTIONS.map((optionText) => {
        const data = BASE_OPTIONS_MAP[optionText];

        return (
          <div key={optionText} className={`key-item ${data.color}`}>
            <img
              src={data.piece}
              alt={`${data.color} piece`}
              className="key-image"
            />

            <span className="key-label">{optionText}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================

const QuestionnairePage = () => {
  const [answers, setAnswers] = useState(() => {
    // Tenta carregar resultados finais (se houver) do localStorage
    const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
    // Se não houver, tenta carregar progresso do sessionStorage (respostas em andamento)
    if (!savedAnswers) {
      const savedProgress = sessionStorage.getItem(
        "questionnaireAnswersProgress"
      );
      return savedProgress ? JSON.parse(savedProgress) : {};
    }
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem(STORAGE_KEY_INDEX);
    const index = savedIndex ? parseInt(savedIndex, 10) : 0;
    return index < TOTAL_QUESTIONS ? index : 0;
  });

  const navigate = useNavigate();

  // ✅ Gravação final usando localStorage e navegação imediata
  const handleSubmit = useCallback(
    (finalAnswers) => {
      // 1. GRAVAÇÃO FINAL (AGORA NO LOCALSTORAGE)
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(finalAnswers));
      sessionStorage.removeItem(STORAGE_KEY_INDEX);
      sessionStorage.removeItem("questionnaireAnswersProgress"); // Limpa o progresso

      const confirmAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
      console.log(
        "GRAVAÇÃO FINAL SUCEDIDA E CONFIRMADA (agora no localStorage):",
        confirmAnswers
      );

      // 2. NAVEGAÇÃO IMEDIATA
      navigate("/results");
    },
    [navigate]
  );

  const handleNext = useCallback(
    (newAnswers) => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < TOTAL_QUESTIONS) {
        // Se ainda houver perguntas, avança o índice
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Se for a última pergunta, submete com as respostas completas
        handleSubmit(newAnswers);
      }
    },
    [currentQuestionIndex, handleSubmit]
  );

  const handleAnswer = (id, value) => {
    let newAnswers;
    const isTogglingOff = answers[id] === value;

    if (isTogglingOff) {
      newAnswers = { ...answers };
      delete newAnswers[id];
      setAnswers(newAnswers);
    } else {
      newAnswers = { ...answers, [id]: value };
      setAnswers(newAnswers);

      // Chamada síncrona/imediata
      handleNext(newAnswers);
    }
  };

  // Efeito para salvar o progresso (respostas em andamento) e índice sempre que eles mudam
  useEffect(() => {
    sessionStorage.setItem(
      "questionnaireAnswersProgress",
      JSON.stringify(answers)
    );
    sessionStorage.setItem(STORAGE_KEY_INDEX, currentQuestionIndex.toString());
  }, [answers, currentQuestionIndex]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / TOTAL_QUESTIONS) * 100;

  return (
    <div className="questionnaire-page">
      <Header />

      <main className="questionnaire-main">
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">
            Questionário <span className="title-highlight">Lumispect</span>
          </h1>

          <div className="main-content-wrapper">
            <div className="question-section">
              <button
                onClick={() => navigate(-1)}
                className="nav-button back-to-game top-left-button"
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>

              <div className="question-card single-question-view">
                <p className="question-progress">
                  Pergunta {currentQuestionIndex + 1} de {TOTAL_QUESTIONS} (
                  {answeredCount} respondida{answeredCount !== 1 ? "s" : ""})
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <p className="question-text">{currentQuestion.text}</p>

                {/* GRID DE CORES 2x2: A ordem é definida por BASE_OPTIONS */}
                <div className="answer-options color-grid-options">
                  {currentQuestion.options.map((optionText) => {
                    const optionData = BASE_OPTIONS_MAP[optionText];
                    if (!optionData) return null;

                    const isSelected =
                      answers[currentQuestion.id] === optionText;

                    return (
                      <button
                        key={optionText}
                        onClick={() =>
                          handleAnswer(currentQuestion.id, optionText)
                        }
                        className={`answer-button color-piece-button ${
                          optionData.color
                        } ${isSelected ? "selected" : ""}`}
                        aria-pressed={isSelected}
                      >
                        <img
                          src={optionData.piece}
                          alt={`${optionData.color} piece`}
                          className="option-image"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <ColorKey />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionnairePage;
