// marketviewpage/context/WishlistContext.jsx
import React, { createContext, useState, useCallback, useContext, useEffect } from "react";

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading wishlist:", e);
      }
    }
  }, []);

  const toggleWishlist = useCallback((listingId) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId];
      
      localStorage.setItem("favorites", JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, []);

  const isInWishlist = useCallback(
    (listingId) => wishlist.includes(listingId),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    localStorage.removeItem("favorites");
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};