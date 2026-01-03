import React, { createContext, useState, useCallback } from "react";
import {
  mockDestinations,
  destinationStats,
} from "../data/mockDataDestinations.js";

export const DestinationContext = createContext();
const USE_MOCK_DATA = true;

export const DestinationProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [statistiques, setStatistiques] = useState(destinationStats);

  // Fetch destinations
  const fetchDestinations = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setDestinations(mockDestinations);
          setStatistiques(destinationStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch destinations", error);
      setDestinations([]);
    }
  }, []);

  // Ajouter destination
  const ajouterDestination = async (destination) => {
    const nouvelleDestination = {
      ...destination,
      id: destinations.length + 1,
      codeDes: `DES-${String(destinations.length + 1).padStart(3, "0")}`,
    };

    const nouvellesDestinations = [
      nouvelleDestination,
      ...destinations,
    ];

    setDestinations(nouvellesDestinations);
    recalculerStats(nouvellesDestinations);
  };

  // Modifier destination
  const modifierDestination = async (id, destinationModifiee) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesDestinations = destinations.map((d) =>
          d.id === id ? { ...d, ...destinationModifiee } : d
        );

        setDestinations(nouvellesDestinations);
        recalculerStats(nouvellesDestinations);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur modification destination", error);
    }
  };

  // Supprimer destination
  const supprimerDestination = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        const nouvellesDestinations = destinations.filter(
          (d) => d.id !== id
        );

        setDestinations(nouvellesDestinations);
        recalculerStats(nouvellesDestinations);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur suppression destination", error);
    }
  };

  // Recalcul statistiques
  const recalculerStats = (data) => {
    setStatistiques({
      total: data.length,

      nord: data.filter((d) => d.zoneGeo === "Nord").length,

      sud: data.filter((d) => d.zoneGeo === "Sud").length,

      est: data.filter((d) => d.zoneGeo === "Est").length,

      ouest: data.filter((d) => d.zoneGeo === "Ouest").length,

      international: data.filter(
        (d) => d.zoneGeo === "International"
      ).length,
    });
  };

  return (
    <DestinationContext.Provider
      value={{
        destinations,
        statistiques,
        fetchDestinations,
        ajouterDestination,
        modifierDestination,
        supprimerDestination,
        recalculerStats,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};
