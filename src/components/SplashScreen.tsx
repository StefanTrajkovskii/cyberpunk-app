import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import BootSequence from './BootSequence';

interface SplashScreenProps {
  onEnter: (name: string) => void;
}

// Animation keyframes
const glitchEffect = keyframes`
  0% {
    transform: translate(0);
    text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);
  }
  2% {
    transform: translate(-2px, 1px);
    text-shadow: -3px 0 rgba(255, 62, 136, 0.7);
  }
  4% {
    transform: translate(2px, -1px);
    text-shadow: 3px 0 rgba(0, 246, 255, 0.7);
  }
  6% {
    transform: translate(-2px, -1px);
    text-shadow: 3px 0 rgba(0, 246, 255, 0.7), -3px 0 rgba(255, 62, 136, 0.7);
  }
  8% {
    transform: translate(2px, 1px);
    text-shadow: -3px 0 rgba(0, 246, 255, 0.7), 3px 0 rgba(255, 62, 136, 0.7);
  }
  10% {
    transform: translate(0);
    text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);
  }
  94% {
    transform: translate(0);
    text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);
  }
  96% {
    transform: translate(-2px, 1px);
    text-shadow: -3px 0 rgba(255, 62, 136, 0.7);
  }
  98% {
    transform: translate(2px, -1px);
    text-shadow: 3px 0 rgba(0, 246, 255, 0.7);
  }
  100% {
    transform: translate(0);
    text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);
  }
`;

const scanlineEffect = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const backgroundGlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #0a0a12;
  z-index: 1000;
  overflow: hidden;
  background: linear-gradient(45deg, 
    rgba(10, 10, 18, 0.9) 0%, 
    rgba(19, 19, 42, 0.9) 33%, 
    rgba(15, 15, 35, 0.9) 66%, 
    rgba(10, 10, 18, 0.9) 100%);
  background-size: 400% 400%;
  animation: ${backgroundGlow} 15s ease infinite;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      transparent 50%, 
      rgba(0, 0, 0, 0.1) 51%, 
      rgba(0, 0, 0, 0.1) 100%);
    background-size: 100% 2px;
    pointer-events: none;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(18, 16, 16, 0.1);
    animation: ${scanlineEffect} 10s linear infinite;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 246, 255, 0.03) 0%, transparent 80%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%230a0a12"/><path d="M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M0 60 H100 M0 70 H100 M0 80 H100 M0 90 H100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/><path d="M10 0 V100 M20 0 V100 M30 0 V100 M40 0 V100 M50 0 V100 M60 0 V100 M70 0 V100 M80 0 V100 M90 0 V100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/></svg>');
  background-size: 100% 100%, 50px 50px;
  opacity: 0.7;
  pointer-events: none;
`;

const GlitchingText = styled.h1`
  color: #00f6ff;
  font-size: 4.5rem;
  font-weight: 700;
  text-transform: uppercase;
  font-family: 'Rajdhani', sans-serif;
  text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
  position: relative;
  animation: ${glitchEffect} 5s infinite;
  letter-spacing: 3px;
  z-index: 10;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
    letter-spacing: 2px;
    gap: 0.5rem;
  }
  
  span {
    color: #ff3e88;
    position: relative;
    display: inline;
    
    @media (max-width: 768px) {
      font-size: 3rem;
    }
  }
`;

const PromptContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const EnterPrompt = styled.div`
  color: #e4f3ff;
  font-size: 1.2rem;
  text-transform: uppercase;
  margin-top: 1rem;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  font-family: 'Share Tech Mono', monospace;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const NameInput = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.75rem 1.5rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  outline: none;
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-align: center;
  width: 200px;
  
  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const EnterButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00f6ff;
  color: #00f6ff;
  padding: 0.75rem 2rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VersionInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: rgba(228, 243, 255, 0.5);
  font-size: 0.8rem;
  font-family: 'Share Tech Mono', monospace;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    bottom: 0.5rem;
    right: 0.5rem;
  }
