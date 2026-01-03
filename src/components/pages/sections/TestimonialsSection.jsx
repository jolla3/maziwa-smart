// /src/pages/LandingPage/sections/TestimonialsSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import Star from 'lucide-react/dist/esm/icons/star';

const TestimonialsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: "John Kamau",
      role: "Dairy Farmer, Kiambu",
      rating: 5,
      comment: "MaziwaSmart transformed my farm operations. The milk tracking feature helped me identify my most productive cows, and I increased my daily yield by 30% in just 3 months.",
      avatar: "JK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Sarah Wanjiku",
      role: "Farm Manager, Nakuru",
      rating: 5,
      comment: "The health monitoring alerts saved one of my best cows. The system detected early signs of illness, and I got immediate vet consultation through the platform. Incredible value!",
      avatar: "SW",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Peter Ochieng",
      role: "Livestock Trader, Nairobi",
      rating: 5,
      comment: "The marketplace connected me with serious buyers. I sold 3 premium bulls within a week at fair prices. The verification system builds real trust.",
      avatar: "PO",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
    }
  ]

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              Trusted by Farmers Across Kenya
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Join thousands of farmers who are growing smarter with MaziwaSmart
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -6 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;