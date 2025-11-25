import { useState, useEffect } from "react"; // <-- Adicionado useEffect
import { useNavigate } from "react-router-dom";
import "./style.css";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";

const avatarSteps = [
  {
    key: "environment",
    title: "1. Ambiente Favorito",
    subtitle: "Onde você se sente mais confortável para passar o tempo?",
    options: [
      { label: "Locais Silenciosos e Calmos", response_key: "SENS_HIGH" },
      { label: "Locais com Movimento Controlado", response_key: "SENS_MIXED" },
      { label: "Locais Animados e Barulhentos", response_key: "SENS_LOW" },
    ],
  },
  {
    key: "social_interaction",
    title: "2. Interação Social",
    subtitle: "Qual o seu tipo de interação preferido com outras pessoas?",
    options: [
      {
        label: "Prefiro Atividades Solitárias ou Online",
        response_key: "SOCIAL_AVOID",
      },
      {
        label: "Interajo em Pequenos Grupos Conhecidos",
        response_key: "SOCIAL_CONTROLLED",
      },
      {
        label: "Adoro Grandes Encontros e Festas",
        response_key: "SOCIAL_EASY",
      },
    ],
  },
  {
    key: "routine_level",
    title: "3. Nível de Rotina",
    subtitle: "Como você lida com mudanças inesperadas e planejamento?",
    options: [
      {
        label: "Gosto de Rotina Rígida e Planejamento Detalhado",
        response_key: "RIGID_HIGH",
      },
      {
        label: "Prefiro um Equilíbrio, com Algum Planejamento",
        response_key: "RIGID_MIXED",
      },
      {
        label: "Lido Bem com Mudanças e Sou Flexível",
        response_key: "RIGID_LOW",
      },
    ],
  },
  {
    key: "hobbies",
    title: "4. Hobbies/Atividades",
    subtitle: "Quais atividades te atraem mais?",
    options: [
      {
        label: "Hobbies Repetitivos ou de Interesse Intenso",
        response_key: "INTENSE_HIGH",
      },
      { label: "Hobbies Variados e Práticos", response_key: "INTENSE_MIXED" },
      { label: "Hobbies Sociais ou Esportivos", response_key: "INTENSE_LOW" },
    ],
  },
];

const STORAGE_KEY_AVATAR = "avatarGameChoices";

const AvatarGame = () => {
  // 1. Inicializa o estado lendo do sessionStorage
  const [selectedChoices, setSelectedChoices] = useState(() => {
    const savedChoices = sessionStorage.getItem(STORAGE_KEY_AVATAR);
    // Se houver dados salvos, retorna eles. Caso contrário, retorna um objeto vazio.
    return savedChoices ? JSON.parse(savedChoices) : {};
  });

  const navigate = useNavigate();

  // 2. Persiste o estado no sessionStorage sempre que 'selectedChoices' mudar
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_AVATAR, JSON.stringify(selectedChoices));
  }, [selectedChoices]); // O array de dependências garante que isso rode em cada mudança

  const handleSelect = (stepKey, option) => {
    // Permite alternar a seleção (se já estiver selecionado, desmarca)
    if (selectedChoices[stepKey] === option.label) {
      const newChoices = { ...selectedChoices };
      delete newChoices[stepKey];
      setSelectedChoices(newChoices);
    } else {
      setSelectedChoices({ ...selectedChoices, [stepKey]: option.label });
    }
  };

  // Verifica se todas as 4 categorias têm uma seleção
  const isAllSelected =
    Object.keys(selectedChoices).length === avatarSteps.length;

  const handleGenerate = () => {
    if (isAllSelected) {
      console.log("Perfil Gerado/Questionário Mapeado:", selectedChoices);

      // Aqui seria o código para mapear selectedChoices para as 20 perguntas do Questionário Lumispect
    }
    navigate("/questionnaire");
  };

  return (
    <div className="avatar-game-page">
      <Header />
      <main className="avatar-game-main">
        <div className="avatar-game-container">
          <h1 className="avatar-game-title">
            <span className="title-highlight">Monte seu Perfil</span> de Jogo
          </h1>
          <p className="avatar-game-description">
            Escolha as opções que melhor definem o seu perfil. Suas escolhas
            preencherão o questionário Lumispect automaticamente, simulando um
            diagnóstico mais leve e interativo.
          </p>

          <div className="game-steps-wrapper">
            {avatarSteps.map((step) => (
              <div key={step.key} className="game-step-card">
                <h2>{step.title}</h2>
                <p className="step-subtitle">{step.subtitle}</p>
                <div className="step-options">
                  {step.options.map((option) => (
                    <button
                      key={option.label}
                      className={`step-button ${
                        selectedChoices[step.key] === option.label
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleSelect(step.key, option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="generate-section">
              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={!isAllSelected}
              >
                Ir para o Questionário
                <i className="fas fa-arrow-right"></i>
              </button>
              {!isAllSelected && (
                <p className="selection-status">
                  Selecione todas as 4 opções para continuar.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvatarGame;
