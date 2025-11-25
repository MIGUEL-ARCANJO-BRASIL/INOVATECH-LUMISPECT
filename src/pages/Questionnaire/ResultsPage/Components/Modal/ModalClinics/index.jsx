import React from "react";
import "./style.css"; // Importa os estilos específicos do modal

// =====================================================================
// DADOS DAS CLÍNICAS CAIC+ EM MANAUS - ATUALIZADO E ORDENADO
// =====================================================================
const caicClinics = [
  // Mantenho a sua lista de clínicas aqui...
  {
    id: 1,
    name: "CAIC Alexandre Montoril",
    address: "Rua: Cel. Ferreira de Araújo, s/n",
    mapsLink: "https://maps.app.goo.gl/aPWqirAmznVNkKiP8",
  },
  {
    id: 2,
    name: "CAIC Ana Braga",
    address: "Av. Cosme Ferreira, s/n",
    mapsLink:
      "https://www.google.com/maps/search/?api=1&query=CAIC+Ana+Maria+dos+Santos+Pereira+Braga+Manaus2",
  },
  {
    id: 3,
    name: "CAIC Dr. Afrânio Soares",
    address: "Shangrilá - Av. Tancredo Neves, S/N",
    mapsLink: "https://maps.app.goo.gl/bNtocwUQodVxwtTD6",
  },
  {
    id: 4,
    name: "CAIC Dr. Edson Melo",
    address: "Av. Cosme Ferreira, 7995",
    mapsLink: "https://maps.app.goo.gl/dXqArkf1rVHHf8Df9",
  },
  {
    id: 5,
    name: "CAIC Dr. Rubim de Sá",
    address: "Av. Des. João Machado, S/N",
    mapsLink: "https://maps.app.goo.gl/7nidKHJVbfGaNjek6",
  },
  {
    id: 6,
    name: "CAIC Dra. Maria Helena Freitas de Góes",
    address: "Av. Cristã, 690",
    mapsLink: "https://maps.app.goo.gl/aW2jjDE584TgC58y6",
  },
  {
    id: 7,
    name: "CAIC Josephina de Mello",
    address: "R. Des. Filismino Soares, 213",
    mapsLink: "https://maps.app.goo.gl/JVgNNTm5hF9MtRtb9",
  },
  {
    id: 8,
    name: "CAIC José Carlos Mestrinho",
    address: "R. Dr. Abílio Alencar, S/N",
    mapsLink: "https://maps.app.goo.gl/gfosS9njNpfsa3sw9",
  },
  {
    id: 9,
    name: "CAIC Moura Tapajóz",
    address: "Av. Samaúma, 606",
    mapsLink: "https://maps.app.goo.gl/mGvv9Y7yCAtoEQLB8",
  },
  {
    id: 10,
    name: "CAIC TEA Dr. José Contente",
    address: "Av. Autaz Mirim, 9789",
    mapsLink: "https://maps.app.goo.gl/2tB4rPkJKNWF7d7KA",
  },
  {
    id: 11,
    name: "CAIC TEA DR GILSON MOREIRA",
    address: "R. Angicos, 80",
    mapsLink: "https://maps.app.goo.gl/AtsrFDBmLiK3axT78",
  },
];

const ClinicsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="clinic-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar no canto superior */}
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>

        <h2 className="clinic-modal-title">
          <i className="fas fa-search-location modal-icon"></i> Clínicas e Apoio
          em Manaus
        </h2>
        <p className="clinic-modal-subtitle">
          Lista das Clínicas CAIC que oferecem suporte inicial e orientação para
          diagnóstico (TEA).
        </p>

        <div className="clinic-list-container">
          {caicClinics.map((clinic) => (
            <div key={clinic.id} className="clinic-item-card">
              {/* NOVO CONTÊINER FLEX PARA NOME E BOTÃO */}
              <div className="clinic-header-row">
                <h3 className="clinic-name">{clinic.name}</h3>

                <a
                  href={clinic.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="maps-button-inline"
                >
                  <i className="fas fa-route"></i> Ver no Maps
                </a>
              </div>

              <p className="clinic-address">
                <i className="fas fa-map-marker-alt"></i> {clinic.address}
              </p>
            </div>
          ))}
        </div>

        <div className="modal-footer-disclaimer">
          <i className="fas fa-warning"></i>
          <p>
            Nota: A disponibilidade de serviços especializados (como para TEA)
            pode variar. Recomendamos ligar antes de se dirigir à unidade.
          </p>
        </div>

        {/* Rodapé de Ações: Botão 'Fechar' alinhado à direita */}
        <div className="modal-footer-actions">
          <button
            onClick={onClose}
            className="action-button modal-close-action"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicsModal;
