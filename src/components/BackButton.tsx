import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BackButtonProps {
  onClick: () => void;
  color?: string;
  children?: React.ReactNode;
}

const StyledBackButton = styled(motion.button)<{ color?: string }>`
  background: transparent;
  border: 2px solid ${props => props.color || '#00ff9d'};
  color: ${props => props.color || '#00ff9d'};
  padding: 0.75rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => `rgba(${props.color || '0, 255, 157'}, 0.2)`};
    transition: 0.3s;
  }
  
  &:hover {
    box-shadow: 0 0 20px ${props => `rgba(${props.color || '0, 255, 157'}, 0.3)`};
    
    &::before {
      left: 0;
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
`;

const BackButton: React.FC<BackButtonProps> = ({ onClick, color, children }) => {
  return (
    <StyledBackButton
      onClick={onClick}
      color={color}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children || '← Back to Tasks'}
    </StyledBackButton>
  );
};

export default BackButton; 