import React, { createContext, useState, useCallback } from "react";
import {
  mockTarifications,
  tarificationStats,
} from "../data/mockDataTarifications.js";

export const TarificationContext = createContext();

const USE_MOCK_DATA = true;

export const TarificationProvider = ({ children }) => {
  const [tarifications, setTarifications] = useState([]);
  const [statistiques, setStatistiques] = useState(tarificationStats);

  // Fetch tarifications
  const fetchTarifications = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setTarifications(mockTarifications);
          setStatistiques(tarificationStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch tarifications", error);
      setTarifications([]);
    }
  }, []);

  // Ajouter tarification
  const ajouterTarification = async (tarif) => {
    const nouvelleTarification = {
      ...tarif,
      id: tarifications.length + 1,
      codeTarif: `TF-${String(tarifications.length + 1).padStart(3, "0")}`,
      etat: "Active",
    };

    const nouvellesTarifications = [
      nouvelleTarification,
      ...tarifications,
    ];

    setTarifications(nouvellesTarifications);
    recalculerStats(nouvellesTarifications);
  };

  // Modifier tarification
  const modifierTarification = async (id, tarificationModifiee) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesTarifications = tarifications.map((t) =>
          t.id === id ? { ...t, ...tarificationModifiee } : t
        );

        setTarifications(nouvellesTarifications);
        recalculerStats(nouvellesTarifications);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur modification tarification", error);
    }
  };

  // Changer état tarification
  const changerEtatTarification = async (id, nouvelEtat) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesTarifications = tarifications.map((t) =>
          t.id === id ? { ...t, etat: nouvelEtat } : t
        );

        setTarifications(nouvellesTarifications);
        recalculerStats(nouvellesTarifications);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur changement état tarification", error);
    }
  };

  // Supprimer tarification
  const supprimerTarification = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesTarifications = tarifications.filter(
          (t) => t.id !== id
        );

        setTarifications(nouvellesTarifications);
        recalculerStats(nouvellesTarifications);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur suppression tarification", error);
    }
  };

  // Recalcul statistiques
  const recalculerStats = (data) => {
    setStatistiques({
      total: data.length,
      actives: data.filter((t) => t.etat === "Active").length,
      suspendues: data.filter((t) => t.etat === "Suspendue").length,
      inactives: data.filter((t) => t.etat === "Inactive").length,
    });
  };

  return (
    <TarificationContext.Provider
      value={{
        tarifications,
        statistiques,
        fetchTarifications,
        ajouterTarification,
        modifierTarification,
        changerEtatTarification,
        supprimerTarification,
        recalculerStats,
      }}
    >
      {children}
    </TarificationContext.Provider>
  );
};
