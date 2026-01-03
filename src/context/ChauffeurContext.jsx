import React, { createContext, useState, useCallback } from "react";
import {
  mockChauffeurs,
  chauffeurStats,
} from "../data/mockDataChauffeurs";

export const ChauffeurContext = createContext();
const USE_MOCK_DATA = true;

export const ChauffeurProvider = ({ children }) => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [statistiques, setStatistiques] = useState(chauffeurStats);

  const fetchChauffeurs = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setChauffeurs(mockChauffeurs);
          setStatistiques(chauffeurStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch chauffeurs", error);
      setChauffeurs([]);
    }
  }, []);

  //  Ajouter chauffeur
  const ajouterChauffeur = async (chauffeur) => {
    try {
      if (USE_MOCK_DATA) {
        const nouveauChauffeur = {
          ...chauffeur,
          id: chauffeurs.length + 1,
          codeChauffeur: `CH-${String(
            chauffeurs.length + 1
          ).padStart(3, "0")}`,
          statut: "Disponible",
        };

        const nouveauxChauffeurs = [
          nouveauChauffeur,
          ...chauffeurs,
        ];

        setChauffeurs(nouveauxChauffeurs);
        recalculerStats(nouveauxChauffeurs);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur ajout chauffeur", error);
    }
  };

  // Changer statut chauffeur
  const changerStatutChauffeur = async (id, nouveauStatut) => {
    try {
      if (USE_MOCK_DATA) {
        const nouveauxChauffeurs = chauffeurs.map((ch) =>
          ch.id === id ? { ...ch, statut: nouveauStatut } : ch
        );

        setChauffeurs(nouveauxChauffeurs);
        recalculerStats(nouveauxChauffeurs);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur changement statut chauffeur", error);
    }
  };

  const modifierChauffeur = async (id, ChauffeurModifie) => {
    try {
      if (USE_MOCK_DATA) {
        setChauffeurs(
          chauffeurs.map((Chauffeur) =>
            Chauffeur.id === id ? { ...Chauffeur, ...ChauffeurModifie } : Chauffeur
          )
        );
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur modification Chauffeur", error);
    }
  };

   const supprimerChauffeur = async (id) => {
  try {
    if (USE_MOCK_DATA) {
      const Chauffeurs = chauffeurs.filter(
        (chauffeur) => chauffeur.id !== id
      );

      setChauffeurs(Chauffeurs);
      recalculerStats(Chauffeurs);
    }else {
        // API call ici
    }
  } catch (error) {
    console.error("Erreur suppression chauffeur", error);
  }
};

  const recalculerStats = (data) => {
    setStatistiques({
      total: data.length,
      disponibles: data.filter((c) => c.statut === "Disponible").length,
      enMission: data.filter((c) => c.statut === "En mission").length,
      indisponibles: data.filter((c) => c.statut === "Indisponible").length,
    });
  };

  return (
    <ChauffeurContext.Provider
      value={{
        chauffeurs,
        statistiques,
        fetchChauffeurs,
        ajouterChauffeur,
        changerStatutChauffeur,
        modifierChauffeur,
        supprimerChauffeur,
        recalculerStats,
      }}
    >
      {children}
    </ChauffeurContext.Provider>
  );
};
