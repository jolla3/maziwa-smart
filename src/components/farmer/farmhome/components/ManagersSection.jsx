// farmhome/components/ManagersSection.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Mail, Phone, Users } from 'lucide-react';
import { COLORS } from '../utils/constants';

const ManagersSection = ({ managers }) => {
  if (!managers || managers.length === 0) {
    return null;
  }

  return (
    <Box mb={4}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${COLORS.blue.main}20 0%, ${COLORS.blue.main}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.blue.main,
          }}
        >
          <Users size={24} />
        </Box>
        <Typography variant="h4" fontWeight="900" color="#000000">
          Your Managers ({managers.length})
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {managers.map((manager, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${manager.email}-${index}`}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `2px solid ${COLORS.blue.main}30`,
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 12px ${COLORS.blue.main}20`,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 24px ${COLORS.blue.main}40`,
                  border: `2px solid ${COLORS.blue.main}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#000000"
                  mb={2}
                  sx={{ fontSize: '1.1rem' }}
                >
                  {manager.name || 'Unknown Manager'}
                </Typography>

                <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: `${COLORS.blue.main}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.blue.main,
                    }}
                  >
                    <Mail size={16} />
                  </Box>
                  <Typography
                    variant="body2"
                    color="#666666"
                    fontWeight="500"
                    sx={{
                      wordBreak: 'break-word',
                      fontSize: '0.85rem',
                    }}
                  >
                    {manager.email || 'No email'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: `${COLORS.green.main}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.green.main,
                    }}
                  >
                    <Phone size={16} />
                  </Box>
                  <Typography
                    variant="body2"
                    color="#666666"
                    fontWeight="500"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {manager.phone || 'No phone'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(ManagersSection);