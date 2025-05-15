import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CardComponent = ({ icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-10px)',
          },
        }}
      >
        <Box
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
          }}
        >
          {icon}
        </Box>
        
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1a1a1a',
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default CardComponent;