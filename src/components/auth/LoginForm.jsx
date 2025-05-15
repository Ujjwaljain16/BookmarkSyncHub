import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/hub');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: '400px',
          width: '100%',
          p: 4,
          borderRadius: '16px',
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={4}>
          Sign in to access your bookmarks
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #646cff 30%, #9c27b0 90%)',
              color: 'white',
              borderRadius: '20px',
              padding: '12px',
              '&:hover': {
                background: 'linear-gradient(45deg, #535bf2 30%, #7b1fa2 90%)',
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Button
              onClick={onToggle}
              sx={{
                color: '#646cff',
                textTransform: 'none',
                '&:hover': {
                  background: 'none',
                  textDecoration: 'underline',
                }
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoginForm; 