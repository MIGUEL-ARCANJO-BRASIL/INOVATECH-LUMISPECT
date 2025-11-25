import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import "./style.css"; // Importa os estilos principais
import ClinicsModal from "./Components/Modal/ModalClinics";
import ModalDetailsResult from "./Components/Modal/ModalDetailsResult";
import ModalSelfknowledge from "./Components/Modal/ModalSelfknowledge";

// Chaves de armazenamento
const STORAGE_KEY_ANSWERS = "questionnaireResultsFinal"; // ✅ LÊ DO LOCALSTORAGE
const STORAGE_KEY_INDEX = "currentQuestionIndex";

// ===================================
// LÓGICA DE PONTUAÇÃO E PERGUNTAS
// ===================================
const SCORING_BASE = {
  "Concordo totalmente": 4,
  "Concordo parcialmente": 3,
  "Discordo parcialmente": 2,
  "Discordo totalmente": 1,
};

// Se INVERTED_QUESTIONS tiver perguntas, o score é invertido (5 - score)
const INVERTED_QUESTIONS = [];
const MAX_SCORE = 40; // 10 perguntas * 4 pontos (máximo)

const allQuestions = [
  {
    id: 1,
    text: "Quando estou lendo uma história, normalmente me concentro mais nos personagens do que nos fatos.",
  },
  {
    id: 2,
    text: "Frequentemente me pego mais concentrado em detalhes do que no quadro geral.",
  },
  {
    id: 3,
    text: "Costumo ter dificuldades em entender o que outra pessoa está pensando ou sentindo.",
  },
  {
    id: 4,
    text: "Costumo gostar de planejar todas as minhas atividades de forma minuciosa.",
  },
  {
    id: 5,
    text: "Costumo me perder durante conversas porque tenho dificuldades em acompanhar o ritmo.",
  },
  {
    id: 6,
    text: "Costumo gostar de realizar atividades sociais só quando estritamente necessário.",
  },
  {
    id: 7,
    text: "Frequentemente me sinto mais confortável fazendo as mesmas coisas de forma repetitiva.",
  },
  {
    id: 8,
    text: "Normalmente percebo pequenos sons que outras pessoas não percebem.",
  },
  {
    id: 9,
    text: "Normalmente consigo manter conversas regulares com outras pessoas.",
  },
  {
    id: 10,
    text: "Costumo perceber padrões em coisas ao meu redor que outras pessoas não veem.",
  },
];

const calculateScore = (answers) => {
  let totalScore = 0;
  for (const id in answers) {
    const questionId = parseInt(id);
    const answer = answers[id];
    let score = 0;

    if (questionId >= 1 && questionId <= 10) {
      score = SCORING_BASE[answer] || 0;
      if (INVERTED_QUESTIONS.includes(questionId)) {
        score = 5 - score;
      }
    }
    totalScore += score;
  }
  const scorePercentage = Math.round((totalScore / MAX_SCORE) * 100);
  return { totalScore, scorePercentage };
};

