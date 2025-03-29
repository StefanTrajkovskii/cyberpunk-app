import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

interface NavHeaderProps {
  missionCount: number;
  currency: number;
  currentView: 'daily' | 'missions' | 'market' | 'messages';
  onViewChange: (view: 'daily' | 'missions' | 'market' | 'messages') => void;
  userName: string;
  onLogout: () => void;
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
  
  @media (max-width: 768px) {
    padding: 0.5rem;
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
  
  @media (max-width: 768px) {
    padding: 0;
    gap: 0.5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -30px;
  padding-left: 0;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-right: auto;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }
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
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin: 0.4rem 0 0;
    padding-left: 20px;
    letter-spacing: 1px;
  }
  
  &::before {
    content: '>>';
    position: absolute;
    left: 2px;
    color: #ff3e88;
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin: 0;
    margin-bottom: 1rem;
    padding: 0.8rem 1.2rem;
    font-size: 1.1rem;
    background: rgba(10, 10, 18, 0.95);
    border-width: 2px;
    box-shadow: 0 0 15px rgba(35, 209, 139, 0.3);

    &::before {
      font-size: 1.2rem;
      margin-right: 0.4rem;
    }
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

const MenuIconWrapper = styled.div<{ isOpen: boolean }>`
  width: 20px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #00f6ff;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    box-shadow: 0 0 5px rgba(0, 246, 255, 0.5);

    &:nth-child(1) {
      top: ${({ isOpen }) => isOpen ? '9px' : '0px'};
      transform: ${({ isOpen }) => isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      top: 9px;
      opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
      transform: ${({ isOpen }) => isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    &:nth-child(3) {
      top: ${({ isOpen }) => isOpen ? '9px' : '18px'};
      transform: ${({ isOpen }) => isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #00f6ff;
  cursor: pointer;
  z-index: 1000;
  padding: 0.5rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 246, 255, 0.3);
    border-radius: 50%;
    margin-left: 0.5rem;
    
    &:hover {
      background: rgba(0, 246, 255, 0.1);
    }
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: rgba(10, 10, 18, 0.95);
    backdrop-filter: blur(10px);
    border-left: 1px solid rgba(0, 246, 255, 0.3);
    padding: 5rem 1.5rem;
    z-index: 999;
  }
`;

const MobileNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileNavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  background: ${({ active }) => active ? 'rgba(0, 246, 255, 0.1)' : 'transparent'};
  border: 1px solid ${({ active }) => active ? '#00f6ff' : 'rgba(0, 246, 255, 0.3)'};
  color: ${({ active }) => active ? '#00f6ff' : '#e4f3ff'};
  padding: 0.8rem;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(0, 246, 255, 0.1);
    border-color: #00f6ff;
  }
`;

const MobileUserSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 246, 255, 0.3);
  
  ${CurrencyDisplay} {
    margin-bottom: 1.5rem;
    animation: ${pulseGlow} 3s infinite;
  }
`;

const MobileLogoutButton = styled.button`
  width: 100%;
  background: rgba(255, 62, 88, 0.1);
  border: 1px solid rgba(255, 62, 88, 0.3);
  color: #ff3e88;
  padding: 0.8rem;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(255, 62, 88, 0.2);
    border-color: #ff3e88;
    box-shadow: 0 0 15px rgba(255, 62, 88, 0.3);
  }

  &::before {
    content: '>';
    margin-right: 0.5rem;
    opacity: 0.7;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(10, 10, 18, 0.95);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.5rem;
  min-width: 150px;
  z-index: 1000;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 62, 88, 0.1);
    color: #ff3e88;
  }

  &::before {
    content: '>';
    color: #ff3e88;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const UserPanelContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(15, 15, 35, 0.95);
  border: 2px solid #00f6ff;
  border-radius: 5px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 246, 255, 0.2);
  color: #e4f3ff;
  width: 90%;
  max-width: 400px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00f6ff, transparent);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  color: #00f6ff;
  margin: 0;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
`;

const CloseButton = styled.button`
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
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  color: #00f6ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
`;

const Input = styled.input`
  width: 100%;
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

  &::placeholder {
    color: rgba(228, 243, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #00f6ff;
  color: #00f6ff;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
  }
  
  &.cancel {
    border-color: #ff3e88;
    color: #ff3e88;
    
    &:hover {
      background: rgba(255, 62, 136, 0.1);
      box-shadow: 0 0 20px rgba(255, 62, 136, 0.3);
    }
  }
`;

const NavHeader: React.FC<NavHeaderProps> = ({ missionCount, currency, currentView, onViewChange, userName, onLogout }) => {
  const { logout, updateCurrency } = useUser();
  const [currentUser] = useState({
    name: userName,
    status: 'Connected'
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState(currency.toLocaleString());

  const handleLogout = () => {
    logout();
    onLogout();
    setIsUserDropdownOpen(false);
  };

  const formatNumberWithCommas = (value: string) => {
    // Remove any existing commas and non-digit characters
    const numberOnly = value.replace(/[^\d]/g, '');
    // Convert to number and back to string with commas
    return numberOnly === '' ? '' : parseInt(numberOnly, 10).toLocaleString();
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setNewCurrency(formattedValue);
  };

  const handleCurrencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newCurrency.replace(/,/g, ''), 10);
    if (!isNaN(amount) && amount >= 0) {
      updateCurrency(amount);
      setIsCurrencyModalOpen(false);
    }
  };

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
          
          <CurrencyDisplay onClick={() => setIsCurrencyModalOpen(true)} style={{ cursor: 'pointer' }}>
            {currency.toLocaleString()}
          </CurrencyDisplay>
          
          <UserPanelContainer onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
            <UserPanel>
              <Avatar>{currentUser.name.charAt(0).toUpperCase()}</Avatar>
              <UserInfo>
                <Username>{currentUser.name}</Username>
                <UserStatus>{currentUser.status}</UserStatus>
              </UserInfo>
            </UserPanel>
            
            <AnimatePresence>
              {isUserDropdownOpen && (
                <UserDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownItem onClick={handleLogout}>
                    LOGOUT
                  </DropdownItem>
                </UserDropdown>
              )}
            </AnimatePresence>
          </UserPanelContainer>
        </NavContainer>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuIconWrapper isOpen={isMobileMenuOpen}>
            <span></span>
            <span></span>
            <span></span>
          </MenuIconWrapper>
        </MobileMenuButton>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <MobileNavList>
                <MobileNavItem 
                  active={currentView === 'daily'}
                  onClick={() => {
                    onViewChange('daily');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <NavItemIndicator />
                  DAILY TASKS
                </MobileNavItem>
                <MobileNavItem 
                  active={currentView === 'missions'}
                  onClick={() => {
                    onViewChange('missions');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <NavItemIndicator />
                  MISSIONS
                </MobileNavItem>
                <MobileNavItem 
                  active={currentView === 'market'}
                  onClick={() => {
                    onViewChange('market');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <NavItemIndicator />
                  MARKET
                </MobileNavItem>
                <MobileNavItem 
                  active={currentView === 'messages'}
                  onClick={() => {
                    onViewChange('messages');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <NavItemIndicator />
                  MESSAGES
                </MobileNavItem>
              </MobileNavList>

              <MobileUserSection>
                <CurrencyDisplay 
                  onClick={() => {
                    setIsCurrencyModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {currency.toLocaleString()}
                </CurrencyDisplay>
                <UserPanel>
                  <Avatar>{currentUser.name.charAt(0).toUpperCase()}</Avatar>
                  <UserInfo>
                    <Username>{currentUser.name}</Username>
                    <UserStatus>{currentUser.status}</UserStatus>
                  </UserInfo>
                </UserPanel>
                <MobileLogoutButton onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}>
                  Logout
                </MobileLogoutButton>
              </MobileUserSection>
            </MobileMenu>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCurrencyModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCurrencyModalOpen(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '400px' }}
              >
                <ModalHeader>
                  <ModalTitle>Update Currency</ModalTitle>
                  <CloseButton onClick={() => setIsCurrencyModalOpen(false)}>×</CloseButton>
                </ModalHeader>

                <form onSubmit={handleCurrencySubmit}>
                  <FormGroup>
                    <Label htmlFor="currency">Amount (¥)</Label>
                    <Input
                      type="text"
                      id="currency"
                      value={newCurrency}
                      onChange={handleCurrencyChange}
                      placeholder="Enter amount"
                      required
                    />
                  </FormGroup>

                  <ButtonGroup>
                    <Button
                      className="cancel"
                      type="button"
                      onClick={() => setIsCurrencyModalOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      CANCEL
                    </Button>
                    <Button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      UPDATE
                    </Button>
                  </ButtonGroup>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default NavHeader;