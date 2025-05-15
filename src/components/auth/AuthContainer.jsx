import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <RegisterForm onToggle={toggleForm} />
        )}
      </Box>
    </Container>
  );
};

export default AuthContainer; 