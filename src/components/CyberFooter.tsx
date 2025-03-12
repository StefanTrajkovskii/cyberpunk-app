import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const FooterContainer = styled.footer`
  background: linear-gradient(0deg, #0b0b1b 0%, transparent 100%);
  padding: 3rem 2rem 2rem;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
  
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

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  color: #00f6ff;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #ff3e88;
  }
`;

const FooterText = styled.p`
  color: #b8c0c2;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FooterLink = styled(motion.a)`
  color: #e4f3ff;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 15px;
  transition: color 0.2s ease;
  
  &::before {
    content: '>';
    position: absolute;
    left: 0;
    color: #ff3e88;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: #00f6ff;
    
    &::before {
      transform: translateX(3px);
    }
  }
`;

const FooterBottom = styled.div`
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 246, 255, 0.2);
  text-align: center;
  color: #b8c0c2;
  font-size: 0.85rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled(motion.a)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 246, 255, 0.1);
  border: 1px solid #00f6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f6ff;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
  }
`;

const CyberFooter: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>About</FooterTitle>
          <FooterText>
            The Night City Mission Board is the premier platform for edgerunners 
            seeking jobs in the neon-lit dystopian streets of Night City.
          </FooterText>
          <FooterText>
            Find work, earn eddies, and make a name for yourself.
          </FooterText>
          <SocialLinks>
            <SocialIcon 
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              href="#"
            >
              D
            </SocialIcon>
            <SocialIcon 
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              href="#"
            >
              T
            </SocialIcon>
            <SocialIcon 
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              href="#"
            >
              I
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Fixers</FooterTitle>
          <FooterGrid>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Wakako Okada
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Dexter DeShawn
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Regina Jones
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Sebastian Ibarra
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Rogue Amendiares
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Mr. Hands
            </FooterLink>
          </FooterGrid>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Locations</FooterTitle>
          <FooterGrid>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              City Center
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Watson
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Westbrook
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Heywood
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Pacifica
            </FooterLink>
            <FooterLink 
              whileHover={{ x: 5 }}
              href="#"
            >
              Santo Domingo
            </FooterLink>
          </FooterGrid>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>LEGAL</FooterTitle>
          <FooterLink 
            whileHover={{ x: 5 }}
            href="#"
          >
            Terms of Service
          </FooterLink>
          <FooterLink 
            whileHover={{ x: 5 }}
            href="#"
          >
            Privacy Policy
          </FooterLink>
          <FooterLink 
            whileHover={{ x: 5 }}
            href="#"
          >
            Cookie Policy
          </FooterLink>
          <FooterLink 
            whileHover={{ x: 5 }}
            href="#"
          >
            Corporate Disclaimer
          </FooterLink>
          <FooterText>
            <small>
              By using this service, you agree to waive all rights to litigation. 
              The Mission Board assumes no responsibility for user safety.
            </small>
          </FooterText>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>© 2077 Night City Mission Board. All rights reserved. A subsidiary of Arasaka Corporation.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default CyberFooter; 