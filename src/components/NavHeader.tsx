import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface NavHeaderProps {
  missionCount: number;
  currency: number;
  currentView: 'daily' | 'missions' | 'market' | 'messages';
  onViewChange: (view: 'daily' | 'missions' | 'market' | 'messages') => void;
}

// Animation keyframes
const glitchFlicker = keyframes`
  0% { opacity: 1; }
  10% { opacity: 0.8; }
  20% { opacity: 1; }
  40% { opacity: 0.9; }
  42% { opacity: 1; }
  44% { opacity: 0.8; }
  46% { opacity: 1; }
  70% { opacity: 1; }
  72% { opacity: 0.4; }
  74% { opacity: 1; }
  100% { opacity: 1; }
`;

const scanLine = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const dataStreamAnimation = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 5px 0 rgba(0, 246, 255, 0.7); }
  50% { box-shadow: 0 0 20px 0 rgba(0, 246, 255, 0.7); }
  100% { box-shadow: 0 0 5px 0 rgba(0, 246, 255, 0.7); }
`;

// Styled components
const HeaderContainer = styled.header`
  position: relative;
  background: linear-gradient(90deg, rgba(11, 11, 27, 0.95) 0%, rgba(26, 26, 58, 0.95) 100%);
  padding: 1rem 2rem 1rem 0;
  border-bottom: 2px solid #00f6ff;
  box-shadow: 0 0 20px rgba(0, 246, 255, 0.4);
  z-index: 100;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(0, 246, 255, 0) 0%,
      rgba(0, 246, 255, 0.8) 50%,
      rgba(0, 246, 255, 0) 100%);
    animation: ${pulseGlow} 3s infinite;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      transparent 0px,
      rgba(0, 246, 255, 0.03) 1px,
      transparent 2px
    );
    pointer-events: none;
  }
`;

const ScanLineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 246, 255, 0.15),
    transparent
  );
  z-index: 10;
  opacity: 0.4;
  animation: ${scanLine} 8s linear infinite;
  pointer-events: none;
`;

const DataStreamEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    0deg,
    transparent 24%,
    rgba(0, 246, 255, 0.07) 25%,
    rgba(0, 246, 255, 0.07) 26%,
    transparent 27%,
    transparent 74%,
    rgba(0, 246, 255, 0.07) 75%,
    rgba(0, 246, 255, 0.07) 76%,
    transparent 77%,
    transparent
  );
  background-size: 4px 4px;
  animation: ${dataStreamAnimation} 30s linear infinite;
  opacity: 0.2;
  pointer-events: none;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  position: relative;
  padding-left: 0;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -30px;
  padding-left: 0;
`;

const Logo = styled(motion.h1)`
  margin: 0;
  color: #00f6ff;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;
`;

const GlitchLogo = styled.div`
  position: relative;
  text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
  animation: ${glitchFlicker} 6s infinite;
  
  &::before, &::after {
    content: "NC_MISSION_BOARD";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }
  
  &::before {
    left: 2px;
    text-shadow: -1px 0 #ff3e88;
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }
  
  &::after {
    left: -2px;
    text-shadow: -1px 0 #00f6ff;
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim-2 2s infinite linear alternate-reverse;
  }
`;

const Tagline = styled.p`
  color: #b8c0c2;
  margin: 0.8rem 0 0;
  font-size: 1rem;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  position: relative;
  padding-left: 25px;
  
  &::before {
    content: '>>';
    position: absolute;
    left: 2px;
    color: #ff3e88;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  background: rgba(0, 10, 20, 0.6);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 30px;
  padding: 0.4rem 1rem;
  backdrop-filter: blur(5px);
`;

const NavItemIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff3e88;
  margin-right: 6px;
  box-shadow: 0 0 8px rgba(255, 62, 136, 0.7);
`;

const NavItem = styled(motion.a)<{ active?: boolean }>`
  color: ${({ active }) => active ? '#00f6ff' : '#e4f3ff'};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.2rem 0.8rem;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ff3e88;
  }
`;

const CurrencyDisplay = styled.div`
  display: flex;
  align-items: center;
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid #23d18b;
  border-radius: 30px;
  padding: 0.4rem 1rem;
  margin-right: 1rem;
  color: #23d18b;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 0 10px rgba(35, 209, 139, 0.2);
  
  &::before {
    content: "¥";
    margin-right: 0.2rem;
    font-size: 1rem;
  }
`;

const UserPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(0, 10, 20, 0.4);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  border: 1px solid rgba(0, 246, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 15px rgba(0, 246, 255, 0.4);
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff3e88, #00f6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0a0a12;
  border: 2px solid #e4f3ff;
  box-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const Username = styled.span`
  color: #00f6ff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserStatus = styled.div`
  font-size: 0.8rem;
  color: #b8c0c2;
  display: flex;
  align-items: center;
  
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 0.3rem;
    border-radius: 50%;
    background-color: #23d18b;
  }
`;

const NavHeader: React.FC<NavHeaderProps> = ({ missionCount, currency, currentView, onViewChange }) => {
  const [currentUser] = useState({
    name: 'V',
    status: 'Connected'
  });

  return (
    <HeaderContainer>
      <ScanLineEffect />
      <DataStreamEffect />
      
      <HeaderContent>
        <LogoContainer>
          <Logo>
            <GlitchLogo>NC_MISSION_BOARD</GlitchLogo>
          </Logo>
          <Tagline>Find a job. Get paid. Stay alive.</Tagline>
        </LogoContainer>
        
        <NavContainer>
          <NavMenu>
            <NavItem 
              active={currentView === 'daily'} 
              onClick={() => onViewChange('daily')}
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
            >
              <NavItemIndicator />DAILY TASKS
            </NavItem>
            <NavItem 
              active={currentView === 'missions'} 
              onClick={() => onViewChange('missions')}
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
            >
              <NavItemIndicator />MISSIONS
            </NavItem>
            <NavItem 
              active={currentView === 'market'} 
              onClick={() => onViewChange('market')}
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
            >
              <NavItemIndicator />MARKET
            </NavItem>
            <NavItem 
              active={currentView === 'messages'} 
              onClick={() => onViewChange('messages')}
              whileHover={{ y: -2 }} 
              whileTap={{ y: 0 }}
            >
              <NavItemIndicator />MESSAGES
            </NavItem>
          </NavMenu>
          
          <CurrencyDisplay>
            {currency.toLocaleString()}
          </CurrencyDisplay>
          
          <UserPanel>
            <Avatar>{currentUser.name}</Avatar>
            <UserInfo>
              <Username>{currentUser.name}</Username>
              <UserStatus>{currentUser.status}</UserStatus>
            </UserInfo>
          </UserPanel>
        </NavContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default NavHeader; 