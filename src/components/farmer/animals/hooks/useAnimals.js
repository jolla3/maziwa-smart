// animals/hooks/useAnimals.js
import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../../PrivateComponents/AuthContext';
import animalApi from '../api/animalApi';

// Helper: Normalize animal data structure
const normalizeAnimal = (a) => ({
  ...a,
  id: a.id || a._id, // Ensure consistent ID
});

const useAnimals = () => {
  const { token } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Generate cache key with token to scope per user
  const CACHE_KEY = `animalDashboardCache_${token}`;

  const loadCachedAnimals = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setAnimals(parsed.map(normalizeAnimal));
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load cached animals:', err);
    }
    return false;
  }, [CACHE_KEY]);

  const saveCacheAnimals = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to cache animals:', err);
    }
  }, [CACHE_KEY]);

  const fetchAnimals = useCallback(async (showRefreshing = false, filters = {}) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    // Don't use cache if filters are active
    const hasFilters = Object.keys(filters).length > 0;
    const hasCache = !hasFilters && loadCachedAnimals();
    
    if (showRefreshing) {
      setRefreshing(true);
    } else if (!hasCache && animals.length === 0) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    setError(null);
    
    try {
      const response = await animalApi.getAnimals(token, filters);
      
      if (response?.animals) {
        const normalized = response.animals.map(normalizeAnimal);
        setAnimals(normalized);
        
        // Only cache if no filters
        if (!hasFilters) {
          saveCacheAnimals(normalized);
        }
        
        if (showRefreshing) {
          setSuccess('Animal data refreshed successfully!');
        }
      }
    } catch (err) {
      console.error('Failed to fetch animals:', err);
      const errorMessage = err.code === 'ECONNABORTED' 
        ? 'Request timed out. Please check your connection and try again.'
        : err.response?.data?.message || 'Failed to fetch animals. Please try again later.';
      setError(errorMessage);
      
      if (!showRefreshing && !hasFilters) {
        loadCachedAnimals();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, animals.length, loadCachedAnimals, saveCacheAnimals]);

  const addAnimal = useCallback(async (formData) => {
    if (!formData.cow_name || !formData.species) {
      setError('Name and species are required');
      return false;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'photos' && key !== 'newPhotos') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Handle new photos
      if (formData.newPhotos && formData.newPhotos.length > 0) {
        formData.newPhotos.forEach((photo) => {
          formDataToSend.append('photos', photo);
        });
      }

      const response = await animalApi.createAnimal(token, formDataToSend);

      if (response?.animal) {
        const updatedAnimals = [...animals, normalizeAnimal(response.animal)];
        setAnimals(updatedAnimals);
        saveCacheAnimals(updatedAnimals);
        setSuccess(`${formData.species} added successfully!`);
        return true;
      }
    } catch (err) {
      console.error('Failed to add animal:', err);
      setError(err.response?.data?.message || 'Failed to add animal');
      return false;
    }
  }, [token, animals, saveCacheAnimals]);

  const updateAnimal = useCallback(async (id, formData) => {
    if (!id) return false;

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'photos' && key !== 'newPhotos') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Handle existing photos (send as array)
      if (formData.photos && Array.isArray(formData.photos)) {
        formData.photos.forEach(photoUrl => {
          formDataToSend.append('photos', photoUrl);
        });
      }
      
      // Handle new photos
      if (formData.newPhotos && formData.newPhotos.length > 0) {
        formData.newPhotos.forEach((photo) => {
          formDataToSend.append('photos', photo);
        });
      }

      const response = await animalApi.updateAnimal(token, id, formDataToSend);

      if (response?.animal) {
        const updatedAnimals = animals.map(a => 
          a.id === id ? normalizeAnimal(response.animal) : a
        );
        setAnimals(updatedAnimals);
        saveCacheAnimals(updatedAnimals);
        setSuccess('Animal updated successfully!');
        return true;
      }
    } catch (err) {
      console.error('Failed to update animal:', err);
      setError(err.response?.data?.message || 'Failed to update animal');
      return false;
    }
  }, [token, animals, saveCacheAnimals]);

  const deleteAnimal = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return false;

    try {
      await animalApi.deleteAnimal(token, id);

      const updatedAnimals = animals.filter(a => a.id !== id);
      setAnimals(updatedAnimals);
      saveCacheAnimals(updatedAnimals);
      setSuccess('Animal deleted successfully!');
      return true;
    } catch (err) {
      console.error('Failed to delete animal:', err);
      setError(err.response?.data?.message || 'Failed to delete animal');
      return false;
    }
  }, [token, animals, saveCacheAnimals]);

  const clearMessages = useCallback(() => {
    setSuccess(null);
    setError(null);
  }, []);

  useEffect(() => {
    loadCachedAnimals();
    fetchAnimals();
  }, []);

  return {
    animals,
    loading,
    refreshing,
    error,
    success,
    fetchAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    clearMessages,
  };
};

export default useAnimals;