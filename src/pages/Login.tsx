import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const glitch = keyframes`
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                 -0.04em -0.025em 0 #fffc00;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #00a2ff;
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  animation: ${glitch} 725ms infinite;
  font-family: 'Share Tech Mono', monospace;
`;

const LoginForm = styled.form`
  background: rgba(0, 162, 255, 0.05);
  border: 2px solid #00a2ff;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  background: rgba(0, 162, 255, 0.1);
  border: 1px solid #00a2ff;
  color: #00a2ff;
  padding: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 162, 255, 0.3);
  }

  &::placeholder {
    color: rgba(0, 162, 255, 0.5);
  }
`;

const LoginButton = styled(motion.button)`
  background: #00a2ff;
  border: none;
  color: #000;
  padding: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
`;

const Login: React.FC = () => {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    login(username);
  };

  return (
    <Container>
      <Title>CYBERPUNK OS</Title>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
          }}
          autoFocus
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!username.trim()}
        >
          Login
        </LoginButton>
      </LoginForm>
    </Container>
  );
};

export default Login; 