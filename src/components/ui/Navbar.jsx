import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" className="nav-link">
            BookmarkHub
          </Link>
          {user && (
            <>
              <Link to="/hub" className={`nav-link ${location.pathname === '/hub' ? 'active' : ''}`}>
                My Bookmarks
              </Link>
              <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
                Settings
              </Link>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#646cff' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate('/auth')}
                sx={{
                  borderColor: '#646cff',
                  color: '#646cff',
                  '&:hover': {
                    borderColor: '#535bf2',
                    bgcolor: 'rgba(100, 108, 255, 0.04)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/auth')}
                sx={{
                  background: 'linear-gradient(45deg, #646cff 30%, #9c27b0 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #535bf2 30%, #7b1fa2 90%)',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;