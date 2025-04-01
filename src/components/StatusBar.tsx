import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

interface StatusBarProps {
  eventCount?: number;
  hideEvents?: boolean;
}

const StatusBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 5px;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 0.6rem;
    gap: 0.25rem;
  }
`;

const StatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Share Tech Mono', monospace;

  @media (max-width: 768px) {
    gap: 0.25rem;
    font-size: 0.7rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
  }
`;

const GlitchText = styled(motion.span)`
  color: #00f6ff;
  text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);

  @media (max-width: 768px) {
    font-size: 0.7rem;
    min-width: 60px;
  }
`;

const StatusHighlight = styled.span`
  color: #23d18b;
  text-shadow: 0 0 5px rgba(35, 209, 139, 0.7);

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const StatusBar: React.FC<StatusBarProps> = ({ eventCount = 0, hideEvents = false }) => {
  const { user } = useUser();
  
  return (
    <StatusBarContainer>
      <StatusText>
        <GlitchText
          data-text="SYSTEM:"
          animate={{
            x: [0, -2, 0, 2, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 5
          }}
        >
          SYSTEM:
        </GlitchText>
        <span>Welcome, {user?.username || 'netrunner'}{!hideEvents && `. ${eventCount} events`}</span>
      </StatusText>
      
      <StatusText>
        <GlitchText
          data-text="STATUS:"
          animate={{
            x: [0, -1, 0, 1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 7
          }}
        >
          STATUS:
        </GlitchText>
        <span>{new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })} | <StatusHighlight>SECURE</StatusHighlight></span>
      </StatusText>
      
      <StatusText>
        <GlitchText
          data-text="BALANCE:"
          animate={{
            x: [0, -1, 0, 1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 6
          }}
        >
          BALANCE:
        </GlitchText>
        <span>¥{user?.currency?.toLocaleString() || '0'}</span>
      </StatusText>
    </StatusBarContainer>
  );
};

export default StatusBar; 