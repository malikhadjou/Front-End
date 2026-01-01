import React, { createContext, useState, useCallback } from "react";
import {
  mockReclamations,
  reclamationStats,
} from "../data/mockDataReclamations";

export const ReclamationContext = createContext();
const USE_MOCK_DATA = true;

export const ReclamationProvider = ({ children }) => {
  const [reclamations, setReclamations] = useState([]);
  const [statistiques, setStatistiques] = useState(reclamationStats);


  const fetchReclamations = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setReclamations(mockReclamations);
          setStatistiques(reclamationStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch réclamations", error);
      setReclamations([]);
    }
  }, []);

  // ajouter réclamation
  const ajouterReclamation = async (reclamation) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvelleReclamation = {
          ...reclamation,
          id: reclamations.length + 1,
          numeroReclamation: `REC-${String(
            reclamations.length + 1
          ).padStart(3, "0")}`,
          statut: "Nouvelle",
          date: new Date().toISOString().split("T")[0],
        };

        const nouvellesReclamations = [
          nouvelleReclamation,
          ...reclamations,
        ];

        setReclamations(nouvellesReclamations);
        recalculerStats(nouvellesReclamations);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur ajout réclamation", error);
    }
  };


  const changerStatutReclamation = async (id, nouveauStatut) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesReclamations = reclamations.map((rec) =>
          rec.id === id ? { ...rec, statut: nouveauStatut } : rec
        );

        setReclamations(nouvellesReclamations);
        recalculerStats(nouvellesReclamations);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur changement statut", error);
    }
  };


  const recalculerStats = (data) => {
    setStatistiques({
      total: data.length,
      nouvelles: data.filter((r) => r.statut === "Nouvelle").length,
      enCours: data.filter((r) => r.statut === "En cours").length,
      resolues: data.filter((r) => r.statut === "Résolue").length,
    });
  };

  return (
    <ReclamationContext.Provider
      value={{
        reclamations,
        statistiques,
        fetchReclamations,
        ajouterReclamation,
        changerStatutReclamation,
      }}
    >
      {children}
    </ReclamationContext.Provider>
  );
};
