import React, { useState } from "react";
import "./style.css";

/**
 * Função auxiliar para gerar conteúdo de texto formatado para compartilhamento.
 * @param {object} result - Objeto de resultado contendo score, category, recommendation, etc.
 * @param {object} answers - Objeto de respostas do questionário.
 * @returns {string} - Texto formatado.
 */
const generateShareContent = (result, answers) => {
  let content = `*Resultado do Questionário Lumispect*\n\n`;
  content += `*Pontuação: ${result.score}%* (${result.category})\n`;
  content += `*Recomendação:* ${result.recommendation
    .split("Recomendamos procurar")[0]
    .trim()}\n\n`;

  content += `--- Respostas Detalhadas ---\n`;

  result.questions.forEach((q) => {
    const answer = answers[q.id] || "Não respondida";
    content += `Q${q.id}: ${q.text}\n R: ${answer}\n`;
  });

  content += `\nLembre-se: Este é um teste de triagem e não substitui o diagnóstico clínico.`;
  return content;
};

const ModalDetailsResult = ({
  isOpen,
  onClose,
  answers,
  questions,
  result,
}) => {
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !answers || !result) return null;

  let headerColor;
  if (result.score >= 70) {
    headerColor = "high";
  } else if (result.score >= 40) {
    headerColor = "medium";
  } else {
    headerColor = "low";
  }

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(
        "https://lumispect-api.onrender.com/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            questions,
            result: {
              score: result.score,
              category: result.category,
              recommendation: result.recommendation,
              description: result.description || "Descrição não fornecida.",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao gerar o PDF: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Lumispect_Relatorio_Detalhado.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Falha ao baixar o PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsapp = () => {
    const shareText = generateShareContent(result, answers);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleQuestionsVisibility = () => {
    setShowDetailedQuestions(!showDetailedQuestions);
  };

  const detailedResponses = questions.map((q) => ({
    id: q.id,
    text: q.text,
    answer: answers[q.id] || "Não respondida",
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title print-header">
          Detalhes do Resultado Lumispect
        </h2>

        <div className={`result-summary-box ${headerColor}`}>
          <h3 className="summary-title">Resumo do Teste</h3>
          <p className="summary-score">
            Pontuação: <strong>{result.score}%</strong>
          </p>
          <p className="summary-category">
            Categoria: <strong>{result.category}</strong>
          </p>
          <p className="summary-recommendation">{result.recommendation}</p>
        </div>

        <hr className="modal-divider" />

        <button
          onClick={toggleQuestionsVisibility}
          className="action-button detail-toggle-button"
        >
          <i
            className={`fas fa-chevron-${
              showDetailedQuestions ? "up" : "down"
            } button-icon`}
          ></i>
          {showDetailedQuestions ? "Ocultar" : "Mostrar"} Questões Detalhadas
        </button>

        {showDetailedQuestions && (
          <>
            <h3 className="modal-subtitle detailed-list-title">
              Respostas Detalhadas por Questão
            </h3>
            <div className="response-list-container">
              {detailedResponses.map((item) => (
                <div key={item.id} className="response-item">
                  <span className="response-id">Q{item.id}:</span>
                  <p className="response-question">{item.text}</p>
                  <span className="response-answer">{item.answer}</span>
                </div>
              ))}
            </div>
            <hr className="modal-divider" />
          </>
        )}

        <div className="modal-actions-group">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="action-button download-button primary-action"
          >
            {isDownloading ? (
              <>
                <i className="fas fa-spinner fa-spin button-icon"></i>
                Gerando PDF...
              </>
            ) : (
              <>
                <i className="fas fa-download button-icon"></i> Baixar Relatório
                PDF
              </>
            )}
          </button>

          <h4 className="share-prompt">Compartilhar Resultado</h4>
          <div className="share-buttons-group">
            <button
              onClick={handleShareWhatsapp}
              className="action-button share-button whatsapp-button"
              disabled={isDownloading}
            >
              <i className="fab fa-whatsapp button-icon"></i> WhatsApp
            </button>
          </div>
        </div>

        <button onClick={onClose} className="action-button modal-close-action">
          Fechar Detalhes
        </button>
      </div>
    </div>
  );
};

export default ModalDetailsResult;
