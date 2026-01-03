import React, { createContext, useState, useCallback } from "react";
import {
  mockTournees,
  tourneeStats,
} from "../data/mockDataTournees.js";

export const TourneeContext = createContext();
const USE_MOCK_DATA = true;

export const TourneeProvider = ({ children }) => {
  const [tournees, setTournees] = useState([]);
  const [statistiques, setStatistiques] = useState(tourneeStats);

  // Fetch tournées
  const fetchTournees = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setTournees(mockTournees);
          setStatistiques(tourneeStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch tournées", error);
      setTournees([]);
    }
  }, []);

  // Ajouter tournée
  const ajouterTournee = async (tournee) => {
  const nouvelleTournee = {
    ...tournee,
    id: tournees.length + 1,
    codeTournee: `TR-${String(tournees.length + 1).padStart(3, "0")}`,
    statut: "Planifiée",
  };

  const nouvellesTournees = [nouvelleTournee, ...tournees];
  setTournees(nouvellesTournees);
  recalculerStats(nouvellesTournees);
};

  // Modifier tournée
  const modifierTournee = async (id, tourneeModifiee) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesTournees = tournees.map((t) =>
          t.id === id ? { ...t, ...tourneeModifiee } : t
        );

        setTournees(nouvellesTournees);
        recalculerStats(nouvellesTournees);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur modification tournée", error);
    }
  };
  const changerStatutTournee = async (id, nouveau) => {
    try {
      if (USE_MOCK_DATA) {
        const nouveauxTournees = tournees.map((t) =>
          t.id === id ? { ...t, statut: nouveau } : t
        );

        setTournees(nouveauxTournees);
        recalculerStats(nouveauxTournees);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur changement état véhicule", error);
    }
  };

  // Supprimer tournée
  const supprimerTournee = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesTournees = tournees.filter(
          (t) => t.id !== id
        );

        setTournees(nouvellesTournees);
        recalculerStats(nouvellesTournees);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur suppression tournée", error);
    }
  };

  // Recalcul statistiques
  const recalculerStats = (data) => {
    setStatistiques({
     total: data.length,

  aujourdHui: data.filter(
    (t) => t.dateTournee === new Date().toISOString().slice(0, 10)
  ).length,
  
    Planifiée: data.filter(
      (t) => t.statut === "Planifiée"
    ).length,
  
    Encours: data.filter(
      (t) => t.statut === "En cours"
    ).length,
  
    Terminées: data.filter(
      (t) => t.statut === "Terminée"
    ).length,
    });
  };

  return (
    <TourneeContext.Provider
      value={{
        tournees,
        statistiques,
        fetchTournees,
        ajouterTournee,
        modifierTournee,
        changerStatutTournee,
        supprimerTournee,
        recalculerStats,
      }}
    >
      {children}
    </TourneeContext.Provider>
  );
};
