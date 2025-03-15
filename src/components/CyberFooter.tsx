import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: rgba(10, 10, 18, 0.9);
  border-top: 1px solid rgba(0, 246, 255, 0.3);
  padding: 1.5rem 0;
  margin-top: 4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00f6ff, transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusIndicator = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #23d18b;
  border-radius: 50%;
`;

const FooterText = styled.p`
  color: #b8c0c2;
  font-size: 0.9rem;
  font-family: 'Share Tech Mono', monospace;
  margin: 0;

  span {
    color: #00f6ff;
  }
`;

const CyberFooter: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <StatusIndicator
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <FooterText>
            <span>NETWORK STATUS:</span> SECURE | <span>UPTIME:</span> 99.99%
          </FooterText>
        </FooterSection>
        
        <FooterText>
          NIGHT CITY MISSION BOARD v2.0.77
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default CyberFooter; 