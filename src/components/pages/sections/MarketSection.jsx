// /src/pages/LandingPage/sections/MarketSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Typography, Button, Card, CardContent, Chip, Avatar, IconButton } from '@mui/material';
import Slider from 'react-slick';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Heart from 'lucide-react/dist/esm/icons/heart';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Wave Separator
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

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: -10, md: -20 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
    }}
  >
    <ChevronLeft size={24} />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: -10, md: -20 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
    }}
  >
    <ChevronRight size={24} />
  </IconButton>
);

const MarketSection = ({ navigate }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const listings = [
    {
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop",
      title: "Premium Friesian Cow",
      price: "KES 85,000",
      location: "Kiambu County",
      seller: "John Kamau",
      rating: 4.8,
      tag: "Verified"
    },
    {
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop",
      title: "Ayrshire Bull - 2 Years",
      price: "KES 120,000",
      location: "Nakuru County",
      seller: "Mary Njeri",
      rating: 5.0,
      tag: "Featured"
    },
    {
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
      title: "Fresh Dairy Milk - Daily",
      price: "KES 55/L",
      location: "Nyandarua County",
      seller: "Peter Ochieng",
      rating: 4.9,
      tag: "Bulk Deal"
    },
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      title: "Napier Grass Seedlings",
      price: "KES 15,000",
      location: "Meru County",
      seller: "Grace Wambui",
      rating: 4.7,
      tag: "New"
    },
    {
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop",
      title: "Holstein Heifer",
      price: "KES 65,000",
      location: "Uasin Gishu",
      seller: "David Kiprop",
      rating: 4.9,
      tag: "Premium"
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, arrows: false }
      }
    ]
  };

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
              Browse the Marketplace
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', mb: 3 }}>
              Featured listings from verified farmers across Kenya — quality guaranteed, prices transparent
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

        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Slider {...sliderSettings}>
            {listings.map((listing, index) => (
              <Box key={index} sx={{ px: 1.5 }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: 'white',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        borderColor: 'secondary.main',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={listing.image}
                      alt={listing.title}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    />
                    <CardContent sx={{ p: 2 }}>
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
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: '0.95rem' }}>
                        {listing.title}
                      </Typography>

                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, fontSize: '1.1rem' }}>
                        {listing.price}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                        <MapPin size={14} color="#64748b" />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {listing.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main', fontSize: '0.7rem' }}>
                            {listing.seller.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
                            {listing.seller}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <Star size={14} fill="#fbbf24" color="#fbbf24" />
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
                            {listing.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
      <WaveSeparator color="#ffffff" />
    </Box>
  );
};

export default MarketSection;