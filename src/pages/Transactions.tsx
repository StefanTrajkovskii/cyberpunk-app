import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

interface TransactionsProps {
  onBack: () => void;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  position: relative;
  width: 100%;
  text-align: center;
`;

const TitleSection = styled.div`
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: 'NIGHT CITY';
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    letter-spacing: 8px;
    color: #00f6ff;
    font-family: 'Share Tech Mono', monospace;
    opacity: 0.8;
    text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
    white-space: nowrap;
    text-align: center;
    width: 100%;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      letter-spacing: 3px;
      top: -1.8rem;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #00f6ff 50%,
      transparent 100%
    );
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.5);
  }
`;

const Title = styled.h1`
  color: #00f6ff;
  font-size: 6rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 12px;
  text-shadow: 
    0 0 20px rgba(0, 246, 255, 0.5),
    0 0 40px rgba(0, 246, 255, 0.3),
    0 0 60px rgba(0, 246, 255, 0.1);
  font-family: 'Share Tech Mono', monospace;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    letter-spacing: 6px;
  }
`;

const TransactionsContainer = styled.div`
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid #00f6ff;
  border-radius: 4px;
  padding: 2rem;
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #b8c0c2;
  font-size: 1.2rem;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 2rem 0;
  }
`;

const Transactions: React.FC<TransactionsProps> = ({ onBack }) => {
  const { user } = useUser();

  return (
    <Container>
      
      <Header>
        <TitleSection>
          <Title>Transactions</Title>
        </TitleSection>
      </Header>

      <TransactionsContainer>
        <EmptyState>
          Transaction history will be displayed here. Feature coming soon.
        </EmptyState>
      </TransactionsContainer>
    </Container>
  );
};

export default Transactions; 