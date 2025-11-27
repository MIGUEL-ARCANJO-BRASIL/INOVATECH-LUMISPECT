import React, { useState } from "react";
import "./style.css";

const ModalDetailsResult = ({
  isOpen,
  onClose,
  answers,
  questions,
  result,
}) => {
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success", // "success" | "error"
  });

  if (!isOpen || !answers || !result) return null;

  let headerColor;
  if (result.score >= 70) {
    headerColor = "high";
  } else if (result.score >= 40) {
    headerColor = "medium";
  } else {
    headerColor = "low";
  }

  const showSnackBar = (message, type = "success") => {
    setSnack({ open: true, message, type });
    setTimeout(() => {
      setSnack((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch("http://localhost:3001/generate-pdf", {
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
      });

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

      showSnackBar("Download concluído com sucesso!", "success");
    } catch (error) {
      console.error("Falha ao baixar o PDF:", error);
      showSnackBar("Erro no servidor ao gerar o PDF.", "error");
    } finally {
      setIsDownloading(false);
    }
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
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Botão de Fechar */}
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>

          <h2 className="modal-title print-header">
            Detalhes do Resultado Lumispect
          </h2>

          {/* Resumo */}
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

          {/* Toggle questões detalhadas */}
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

          {/* Ações */}
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
                  <i className="fas fa-download button-icon"></i>
                  Baixar Relatório em PDF
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="action-button modal-close-action"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>

      {snack.open && (
        <div
          className={`snackbar ${
            snack.type === "success" ? "snackbar-success" : "snackbar-error"
          }`}
        >
          {snack.message}
        </div>
      )}
    </>
  );
};

export default ModalDetailsResult;
