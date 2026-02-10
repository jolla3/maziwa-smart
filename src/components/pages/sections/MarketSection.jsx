import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Heart from 'lucide-react/dist/esm/icons/heart';

const WaveSeparator = ({ flip = false, color = '#fafafa' }) => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 40, md: 50 },
      overflow: 'hidden',
      lineHeight: 0,
      transform: flip ? 'rotate(180deg)' : 'none',
    }}
  >
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        fill={color}
      />
    </svg>
  </Box>
);

const MarketSection = ({ navigate }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const listings = [
    {
      image: "https://images.unsplash.com/photo-1549665730-6e6c2cb92e3e?w=400&h=300&fit=crop", // Boer‑type goat
      title: "Healthy Boer Goat – Ready for Breeding",
      description: "Mature female Boer goat, excellent for breeding and meat production. Suitable for small‑scale and commercial farmers.",
      price: "KES 15,000",
      location: "Kiambu County",
      seller: "John Kamau",
      rating: 4.8,
      tag: "Verified",
    },
    {
      image: "https://images.unsplash.com/photo-1612779223236-4e409aebe50c?w=400&h=300&fit=crop", // Pig
      title: "Large Pig – Ready for Fattening",
      description: "Well‑fed pig ready for fattening, ideal for butcheries and small‑scale pork production.",
      price: "KES 20,000",
      location: "Nakuru County",
      seller: "Mary Njeri",
      rating: 5.0,
      tag: "Featured",
    },
    {
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop", // Bull
      title: "Strong Ayrshire Bull – 3 Years",
      description: "High‑quality Ayrshire bull for breeding and herd improvement. Healthy, vaccinated, and ready for service.",
      price: "KES 130,000",
      location: "Meru County",
      seller: "Peter Ochieng",
      rating: 4.9,
      tag: "Hot Deal",
    },
    {
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop", // Cow
      title: "Premium Friesian Cow – Milking",
      description: "High‑yielding Friesian cow in full lactation. Ideal for dairy farmers looking to boost milk production.",
      price: "KES 90,000",
      location: "Uasin Gishu",
      seller: "Grace Wambui",
      rating: 4.7,
      tag: "New",
    },
    {
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop", // Another cow
      title: "Holstein Cow – High Yield",
      description: "Holstein cow with proven high milk output. Suitable for commercial dairy operations and cooperatives.",
      price: "KES 110,000",
      location: "Kiambu County",
      seller: "David Kiprop",
      rating: 4.9,
      tag: "Premium",
    },
  ];

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'background.paper' }}>
      <WaveSeparator flip color="#ffffff" />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              Browse the Livestock Marketplace
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', mb: 3 }}
            >
              Quality goats, pigs, bulls, and dairy cows from verified farmers across Kenya — prices transparent, animals healthy and ready for farm or market.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/market')}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  px: 3,
                  py: 1.2,
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                View All Listings
              </Button>
            </motion.div>
          </motion.div>
        </Box>

        {/* Horizontal Carousel with Auto-Scroll */}
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }} // Auto-scroll from start on all screens
            transition={{
              duration: 15, // Slow for visibility
              repeat: Infinity,
              ease: 'linear',
            }}
            whileHover={{ animationPlayState: 'paused' }} // Pause on hover
            drag="x" // Manual drag
            dragConstraints={{ left: -100, right: 100 }}
            style={{
              display: 'flex',
              gap: 2,
              width: '200%', // For seamless loop
            }}
          >
            {/* Render listings twice for seamless loop */}
            {[...listings, ...listings].map((listing, index) => (
              <motion.div
                key={`${listing.title}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: (index % listings.length) * 0.1 }}
                style={{
                  width: isMobile ? 280 : 320, // Responsive box width
                  flexShrink: 0,
                  height: isMobile ? 400 : 450,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                      borderColor: 'secondary.main',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '75%',
                      overflow: 'hidden',
                      backgroundColor: '#f0f9ff',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <motion.img
                      src={listing.image}
                      alt={listing.title}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                      <Chip
                        label={listing.tag}
                        size="small"
                        sx={{
                          bgcolor: '#10b98120',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#94a3b8' }}>
                        <Heart size={16} />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'text.primary',
                        fontSize: '0.95rem',
                      }}
                    >
                      {listing.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        mb: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {listing.description}
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: 'primary.main',
                        mb: 1,
                        fontSize: '1.1rem',
                      }}
                    >
                      {listing.price}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                      <MapPin size={14} color="#64748b" />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {listing.location}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 1.5,
                        borderTop: '1px solid #f1f5f9',
                        mt: 'auto',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'secondary.main',
                            fontSize: '0.7rem',
                          }}
                        >
                          {listing.seller.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {listing.seller}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {listing.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Container>
      <WaveSeparator color="#ffffff" />
    </Box>
  );
};

export default MarketSection;
