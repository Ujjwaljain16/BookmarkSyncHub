import React from 'react';
import { Stack, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Stack 
        direction='row' 
        justifyContent='space-between' 
        alignItems='center'
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: { xs: '10px 20px', md: '15px 40px' },
        }}
      >
        <Link to='/'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="BookmarkHub"
              sx={{
                height: { xs: '40px', md: '48px' },
                width: 'auto'
              }}
            />
          </motion.div>
        </Link>

        <Stack 
          direction='row' 
          spacing={4} 
          alignItems='center'
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          <Link 
            to='/' 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to='/hub' 
            className={`nav-link ${location.pathname === '/hub' ? 'active' : ''}`}
          >
            My Bookmarks
          </Link>
          <Link 
            to='/settings' 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            Settings
          </Link>
          <Button 
            variant="contained"
            component={Link}
            to="/hub"
            sx={{
              background: 'linear-gradient(45deg, #646cff 30%, #9c27b0 90%)',
              color: 'white',
              borderRadius: '20px',
              padding: '8px 24px',
              '&:hover': {
                background: 'linear-gradient(45deg, #535bf2 30%, #7b1fa2 90%)',
              }
            }}
          >
            Go to Hub
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Navbar;