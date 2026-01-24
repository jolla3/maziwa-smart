// marketviewpage/context/BasketContext.jsx
import React, { createContext, useState, useCallback, useContext, useEffect } from "react";

const BasketContext = createContext(null);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within BasketProvider");
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("basket");
    if (saved) {
      try {
        setBasket(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading basket:", e);
      }
    }
  }, []);

  const addToBasket = useCallback((listing) => {
    setBasket((prev) => {
      const exists = prev.find((item) => item._id === listing._id);
      if (exists) return prev;
      
      const newBasket = [...prev, { ...listing, addedAt: new Date().toISOString() }];
      localStorage.setItem("basket", JSON.stringify(newBasket));
      return newBasket;
    });
  }, []);

  const removeFromBasket = useCallback((listingId) => {
    setBasket((prev) => {
      const newBasket = prev.filter((item) => item._id !== listingId);
      localStorage.setItem("basket", JSON.stringify(newBasket));
      return newBasket;
    });
  }, []);

  const isInBasket = useCallback(
    (listingId) => basket.some((item) => item._id === listingId),
    [basket]
  );

  const clearBasket = useCallback(() => {
    setBasket([]);
    localStorage.removeItem("basket");
  }, []);

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