const getResultData = (scorePercentage) => {
  let category, recommendationText, nextStepsTitle, nextStepsContent;

  if (scorePercentage >= 70) {
    category = "Alta Probabilidade de Traços no Espectro";
    recommendationText = `O resultado do seu teste indica uma forte presença de traços avaliados pelo Lumispect. É crucial entender que esta é apenas uma triagem, mas o alinhamento com o escore máximo sugere que buscar uma avaliação profissional formal pode ser o passo mais importante para o seu autoconhecimento e bem-estar.`;
    nextStepsTitle = "Próximos Passos: Avaliação e Apoio";
    nextStepsContent =
      "Recomendamos fortemente a busca por profissionais de saúde mental (Neurologista, Psiquiatra ou Psicólogo com experiência em TEA) para um diagnóstico formal e início de um plano de suporte. Temos uma lista de clínicas e especialistas parceiros que podem auxiliar neste processo.";
  } else if (scorePercentage >= 40) {
    category = "Sinais Moderados: Traços de Rigidez e Sensibilidade";
    recommendationText = `Seu resultado indica uma presença moderada de traços relacionados ao espectro. Embora o Lumispect não seja diagnóstico, esses traços podem impactar áreas da sua vida. O autoconhecimento é a chave.`;
    nextStepsTitle = "Próximos Passos: Informação e Observação";
    nextStepsContent =
      "Se os traços causarem desconforto significativo, uma consulta com um profissional de saúde mental é o caminho. Procure informações confiáveis e continue a se observar. Considere conversar com um psicólogo para explorar esses traços em profundidade.";
  } else {
    category = "Traços Comuns ou Baixa Probabilidade";
    recommendationText = `O seu resultado sugere que as suas experiências se alinham mais com o padrão neurotípico, com pouca intensidade nos traços avaliados. Continue focando no seu bem-estar geral e no autoconhecimento.`;
    nextStepsTitle = "Próximos Passos: Autocuidado";
    nextStepsContent =
      "Se sentir ansiedade ou dificuldade em áreas específicas, o autocuidado e o desenvolvimento de habilidades sociais e emocionais podem ser úteis. Lembre-se, todos temos pontos fortes e desafios!";
  }
  return { category, recommendationText, nextStepsTitle, nextStepsContent };
};
// ===================================
// COMPONENTE PRINCIPAL
// ===================================
const ResultsPage = () => {
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClinicsModal, setShowClinicsModal] = useState(false);
  const [showModalSelfknowledge, setShowModalSelfknowledge] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Leitura do localStorage com pequeno atraso (100ms) para robustez
    const timer = setTimeout(() => {
      const savedAnswersJSON = localStorage.getItem(STORAGE_KEY_ANSWERS); // MUDANÇA AQUI

      if (!savedAnswersJSON) {
        console.log("Nenhuma resposta encontrada. Redirecionando.");
        navigate("/questionnaire");
        return;
      }

      try {
        const loadedAnswers = JSON.parse(savedAnswersJSON);
        setAnswers(loadedAnswers);

        const { scorePercentage } = calculateScore(loadedAnswers);
        const resultData = getResultData(scorePercentage);

        setResult({
          score: scorePercentage,
          category: resultData.category,
          recommendation: resultData.recommendationText,
          nextStepsTitle: resultData.nextStepsTitle,
          nextStepsContent: resultData.nextStepsContent,
          questions: allQuestions,
        });

        // ✅ LIMPA O RESULTADO FINAL DO LOCALSTORAGE APÓS LER
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
      } catch (error) {
        console.error("Erro processando respostas:", error);
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        navigate("/questionnaire");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Placeholder enquanto carrega
  if (!result) {
    return (
      <div className="results-page loading-page">
        <div className="loading-content">
          <h1>Calculando Resultados Lumispect...</h1>
          <i
            className="fas fa-spinner fa-spin loading-icon"
            style={{ fontSize: "3em", color: "#4b8cf5" }}
          ></i>
        </div>
      </div>
    );
  }

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    sessionStorage.removeItem(STORAGE_KEY_INDEX);
    sessionStorage.removeItem("questionnaireAnswersProgress");
    navigate("/questionnaire");
  };

  const handleFinish = () => {
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    sessionStorage.removeItem(STORAGE_KEY_INDEX);
    sessionStorage.removeItem("questionnaireAnswersProgress");
    navigate("/");
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true); // Abre o modal
  };

  // Define a cor de destaque do gráfico com base na pontuação
  let scoreColor;
  if (result.score >= 70) {
    scoreColor = "#dc3545"; // Cor Forte para High (Vermelho/Alto Risco)
  } else if (result.score >= 40) {
    scoreColor = "var(--amarelo-destaque)"; // Amarelo para Medium
  } else {
    scoreColor = "#79c743"; // Verde para Low
  }

  return (
    <div className="results-page">
      <main className="results-main">
        <div className="results-container">
          <h1 className="results-title">
            Resultado do{" "}
            <span className="title-highlight">Questionário Lumispect</span>
          </h1>

          <div className="result-card">
            <div className="score-section">
              {/* GRÁFICO DE ROSCA (DONUT) */}
              <h2>Resultado do Teste</h2>
              <div
                className={`score-circle score-${
                  result.score >= 70
                    ? "high"
                    : result.score >= 40
                    ? "medium"
                    : "low"
                }`}
                // Injeta o gradiente dinâmico no estilo
                style={{
                  backgroundImage: `conic-gradient(${scoreColor} ${result.score}%, #e9ecef ${result.score}%)`,
                }}
              >
                <p className="score-number">{result.score}%</p>
              </div>
            </div>

            <div className="explanation-section">
              <p className="explanation-text">
                Esta porcentagem representa o quão alinhadas estão suas
                respostas com o escore máximo possível de traços avaliados pelo
                questionário Lumispect.
              </p>
            </div>

            {/* BOTÃO DE DETALHES */}
            <div className="center-actions-group">
              <button
                onClick={handleViewDetails}
                className="action-button detail-button"
              >
                <i className="fas fa-search button-icon"></i> Ver Detalhes
              </button>
            </div>

            <hr className="divider" />

            {/* SEÇÃO PRINCIPAL DE RECOMENDAÇÃO */}
            <div className="recommendation-section">
              <h3 className="category-title">Categoria - {result.category}</h3>

              <p className="recommendation-text">{result.recommendation}</p>

              {/* SEÇÃO PRÓXIMOS PASSOS (Refatorada) */}
              <div className="next-steps">
                <h4 className="next-steps-title">{result.nextStepsTitle}</h4>
                <p className="next-steps-text">{result.nextStepsContent}</p>

                {/* Ação Condicional: Botão de Clínicas SÓ aparece para alta pontuação */}
                {result.score >= 70 ? (
                  <button
                    onClick={() => setShowClinicsModal(true)}
                    className="call-to-action-button"
                  >
                    <i className="fas fa-search-location"></i> Ver Clínicas e
                    Profissionais
                  </button>
                ) : (
                  // Ação genérica para pontuação baixa/moderada
                  <button
                    onClick={() => setShowModalSelfknowledge(true)}
                    className="call-to-action-button secondary-action"
                  >
                    <i className="fas fa-info-circle"></i> Saiba Mais Sobre
                    Autoconhecimento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO PRINCIPAIS ABAIXO DO CARD */}
        <div className="action-buttons-section">
          <button
            onClick={handleRetake}
            className="action-button retake-button"
          >
            <i className="fas fa-redo button-icon"></i> Refazer Questionário
          </button>

          <button
            onClick={handleFinish}
            className="action-button finish-button"
          >
            <i className="fas fa-home button-icon"></i> Concluir
          </button>
        </div>

        {/* DISCLAIMER DE RODAPÉ */}
        <div className="results-action-footer">
          <div className="div-column">
            <h2 className="final-message-highlight">
              Experiência LUMISPECT Concluída!
            </h2>

            <p className="disclaimer-text">
              Lembre-se: o LUMISPECT é uma ferramenta de triagem e
              autoconhecimento, e não substitui o diagnóstico clínico. Se os
              resultados levantarem preocupações, recomendamos que você procure
              um profissional de saúde qualificado para uma avaliação formal.
            </p>

            <p className="final-message-title">
              Obrigado por completar a sua autoavaliação
            </p>
          </div>
        </div>
      </main>
      {/* 4. Renderizar o novo modal no final do componente */}
      <ModalSelfknowledge
        isOpen={showModalSelfknowledge}
        onClose={() => setShowModalSelfknowledge(false)}
      />

      <ClinicsModal
        isOpen={showClinicsModal}
        onClose={() => setShowClinicsModal(false)}
      />
      <ModalDetailsResult
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        answers={answers}
        questions={allQuestions}
        result={result} // Passando o objeto 'result' completo e validado
      />
    </div>
  );
};

export default ResultsPage;
