import React from "react";
import "./style.css"; // Mantenha a importação do CSS (assumindo que Modal.css ou style.css contêm o estilo de modal)

/*
 * Componente de Modal para exibir informações de Autoconhecimento e Neurodiversidade.
 * Exibido para resultados com Baixa ou Moderada presença de traços.
 * @param {object} props - Propriedades do componente.
 * @param {boolean} props.isOpen - Se o modal está aberto.
 * @param {function} props.onClose - Função para fechar o modal.
 */
const ModalSelfknowledge = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* O onClick={(e) => e.stopPropagation()} impede que clicar dentro do modal o feche */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}

        <h2 className="modal-title print-header">
          Autoconhecimento e o Espectro: Entendendo seus Traços
        </h2>

        <hr className="modal-divider" />

        <div className="modal-body-content">
          {/* Seção 1: Introdução */}
          <div className="info-section">
            <h3 className="section-title">A Jornada do Autoconhecimento</h3>
            <p>
              Parabéns por completar sua autoavaliação! Seu resultado indica uma
              baixa ou moderada presença dos traços avaliados pelo Lumispect.
            </p>
            <p>
              Lembre-se: o objetivo principal desta ferramenta é promover a
              reflexão. Compreender a sua forma de pensar, se comunicar e reagir
              ao mundo é o primeiro passo para o seu bem-estar e desenvolvimento
              pessoal.
            </p>
          </div>

          <hr className="modal-divider" />

          {/* Seção 2: Neurodiversidade */}
          <div className="info-section">
            <h3 className="section-title">O Que é Neurodiversidade?</h3>
            <p>
              A Neurodiversidade é um conceito que reconhece a variação natural
              no cérebro humano em relação à sociabilidade, aprendizado,
              atenção, humor e outras funções.
            </p>
            <p>
              Muitas características, como um forte foco em detalhes ou a
              preferência por rotinas e padrões, não são "defeitos", mas sim
              traços de personalidade que podem ser grandes forças. O importante
              é como esses traços interagem com sua vida.
            </p>
          </div>

          <hr className="modal-divider" />

          {/* Seção 3: Dicas Práticas de Desenvolvimento */}
          <div className="info-section">
            <h3 className="section-title">
              Dicas para Desenvolver Habilidades
            </h3>
            <p>
              Com base nos traços do questionário, veja algumas áreas onde o
              autoconhecimento pode ajudar no seu dia a dia:
            </p>
            <ul>
              <li>
                <i className="fas fa-comments"></i>
                &nbsp; Comunicação: Se você se pega "perdido" em conversas,
                pratique a escuta ativa e se permita pedir pausas breves.
                Aprender a ler sinais sociais pode ser uma habilidade
                desenvolvida.
              </li>
              <li>
                <i className="fas fa-calendar-alt"></i>&nbsp; Flexibilidade: Se
                você ama rotina, tente introduzir pequenas variações
                controladas. Isso ajuda a construir resiliência quando grandes
                mudanças são inevitáveis.
              </li>
              <li>
                <i className="fas fa-headphones-alt"></i>&nbsp; Regulação
                Sensorial: Se você é sensível a sons (Q8), utilize fones de
                ouvido em ambientes barulhentos ou crie "zonas de calma" em
                casa.
              </li>
            </ul>
          </div>
        </div>

        {/* Ação Principal de Fechar */}
        <button
          onClick={onClose}
          className="action-button modal-close-action primary-action"
          style={{ marginTop: "20px"
           }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalSelfknowledge;
