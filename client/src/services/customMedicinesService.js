/**
 * Custom Medicines Persistence Service
 * Allows Doctors and Admins to register new medicines directly into the system.
 * Persists in localStorage and integrates dynamically with the Master Medicines Catalog.
 */

const STORAGE_KEY = 'swasthyasetu_custom_medicines';

export const customMedicinesService = {
  getCustomMedicines: () => {
    try {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error reading custom medicines:', e);
      return [];
    }
  },

  addCustomMedicine: (medicineData) => {
    try {
      if (typeof window === 'undefined') return medicineData;
      const current = customMedicinesService.getCustomMedicines();
      
      const newMed = {
        id: medicineData.id || `custom_${Date.now()}`,
        brandNames: medicineData.brandNames || [medicineData.allopathicName || 'Custom Medicine'],
        salt: medicineData.salt || medicineData.allopathicName || 'Pharmaceutical Salt',
        allopathicName: medicineData.allopathicName || 'Medicine',
        ayurvedicName: medicineData.ayurvedicName || 'આયુર્વેદિક ઔષધિ',
        diseaseUsedFor: medicineData.diseaseUsedFor || 'વિશેષ સારવાર',
        category: medicineData.category || 'સામાન્ય દવા (General Pharmacotherapy)',
        howToTakeAllopathic: medicineData.howToTakeAllopathic || 'ભોજન પછી ૧ ગોળી પાણી સાથે.',
        howToTakeAyurvedic: medicineData.howToTakeAyurvedic || '૧ ચમચી સવાર-સાંજ નવશેકા પાણી સાથે.',
        naturalCure: medicineData.naturalCure || 'પૂરતો આરામ, પુષ્કળ પાણી અને સાત્વિક ખોરાક લો.',
        precautions: medicineData.precautions || 'ડૉક્ટરના માર્ગદર્શન હેઠળ જ લેવી.',
        mrp: Number(medicineData.mrp) || 50,
        janPrice: Number(medicineData.janPrice) || 8,
        savingsPct: medicineData.savingsPct || Math.round((((Number(medicineData.mrp) || 50) - (Number(medicineData.janPrice) || 8)) / (Number(medicineData.mrp) || 50)) * 100),
        tags: medicineData.tags || [medicineData.allopathicName?.toLowerCase()],
        addedBy: medicineData.addedBy || 'Doctor / Admin',
        addedAt: new Date().toISOString()
      };

      const updated = [newMed, ...current.filter(m => m.id !== newMed.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('custom_medicines_updated', { detail: updated }));
      return newMed;
    } catch (e) {
      console.error('Error saving custom medicine:', e);
      return medicineData;
    }
  },

  deleteCustomMedicine: (id) => {
    try {
      const current = customMedicinesService.getCustomMedicines();
      const updated = current.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('custom_medicines_updated', { detail: updated }));
      return true;
    } catch (e) {
      console.error('Error deleting custom medicine:', e);
      return false;
    }
  }
};

export default customMedicinesService;
