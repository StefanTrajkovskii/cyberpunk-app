import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NavHeaderProps {
  missionCount: number;
}

// Styled components
const HeaderContainer = styled.header`
  background: linear-gradient(90deg, #0b0b1b 0%, #1a1a3a 100%);
  padding: 1rem 2rem;
  border-bottom: 2px solid #00f6ff;
  box-shadow: 0 0 20px rgba(0, 246, 255, 0.4);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const GlitchLogo = styled(motion.div)`
  position: relative;
  
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
  
  @keyframes glitch-anim-1 {
    0% {
      clip: rect(8px, 9999px, 44px, 0);
    }
    20% {
      clip: rect(79px, 9999px, 33px, 0);
    }
    40% {
      clip: rect(32px, 9999px, 93px, 0);
    }
    60% {
      clip: rect(19px, 9999px, 67px, 0);
    }
    80% {
      clip: rect(65px, 9999px, 23px, 0);
    }
    100% {
      clip: rect(84px, 9999px, 77px, 0);
    }
  }
  
  @keyframes glitch-anim-2 {
    0% {
      clip: rect(12px, 9999px, 32px, 0);
    }
    20% {
      clip: rect(54px, 9999px, 12px, 0);
    }
    40% {
      clip: rect(98px, 9999px, 71px, 0);
    }
    60% {
      clip: rect(33px, 9999px, 81px, 0);
    }
    80% {
      clip: rect(64px, 9999px, 11px, 0);
    }
    100% {
      clip: rect(29px, 9999px, 91px, 0);
    }
  }
`;

const Tagline = styled.p`
  color: #b8c0c2;
  margin: 0.5rem 0 0;
  font-size: 1rem;
  letter-spacing: 1px;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavItem = styled(motion.a)`
  color: #e4f3ff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 0;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #ff3e88;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const UserPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
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
  flex-direction: column;
`;

const Username = styled.span`
  color: #00f6ff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserStatus = styled.span`
  color: #b8c0c2;
  font-size: 0.8rem;
`;

const StatsTag = styled(motion.div)`
  background: rgba(255, 62, 136, 0.2);
  border: 1px solid #ff3e88;
  color: #ff3e88;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ff3e88;
    box-shadow: 0 0 8px #ff3e88;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 62, 136, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 62, 136, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 62, 136, 0);
    }
  }
`;

const NavHeader: React.FC<NavHeaderProps> = ({ missionCount }) => {
  const [currentUser] = useState({
    name: 'V',
    status: 'Connected'
  });

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo>
            <GlitchLogo>NC_MISSION_BOARD</GlitchLogo>
          </Logo>
          <Tagline>Find a job. Get paid. Stay alive.</Tagline>
        </LogoContainer>
        
        <NavMenu>
          <NavItem 
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Missions
          </NavItem>
          <NavItem 
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Fixers
          </NavItem>
          <NavItem 
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Contracts
          </NavItem>
          <NavItem 
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            About
          </NavItem>
        </NavMenu>
        
        <UserPanel>
          <StatsTag
            whileHover={{ scale: 1.05 }}
          >
            {missionCount} Active Missions
          </StatsTag>
          
          <UserInfo>
            <Username>{currentUser.name}</Username>
            <UserStatus>{currentUser.status}</UserStatus>
          </UserInfo>
          
          <Avatar>V</Avatar>
        </UserPanel>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default NavHeader; 