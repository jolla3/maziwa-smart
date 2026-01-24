// marketviewpage/utils/image.utils.js
const API_BASE = process.env.REACT_APP_API_BASE;

export const getFirstImage = (listing) => {
  if (!listing) return "";
  
  let photos = [];
  
  if (Array.isArray(listing.photos)) {
    photos = listing.photos;
  } else if (Array.isArray(listing.images)) {
    photos = listing.images;
  } else if (typeof listing.photos === "string") {
    try {
      const parsed = JSON.parse(listing.photos);
      if (Array.isArray(parsed)) photos = parsed;
    } catch {
      photos = [];
    }
  }
  
  if (photos.length > 0) return photos[0];
  return "https://placehold.co/600x400?text=No+Image";
};

export const imgUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  
  if (/^https?:\/\//.test(path)) return path;
  
  if (path.startsWith("/uploads/")) {
    const relative = path.replace("/uploads/", "");
    return `${API_BASE.replace("/api", "")}/photo/${relative}`;
  }
  
  return `${API_BASE.replace("/api", "")}${path}`;
};