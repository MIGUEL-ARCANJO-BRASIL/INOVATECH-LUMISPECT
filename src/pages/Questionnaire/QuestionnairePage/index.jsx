import React, { useState, useEffect, useCallback } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

import BLUE_PIECE from "../../../assets/p-azul.png";
import RED_PIECE from "../../../assets/p-vermelho.png";
import YELLOW_PIECE from "../../../assets/p-amarelo.png";
import GREEN_PIECE from "../../../assets/p-verde.png";

const STORAGE_KEY_ANSWERS = "questionnaireResultsFinal";
const STORAGE_KEY_INDEX = "currentQuestionIndex";

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

const BASE_OPTIONS = [
  "Concordo totalmente",
  "Concordo parcialmente",
  "Discordo parcialmente",
  "Discordo totalmente",
];

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

const QuestionnairePage = () => {
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
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

  // controla se deve bloquear atualização/fechamento desta página
  const [shouldBlock, setShouldBlock] = useState(true);

  const navigate = useNavigate();

  // BLOQUEIA F5/FECHAR ABA ENQUANTO ESTIVER NO QUESTIONÁRIO
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Tem certeza de que deseja sair? Seu progresso pode ser perdido.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);

  const handleSubmit = useCallback(
    (finalAnswers) => {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(finalAnswers));
      sessionStorage.removeItem(STORAGE_KEY_INDEX);
      sessionStorage.removeItem("questionnaireAnswersProgress");

      const confirmAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
      console.log(
        "GRAVAÇÃO FINAL SUCEDIDA E CONFIRMADA (agora no localStorage):",
        confirmAnswers
      );

      // libera o bloqueio ao concluir o questionário
      setShouldBlock(false);
      navigate("/results");
    },
    [navigate]
  );

  const handleNext = useCallback(
    (newAnswers) => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < TOTAL_QUESTIONS) {
        const nextQuestionId = allQuestions[nextIndex].id;
        const cleanedAnswers = { ...newAnswers };
        delete cleanedAnswers[nextQuestionId];
        setAnswers(cleanedAnswers);
        setCurrentQuestionIndex(nextIndex);
      } else {
        handleSubmit(newAnswers);
      }
    },
    [currentQuestionIndex, handleSubmit]
  );

  const handleAnswer = (id, value) => {
    const isTogglingOff = answers[id] === value;
    let newAnswers;

    if (isTogglingOff) {
      newAnswers = { ...answers };
      delete newAnswers[id];
      setAnswers(newAnswers);
    } else {
      newAnswers = { ...answers, [id]: value };
      setAnswers(newAnswers);

      handleNext(newAnswers);
    }
  };
  const handlePrev = () => {
    // se já está na primeira, não faz nada
    if (currentQuestionIndex === 0) return;

    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
  };

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
      <main className="questionnaire-main">
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">
            Questionário <span className="title-highlight">Lumispect</span>
          </h1>

          <div className="main-content-wrapper">
            <div className="question-section">
              <button
                onClick={handlePrev}
                className="nav-button back-to-game top-left-button"
                disabled={currentQuestionIndex === 0}
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>

              <div
                key={currentQuestion.id}
                className="question-card single-question-view question-fade"
              >
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
    </div>
  );
};

export default QuestionnairePage;
