import React from 'react';
import { Box, Stack, Typography, Grid, IconButton } from '@mui/material';
import { GitHub, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(45deg, #646cff 30%, #9c27b0 90%)',
        color: 'white',
        mt: '80px'
      }}
    >
      <Stack 
        spacing={4}
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: { xs: '40px 20px', md: '60px 40px' }
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              BookmarkHub
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Your intelligent bookmarking solution for a more organized digital life.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Product
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Pricing
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Chrome Extension
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Company
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                About
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Blog
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Careers
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Connect With Us
            </Typography>
            <Stack direction="row" spacing={2}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton sx={{ color: 'white' }}>
                  <GitHub />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton sx={{ color: 'white' }}>
                  <Instagram />
                </IconButton>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            pt: 4,
            mt: 4
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2024 BookmarkHub. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Terms of Service
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;