// import React, { useState, useEffect, useContext } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../../../../PrivateComponents/AuthContext';
// import { imgUrl, getFirstImage } from '../../utils/image.utils';
// import { formatCurrency, timeAgo } from '../../utils/currency.utils';
// import axios from 'axios';

// export default function TrendingCarousel({ listings = [] }) {
//     const [current, setCurrent] = useState(0);
//     const [auto, setAuto] = useState(true);
//     const [views, setViews] = useState({});
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const { token } = useContext(AuthContext);
//     const API_BASE = process.env.REACT_APP_API_BASE;

//     // Filter only valid listings
//     const validListings = listings.filter(l =>
//         l._id && l.title && l.price > 0 && l.location
//     );

//     const item = validListings[current];

//     // Fetch views for all listings
//     useEffect(() => {
//         if (!token || !validListings.length) {
//             return;
//         }

//         const fetchViews = async () => {
//             setLoading(true);
//             const viewsData = {};

//             try {
//                 await Promise.all(
//                     validListings.map(listing =>
//                         axios.get(`${API_BASE}/market/summary/${listing._id}`, {
//                             headers: { Authorization: `Bearer ${token}` }
//                         })
//                             .then(res => {
//                                 viewsData[listing._id] = res.data.total_views || 0;
//                             })
//                             .catch(err => {
//                                 viewsData[listing._id] = 0;
//                             })
//                     )
//                 );
//                 setViews(viewsData);
//             } catch (err) {
//                 console.error('Failed to fetch views:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchViews();
//     }, [token, validListings, API_BASE]);

//     useEffect(() => {
//         if (!auto || !validListings.length) return;
//         const timer = setInterval(() => {
//             setCurrent(prev => (prev + 1) % validListings.length);
//         }, 5000);
//         return () => clearInterval(timer);
//     }, [auto, validListings.length]);

//     const prev = () => {
//         setCurrent(prev => (prev - 1 + validListings.length) % validListings.length);
//         setAuto(false);
//     };

//     const next = () => {
//         setCurrent(prev => (prev + 1) % validListings.length);
//         setAuto(false);
//     };

//     const goToSlide = (idx) => {
//         setCurrent(idx);
//         setAuto(false);
//     };

//     if (!validListings.length) return null;

//     return (
//         <div className="mb-4">
//             <div className="d-flex align-items-center gap-2 mb-3">
//                 <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '1.1rem' }}>
//                     🔥 Trending
//                 </h5>
//                 <span className="badge bg-danger">HOT</span>
//             </div>

//             <div
//                 style={{
//                     position: 'relative',
//                     borderRadius: '12px',
//                     overflow: 'hidden',
//                     backgroundColor: '#fff',
//                     boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//                 }}
//                 onMouseEnter={() => setAuto(false)}
//                 onMouseLeave={() => setAuto(true)}
//             >
//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={current}
//                         initial={{ opacity: 0, x: 100 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -100 }}
//                         transition={{ duration: 0.4 }}
//                         style={{
//                             display: 'flex',
//                             flexDirection: window.innerWidth < 768 ? 'column' : 'row',
//                             minHeight: window.innerWidth < 768 ? 'auto' : '300px',
//                         }}
//                     >
//                         {/* Image - Responsive */}
//                         <div style={{
//                             backgroundColor: '#f0fdfa',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             width: window.innerWidth < 768 ? '100%' : '45%',
//                             minHeight: window.innerWidth < 768 ? '200px' : '300px',
//                             position: 'relative',
//                         }}>
//                             <img
//                                 src={imgUrl(getFirstImage(item))}
//                                 alt={item.title}
//                                 style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     objectFit: 'cover',
//                                     transition: 'transform 0.3s',
//                                 }}
//                             />
//                             <div style={{
//                                 position: 'absolute',
//                                 top: '8px',
//                                 right: '8px',
//                                 backgroundColor: '#ef4444',
//                                 color: '#fff',
//                                 padding: '4px 12px',
//                                 borderRadius: '20px',
//                                 fontSize: '0.75rem',
//                                 fontWeight: 700,
//                             }}>
//                                 Trending
//                             </div>
//                         </div>

//                         {/* Content - Responsive */}
//                         <div style={{
//                             padding: window.innerWidth < 768 ? '1.5rem 1rem' : '2rem',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'space-between',
//                             width: window.innerWidth < 768 ? '100%' : '55%',
//                         }}>
//                             <div>
//                                 <h5 style={{
//                                     fontWeight: 700,
//                                     color: '#0f172a',
//                                     fontSize: window.innerWidth < 768 ? '1rem' : '1.3rem',
//                                     marginBottom: '0.5rem',
//                                     margin: 0,
//                                 }}>
//                                     {item.title}
//                                 </h5>

