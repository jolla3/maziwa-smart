import React, { createContext, useState, useCallback, useContext, useEffect } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";

const BasketContext = createContext(null);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within BasketProvider");
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userId = user?._id || "guest";
  const storageKey = `basket_${userId}`;

  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setBasket(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading basket:", e);
      }
    }
  }, [storageKey]);

  const addToBasket = useCallback((listing) => {
    setBasket((prev) => {
      const exists = prev.find((item) => item._id === listing._id);
      if (exists) return prev;
      
      const newBasket = [...prev, { ...listing, addedAt: new Date().toISOString() }];
      localStorage.setItem(storageKey, JSON.stringify(newBasket));
      return newBasket;
    });
  }, [storageKey]);

  const removeFromBasket = useCallback((listingId) => {
    setBasket((prev) => {
      const newBasket = prev.filter((item) => item._id !== listingId);
      localStorage.setItem(storageKey, JSON.stringify(newBasket));
      return newBasket;
    });
  }, [storageKey]);

  const isInBasket = useCallback(
    (listingId) => basket.some((item) => item._id === listingId),
    [basket]
  );

  const clearBasket = useCallback(() => {
    setBasket([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        isInBasket,
        clearBasket,
        basketCount: basket.length,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};