import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/hub');
    } catch (error) {
      console.error('Registration failed:', error);
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
          Create Account
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={4}>
          Join BookmarkHub to organize your bookmarks
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
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
              Sign in
            </Button>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default RegisterForm; 