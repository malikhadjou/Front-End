import React, { createContext, useState, useCallback } from "react";
import {
  mockVehicules,
  vehiculeStats,
} from "../data/mockDataVehicules";

export const VehiculeContext = createContext();
const USE_MOCK_DATA = true;

export const VehiculeProvider = ({ children }) => {
  const [vehicules, setVehicules] = useState([]);
  const [statistiques, setStatistiques] = useState(vehiculeStats);

  const fetchVehicules = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        setTimeout(() => {
          setVehicules(mockVehicules);
          setStatistiques(vehiculeStats);
        }, 300);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur fetch véhicules", error);
      setVehicules([]);
    }
  }, []);

  // Ajouter véhicule
  const ajouterVehicule = async (vehicule) => {
    try {
      if (USE_MOCK_DATA) {
        const nouveauVehicule = {
          ...vehicule,
          id: vehicules.length + 1,
          etat: "Disponible",
        };

        const nouveauxVehicules = [
          nouveauVehicule,
          ...vehicules,
        ];

        setVehicules(nouveauxVehicules);
        recalculerStats(nouveauxVehicules);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur ajout véhicule", error);
    }
  };

  //  Changer état véhicule
  const changerEtatVehicule = async (id, nouvelEtat) => {
    try {
      if (USE_MOCK_DATA) {
        const nouveauxVehicules = vehicules.map((v) =>
          v.id === id ? { ...v, etat: nouvelEtat } : v
        );

        setVehicules(nouveauxVehicules);
        recalculerStats(nouveauxVehicules);
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur changement état véhicule", error);
    }
  };
  const modifierVehicule = async (id, VehiculeModifie) => {
    try {
      if (USE_MOCK_DATA) {
        setVehicules(
          vehicules.map((Vehicule) =>
            Vehicule.id === id ? { ...Vehicule, ...VehiculeModifie } : Vehicule
          )
        );
      } else {
        // API call ici
      }
    } catch (error) {
      console.error("Erreur modification Vehicule", error);
    }
  };
  // supprimer véhicule
 const supprimerVehicule = async (id) => {
  try {
    if (USE_MOCK_DATA) {
      const Vehicules = vehicules.filter(
        (Vehicule) => Vehicule.id !== id
      );
      setVehicules(Vehicules);
      recalculerStats(Vehicules);
    }else {
        // API call ici
    }
  } catch (error) {
    console.error("Erreur suppression véhicule", error);
  }
};


  const recalculerStats = (data) => {
    setStatistiques({
      total: data.length,
      disponibles: data.filter((v) => v.etat === "Disponible").length,
      enMission: data.filter((v) => v.etat === "En mission").length,
      enMaintenance: data.filter((v) => v.etat === "En maintenance").length,
    });
  };

  return (
    <VehiculeContext.Provider
      value={{
        vehicules,
        statistiques,
        fetchVehicules,
        ajouterVehicule,
        changerEtatVehicule,
        modifierVehicule, 
        supprimerVehicule,
      }}
    >
      {children}
    </VehiculeContext.Provider>
  );
};
