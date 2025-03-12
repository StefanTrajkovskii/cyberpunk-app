import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Type definition for the mission data
interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  fixer: string;
  location: string;
  deadline: string;
}

interface MissionDetailModalProps {
  mission: Mission | null;
  onClose: () => void;
}

// Styled components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled(motion.div)`
  width: 90%;
  max-width: 700px;
  background: rgba(15, 15, 35, 0.95);
  border: 2px solid #00f6ff;
  box-shadow: 
    0 0 15px rgba(0, 246, 255, 0.7),
    0 0 30px rgba(0, 246, 255, 0.4);
  border-radius: 5px;
  padding: 0;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #0f0f23 0%, #1a1a3a 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #ff3e88;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #e4f3ff;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff3e88;
    transform: scale(1.1);
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 20px;
    background-color: currentColor;
  }
  
  &:before {
    transform: rotate(45deg);
  }
  
  &:after {
    transform: rotate(-45deg);
  }
`;

const ModalTitle = styled.h2`
  color: #ff3e88;
  margin: 0;
  font-size: 2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow:
    0 0 5px rgba(255, 62, 136, 0.7),
    0 0 10px rgba(255, 62, 136, 0.5);
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const MissionDescription = styled.p`
  color: #b8c0c2;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const MissionDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  margin-bottom: 1rem;
`;

const DetailLabel = styled.div`
  color: #00f6ff;
  font-weight: 600;
  margin-bottom: 0.3rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DetailValue = styled.div`
  color: #e4f3ff;
  font-size: 1.1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid #ff3e88;
`;

const RewardSection = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  text-align: center;
`;

const RewardAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00f6ff;
  text-shadow:
    0 0 5px rgba(0, 246, 255, 0.7),
    0 0 10px rgba(0, 246, 255, 0.5);
`;

const AcceptButton = styled(motion.button)`
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #ff3e88 0%, #ff267d 100%);
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 62, 136, 0.5);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

const DifficultyBadge = styled.span<{ level: 'easy' | 'medium' | 'hard' }>`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${({ level }) => 
    level === 'easy' ? '#10823A' : 
    level === 'medium' ? '#FF8A15' : 
    '#E93845'};
  color: white;
  position: absolute;
  top: 1.5rem;
  right: 4rem;
`;

const DecorativeLine = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff3e88, transparent);
  margin: 2rem 0;
`;

// Animation variants for framer-motion
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 50,
    transition: { 
      duration: 0.2
    } 
  }
};

const MissionDetailModal: React.FC<MissionDetailModalProps> = ({ mission, onClose }) => {
  if (!mission) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={onClose}
      >
        <ModalContainer
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>{mission.title}</ModalTitle>
            <DifficultyBadge level={mission.difficulty}>
              {mission.difficulty}
            </DifficultyBadge>
            <CloseButton onClick={onClose} />
          </ModalHeader>
          
          <ModalContent>
            <MissionDescription>{mission.description}</MissionDescription>
            
            <DecorativeLine />
            
            <MissionDetailsGrid>
              <DetailItem>
                <DetailLabel>Fixer</DetailLabel>
                <DetailValue>{mission.fixer}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>{mission.location}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Deadline</DetailLabel>
                <DetailValue>{mission.deadline}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Mission ID</DetailLabel>
                <DetailValue>{mission.id}</DetailValue>
              </DetailItem>
            </MissionDetailsGrid>
            
            <RewardSection>
              <DetailLabel>Payment Upon Completion</DetailLabel>
              <RewardAmount>{mission.reward}</RewardAmount>
            </RewardSection>
            
            <AcceptButton
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Accept Mission
            </AcceptButton>
          </ModalContent>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default MissionDetailModal; 