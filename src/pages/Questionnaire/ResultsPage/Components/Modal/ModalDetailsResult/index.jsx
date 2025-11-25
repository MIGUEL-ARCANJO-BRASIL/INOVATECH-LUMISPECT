import React, { useState } from "react";
// Importe o CSS se ele estiver em um arquivo separado, como Modal.css
import "./style.css";

// Importação da logo (tratada pelo bundler no frontend, mas seu valor pode ser usado
// no backend dependendo da sua configuração. Mantive a importação do seu código original).

/**
 * Função auxiliar para gerar conteúdo de texto formatado para compartilhamento.
 * @param {object} result - Objeto de resultado contendo score, category, recommendation, etc.
 * @param {object} answers - Objeto de respostas do questionário.
 * @returns {string} - Texto formatado.
 */
const generateShareContent = (result, answers) => {
  let content = `*Resultado do Questionário Lumispect*\n\n`;
  content += `*Pontuação: ${result.score}%* (${result.category})\n`;
  // Limita o texto de recomendação para o compartilhamento rápido
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

/**
 * Componente de Modal para exibir e gerenciar o resultado detalhado.
 * @param {object} props - Propriedades do componente.
 * @param {boolean} props.isOpen - Se o modal está aberto.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {object} props.answers - Respostas do usuário (chave: ID da pergunta, valor: resposta).
 * @param {array} props.questions - Lista completa de perguntas (necessária para os textos).
 * @param {object} props.result - Resultado do processamento (score, category, recommendation, description, etc.).
 */
const ModalDetailsResult = ({
  isOpen,
  onClose,
  answers,
  questions,
  result,
}) => {
  // Estado para controlar a visibilidade das questões detalhadas
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  // ✅ NOVO ESTADO: Controla o estado de carregamento do PDF
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !answers || !result) return null;

  // Determina a cor do cabeçalho do modal baseada na pontuação
  let headerColor;
  if (result.score >= 70) {
    headerColor = "high";
  } else if (result.score >= 40) {
    headerColor = "medium";
  } else {
    headerColor = "low";
  }

  /**
   * Função para acionar o download do relatório PDF formatado via API.
   */
  const handleDownloadPdf = async () => {
    // Se já estiver baixando, ignora novos cliques
    if (isDownloading) return;

    // 1. ✅ COMEÇA O CARREGAMENTO
    setIsDownloading(true);

    try {
      const response = await fetch(
        "https://lumispect-api.onrender.com/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // DADOS ENVIADOS
          body: JSON.stringify({
            answers,
            questions, // Array completo de questões
            result: {
              // Objeto 'result' contendo tudo
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

      // 2. Converte a resposta em um Blob (o arquivo PDF)
      const blob = await response.blob();

      // 3. Cria um link temporário para forçar o download no navegador
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [
            new File([blob], "Lumispect_Relatorio_Detalhado.pdf", {
              type: "application/pdf",
            }),
          ],
        })
      ) {
        const file = new File([blob], "Lumispect_Relatorio_Detalhado.pdf", {
          type: "application/pdf",
        });

        await navigator.share({
          files: [file],
          title: "Relatório Lumispect",
          text: "Segue o relatório Lumispect em anexo.",
        });
      } else {
        // fallback: só faz download normal
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Lumispect_Relatorio_Detalhado.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Falha ao baixar o PDF:", error);
    } finally {
      // 4. ✅ FINALIZA O CARREGAMENTO (Em caso de sucesso ou erro)
      setIsDownloading(false);
    }
  };

  const handleShareWhatsapp = () => {
    const shareText = generateShareContent(result, answers);
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Função para alternar a visibilidade das questões
  const toggleQuestionsVisibility = () => {
    setShowDetailedQuestions(!showDetailedQuestions);
  };

  // Converte as respostas para uma lista que inclui o texto da pergunta
  const detailedResponses = questions.map((q) => ({
    id: q.id,
    text: q.text,
    answer: answers[q.id] || "Não respondida",
  }));

  // --- RENDERIZAÇÃO DO MODAL ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title print-header">
          Detalhes do Resultado Lumispect
        </h2>

        {/* Seção de Resumo do Resultado */}
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

        {/* Botão para Mostrar/Ocultar Questões Detalhadas */}
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

        {/* Seção Ocultável de Questões Detalhadas */}
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

        {/* Seção de Ações e Compartilhamento */}
        <div className="modal-actions-group">
          {/* NOVO BOTÃO: DOWNLOAD VIA API (RELATÓRIO FORMATADO) */}
          <button
            onClick={handleDownloadPdf}
            // ✅ Desativa o botão durante o download
            disabled={isDownloading}
            className="action-button download-button primary-action"
          >
            {/* ✅ Lógica para exibir o ícone e o texto de loading */}
            {isDownloading ? (
              <>
                {/* Ícone de carregamento: geralmente, 'fas fa-spinner fa-spin' */}
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