//                                 <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
//                                     <span style={{ color: '#475569' }}>📍 {item.location}</span>
//                                 </div>

//                                 <div style={{
//                                     display: 'flex',
//                                     gap: '0.5rem',
//                                     marginBottom: '1rem',
//                                     flexWrap: 'wrap',
//                                 }}>
//                                     {item.animal_id?.species && (
//                                         <span style={{
//                                             backgroundColor: '#10b98120',
//                                             color: '#10b981',
//                                             padding: '2px 8px',
//                                             borderRadius: '4px',
//                                             fontSize: '0.75rem',
//                                             fontWeight: 600,
//                                         }}>
//                                             {item.animal_id.species}
//                                         </span>
//                                     )}
//                                     {item.animal_id?.gender && (
//                                         <span style={{
//                                             backgroundColor: '#3b82f620',
//                                             color: '#3b82f6',
//                                             padding: '2px 8px',
//                                             borderRadius: '4px',
//                                             fontSize: '0.75rem',
//                                             fontWeight: 600,
//                                         }}>
//                                             {item.animal_id.gender}
//                                         </span>
//                                     )}
//                                     {item.animal_id?.stage && (
//                                         <span style={{
//                                             backgroundColor: '#8b5cf620',
//                                             color: '#8b5cf6',
//                                             padding: '2px 8px',
//                                             borderRadius: '4px',
//                                             fontSize: '0.75rem',
//                                             fontWeight: 600,
//                                         }}>
//                                             {item.animal_id.stage}
//                                         </span>
//                                     )}
//                                 </div>

//                                 <div style={{
//                                     display: 'flex',
//                                     gap: '1rem',
//                                     fontSize: '0.85rem',
//                                     color: '#0f172a',
//                                     marginBottom: '1rem',
//                                 }}>
//                                     <span>
//                                         <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
//                                         {loading ? '-' : (views[item._id] || 0)} views
//                                     </span>
//                                     <span>⏰ {timeAgo(item.createdAt)}</span>
//                                 </div>
//                             </div>

//                             <div>
//                                 <h4 style={{
//                                     fontWeight: 900,
//                                     color: '#10b981',
//                                     fontSize: window.innerWidth < 768 ? '1.3rem' : '1.8rem',
//                                     marginBottom: '1rem',
//                                     margin: 0,
//                                 }}>
//                                     {formatCurrency(item.price)}
//                                 </h4>
//                                 <button
//                                     onClick={() => navigate('/view-market', { state: { listing: item } })}
//                                     style={{
//                                         width: '100%',
//                                         backgroundColor: '#10b981',
//                                         color: '#fff',
//                                         border: 'none',
//                                         padding: window.innerWidth < 768 ? '0.75rem' : '0.85rem',
//                                         borderRadius: '8px',
//                                         fontWeight: 700,
//                                         fontSize: '0.95rem',
//                                         cursor: 'pointer',
//                                     }}
//                                 >
//                                     View Details
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>

//                 {/* Nav Buttons */}
//                 <button
//                     onClick={prev}
//                     style={{
//                         position: 'absolute',
//                         left: '8px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         border: 'none',
//                         width: '36px',
//                         height: '36px',
//                         borderRadius: '50%',
//                         cursor: 'pointer',
//                         zIndex: 10,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     <ChevronLeft size={20} color="#10b981" />
//                 </button>

//                 <button
//                     onClick={next}
//                     style={{
//                         position: 'absolute',
//                         right: '8px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         backgroundColor: 'rgba(255,255,255,0.9)',
//                         border: 'none',
//                         width: '36px',
//                         height: '36px',
//                         borderRadius: '50%',
//                         cursor: 'pointer',
//                         zIndex: 10,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     <ChevronRight size={20} color="#10b981" />
//                 </button>
//             </div>

//             {/* Dots */}
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 gap: '8px',
//                 marginTop: '1rem',
//                 flexWrap: 'wrap',
//             }}>
//                 {validListings.map((_, idx) => (
//                     <button
//                         key={idx}
//                         onClick={() => goToSlide(idx)}
//                         style={{
//                             width: current === idx ? '20px' : '8px',
//                             height: '8px',
//                             borderRadius: '4px',
//                             backgroundColor: current === idx ? '#10b981' : '#d1d5db',
//                             border: 'none',
//                             cursor: 'pointer',
//                             transition: 'all 0.3s',
//                         }}
//                     />
//                 ))}
//             </div>

//             {/* Counter */}
//             <div style={{
//                 textAlign: 'center',
//                 marginTop: '0.5rem',
//                 color: '#475569',
//                 fontSize: '0.85rem',
//             }}>
//                 {current + 1} / {validListings.length}
//             </div>
//         </div>
//     );
// }