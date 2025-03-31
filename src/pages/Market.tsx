import React from 'react';
import styled from 'styled-components';
interface MarketProps {
  onBack: () => void;
}

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: #0a0a12;
  color: #e4f3ff;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  padding: 1rem;
  background: rgba(20, 0, 0, 0.95);
  border: 1px solid rgba(0, 162, 255, 0.3);

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0.75rem;
    min-height: 60px;
  }
`;

const Title = styled.h1`
  color: #00a2ff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 2rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
`;

const Subtitle = styled.div`
  color: rgba(0, 162, 255, 0.7);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.6rem;
    color: rgba(0, 162, 255, 0.4);
    letter-spacing: 0.5px;
  }
`;

const Market: React.FC<MarketProps> = ({ onBack }) => {
  return (
    <Container>
      <Header>
        <div>
          <Title>NIGHT CITY MARKET</Title>
          <Subtitle>TRADE_SYSTEM v1.0</Subtitle>
        </div>
      </Header>
    </Container>
  );
};

export default Market; 