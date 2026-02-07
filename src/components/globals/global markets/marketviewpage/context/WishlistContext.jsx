import React, { createContext, useState, useCallback, useContext, useEffect } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext"; // Assuming this provides user info

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Assuming AuthContext has user: { _id }
  const userId = user?._id || "guest"; // Fallback for non-logged-in users
  const storageKey = `favorites_${userId}`; // User-specific key

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading wishlist:", e);
      }
    }
  }, [storageKey]); // Re-load on user change

  const toggleWishlist = useCallback((listingId) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId];
      
      localStorage.setItem(storageKey, JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, [storageKey]);

  const isInWishlist = useCallback(
    (listingId) => wishlist.includes(listingId),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

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