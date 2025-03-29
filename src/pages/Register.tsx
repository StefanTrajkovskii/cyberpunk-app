import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const glitch = keyframes`
  0% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
  1% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(-2px, 1px);
  }
  2% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(2px, -1px);
  }
  3% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
  100% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
`;


const RegisterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #0a0a12;
  z-index: 1000;
  overflow: hidden;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 4rem;
  }
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 246, 255, 0.03) 0%, transparent 80%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%230a0a12"/><path d="M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M0 60 H100 M0 70 H100 M0 80 H100 M0 90 H100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/><path d="M10 0 V100 M20 0 V100 M30 0 V100 M40 0 V100 M50 0 V100 M60 0 V100 M70 0 V100 M80 0 V100 M90 0 V100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/></svg>');
  background-size: 100% 100%, 50px 50px;
  opacity: 0.7;
  pointer-events: none;
`;

const CornerDecoration = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #00f6ff;
  opacity: 0.3;
  
  &.top-left {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
  }
`;

const GlitchingText = styled(motion.div)`
  font-size: 3rem;
  font-weight: 700;
  color: #00f6ff;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 2rem;
  position: relative;
  text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
  animation: ${glitch} 6s infinite;
  
  span {
    display: block;
    color: #ff3e88;
    margin-top: 0.5rem;
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    
    span {
      font-size: 1.75rem;
      margin-top: 0.25rem;
    }
  }
`;

const RegisterForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: rgba(0, 10, 20, 0.6);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 5px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 30px rgba(0, 246, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1rem;
    max-width: 320px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const Label = styled.label`
  color: #00f6ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const RegisterButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00f6ff;
  color: #00f6ff;
  padding: 1rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(0, 246, 255, 0.2);
    transition: 0.3s;
  }
  
  &:hover {
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
    
    &::before {
      left: 0;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.9rem;
    margin-top: 0.75rem;
  }
`;

const LoginLink = styled(motion.a)`
  color: #ff3e88;
  text-decoration: none;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    text-shadow: 0 0 10px rgba(255, 62, 136, 0.7);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff3e88;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <RegisterContainer>
      <Grid />
      <CornerDecoration className="top-left" />
      <CornerDecoration className="top-right" />
      <CornerDecoration className="bottom-left" />
      <CornerDecoration className="bottom-right" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GlitchingText>
          REGISTER<span>YOURSELF</span>
        </GlitchingText>
      </motion.div>
      
      <RegisterForm
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength={20}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <RegisterButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!username || !password || !confirmPassword}
        >
          REGISTER
        </RegisterButton>
        
        <LoginLink
          onClick={() => navigate('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Already have an account? Login
        </LoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register; 