`;

const CornerDecoration = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  pointer-events: none;
  opacity: 0.6;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
  
  &.top-left {
    top: 0;
    left: 0;
    border-top: 2px solid #00f6ff;
    border-left: 2px solid #00f6ff;
  }
  
  &.top-right {
    top: 0;
    right: 0;
    border-top: 2px solid #ff3e88;
    border-right: 2px solid #ff3e88;
  }
  
  &.bottom-left {
    bottom: 0;
    left: 0;
    border-bottom: 2px solid #ff3e88;
    border-left: 2px solid #ff3e88;
  }
  
  &.bottom-right {
    bottom: 0;
    right: 0;
    border-bottom: 2px solid #00f6ff;
    border-right: 2px solid #00f6ff;
  }
`;

const SoundToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #e4f3ff;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  z-index: 20;
  
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
  }
  
  &:hover {
    opacity: 1;
  }
`;

// Sound URLs
const AMBIENT_SOUND_URL = '/sounds/ambient.mp3';
const GLITCH_SOUND_URL = '/sounds/glitch.mp3';
const ACCESS_GRANTED_SOUND_URL = '/sounds/access_granted.mp3';
const BUTTON_HOVER_SOUND_URL = '/sounds/button_hover.mp3';

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [name, setName] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);
  
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const glitchSoundRef = useRef<HTMLAudioElement | null>(null);
  const accessGrantedSoundRef = useRef<HTMLAudioElement | null>(null);
  const buttonHoverSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sound elements
  useEffect(() => {
    console.log('SplashScreen mounted, initializing sound elements');
    
    try {
      ambientSoundRef.current = new Audio(AMBIENT_SOUND_URL);
      ambientSoundRef.current.loop = true;
      ambientSoundRef.current.volume = 0.3;
      
      glitchSoundRef.current = new Audio(GLITCH_SOUND_URL);
      glitchSoundRef.current.volume = 0.4;
      
      accessGrantedSoundRef.current = new Audio(ACCESS_GRANTED_SOUND_URL);
      accessGrantedSoundRef.current.volume = 0.5;
      
      buttonHoverSoundRef.current = new Audio(BUTTON_HOVER_SOUND_URL);
      buttonHoverSoundRef.current.volume = 0.2;
    } catch (error) {
      console.warn('Error loading sound files:', error);
    }
    
    // Play glitch sound at intervals
    const glitchInterval = setInterval(() => {
      if (soundEnabled && glitchSoundRef.current) {
        try {
          glitchSoundRef.current.currentTime = 0;
          glitchSoundRef.current.play().catch(err => console.warn('Could not play glitch sound:', err));
        } catch (error) {
          console.warn('Error playing glitch sound:', error);
        }
      }
    }, 8000);
    
    return () => {
      console.log('SplashScreen unmounting, cleaning up resources');
      clearInterval(glitchInterval);
      if (ambientSoundRef.current) ambientSoundRef.current.pause();
    };
  }, [soundEnabled]);
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      try {
        ambientSoundRef.current?.play().catch(err => console.warn('Could not play ambient sound:', err));
      } catch (error) {
        console.warn('Error playing ambient sound:', error);
      }
    } else {
      ambientSoundRef.current?.pause();
    }
  };
  
  const handleNameSubmit = useCallback(() => {
    if (!name.trim()) return;
    
    console.log('Name submitted, showing main splash screen');
    setNameEntered(true);
    
    if (soundEnabled && accessGrantedSoundRef.current) {
      try {
        accessGrantedSoundRef.current.play().catch(err => console.warn('Could not play access granted sound:', err));
      } catch (error) {
        console.warn('Error playing access granted sound:', error);
      }
    }
  }, [soundEnabled, name]);
  
  const handleEnter = useCallback(() => {
    if (!name.trim()) return;
    
    console.log('handleEnter called, transitioning to main app');
    setIsEntering(true);
    
    if (soundEnabled && accessGrantedSoundRef.current) {
      try {
        accessGrantedSoundRef.current.play().catch(err => console.warn('Could not play access granted sound:', err));
      } catch (error) {
        console.warn('Error playing access granted sound:', error);
      }
    }
    
    setTimeout(() => {
      onEnter(name.trim());
    }, 1000);
  }, [soundEnabled, onEnter, name]);
  
  const playHoverSound = () => {
    if (soundEnabled && buttonHoverSoundRef.current) {
      try {
        buttonHoverSoundRef.current.currentTime = 0;
        buttonHoverSoundRef.current.play().catch(err => console.warn('Could not play button hover sound:', err));
      } catch (error) {
        console.warn('Error playing button hover sound:', error);
      }
    }
  };
  
  const handleBootComplete = () => {
    console.log('Boot sequence complete, showing splash screen');
    setBootComplete(true);
    if (soundEnabled && glitchSoundRef.current) {
      try {
        glitchSoundRef.current.play().catch(err => console.warn('Could not play glitch sound:', err));
      } catch (error) {
        console.warn('Error playing glitch sound:', error);
      }
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && bootComplete) {
        console.log('Enter key pressed, transitioning to main app');
        handleEnter();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [bootComplete, onEnter, handleEnter]);
  
  // If not boot complete, show boot sequence
  if (!bootComplete) {
    return <BootSequence onComplete={handleBootComplete} />;
  }
  
  // If name hasn't been entered yet, show name input screen
  if (!nameEntered) {
    return (
      <SplashContainer>
        <SoundToggle onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}>
          {soundEnabled ? '🔊' : '🔇'}
        </SoundToggle>
        
        <Grid />
        <CornerDecoration className="top-left" />
        <CornerDecoration className="top-right" />
        <CornerDecoration className="bottom-left" />
        <CornerDecoration className="bottom-right" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlitchingText>
            IDENTIFY<span>YOURSELF</span>
          </GlitchingText>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <PromptContainer>
            <EnterPrompt>{`// ENTER YOUR NAME`}</EnterPrompt>
            <NameInput
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit();
                }
              }}
              maxLength={10}
              autoFocus
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatType: "reverse"
              }}
              onMouseEnter={playHoverSound}
            >
              <EnterButton
                onClick={handleNameSubmit}
                disabled={!name.trim() || isEntering}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEntering ? 'PROCESSING...' : 'CONFIRM'}
              </EnterButton>
            </motion.div>
          </PromptContainer>
        </motion.div>
        
        <VersionInfo>v1.0.0_ALPHA // NIGHT CITY SECURE ACCESS</VersionInfo>
      </SplashContainer>
    );
  }
  
  // Show main splash screen with personalized greeting
  return (
    <SplashContainer onClick={handleEnter}>
      <SoundToggle onClick={(e) => {
        e.stopPropagation();
        toggleSound();
      }}>
        {soundEnabled ? '🔊' : '🔇'}
      </SoundToggle>
      
      <Grid />
      <CornerDecoration className="top-left" />
      <CornerDecoration className="top-right" />
      <CornerDecoration className="bottom-left" />
      <CornerDecoration className="bottom-right" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GlitchingText>
          HELLO<span>{name.toUpperCase()}</span>
        </GlitchingText>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <PromptContainer>
          <EnterPrompt>{`// PRESS ENTER TO CONTINUE`}</EnterPrompt>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatType: "reverse"
            }}
            onMouseEnter={playHoverSound}
          >
            <EnterButton
              onClick={handleEnter}
              disabled={isEntering}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEntering ? 'ENTERING...' : 'ENTER'}
            </EnterButton>
          </motion.div>
        </PromptContainer>
      </motion.div>
      
      <VersionInfo>v1.0.0_ALPHA // NIGHT CITY SECURE ACCESS</VersionInfo>
    </SplashContainer>
  );
};

export default SplashScreen; 