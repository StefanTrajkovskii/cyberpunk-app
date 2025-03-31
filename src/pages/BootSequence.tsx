import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

interface BootSequenceProps {
  onComplete: () => void;
}

const typeText = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #0a0a12;
  font-family: 'Share Tech Mono', monospace;
  color: #00f6ff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const BootLine = styled.div<{ $delay: number; $duration: number }>`
  white-space: nowrap;
  overflow: hidden;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  animation: ${typeText} ${props => props.$duration}s steps(${props => props.children?.toString().length || 40}) ${props => props.$delay}s forwards;
  width: 0;
  opacity: 0.9;
  position: relative;
  
  &::after {
    content: '_';
    position: absolute;
    right: -5px;
    animation: ${blink} 1s infinite;
  }
`;

const ErrorLine = styled(BootLine)`
  color: #ff3e88;
`;

const SuccessLine = styled(BootLine)`
  color: #23d18b;
`;

const InfoLine = styled(BootLine)`
  color: #e4f3ff;
  opacity: 0.7;
`;

const ProgressBar = styled.div<{ $delay: number; $duration: number }>`
  height: 20px;
  background-color: #112240;
  border: 1px solid #00f6ff;
  margin: 0.5rem 0 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0, 246, 255, 0.4);
    animation: ${typeText} ${props => props.$duration}s ease-in-out ${props => props.$delay}s forwards;
    width: 0;
  }
`;

const LoadingText = styled.div<{ $delay: number }>`
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out ${props => props.$delay}s forwards;
  margin-bottom: 0.5rem;
`;

const LogoContainer = styled.div<{ $delay: number }>`
  margin: 2rem auto;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: #ff3e88;
  text-transform: uppercase;
  letter-spacing: 5px;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out ${props => props.$delay}s forwards;
  text-shadow: 0 0 10px rgba(255, 62, 136, 0.7);
`;

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [bootComplete, setBootComplete] = useState(false);
  const finalLineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('Boot sequence started');
    
    // Add direct animation end listener for the last line
    const handleLastLineAnimationEnd = () => {
      console.log('Last line animation completed');
      // Set a very short timeout (100ms) to transition after the text is fully visible
      setTimeout(() => {
        console.log('Auto transition to HELLO PSYCHO screen');
        setBootComplete(true);
        onComplete();
      }, 500); // Short delay after animation completes
    };
    
    // Observe the final line to detect when its animation completes
    const finalLine = finalLineRef.current;
    if (finalLine) {
      finalLine.addEventListener('animationend', handleLastLineAnimationEnd);
    }
    
    // Failsafe timer as backup (in case animation event doesn't fire)
    const failsafeTimer = setTimeout(() => {
      console.log('Failsafe triggered - forcing transition');
      setBootComplete(true);
      onComplete();
    }, 7000); // 7 seconds total as failsafe
    
    return () => {
      if (finalLine) {
        finalLine.removeEventListener('animationend', handleLastLineAnimationEnd);
      }
      clearTimeout(failsafeTimer);
      console.log('Boot sequence cleanup');
    };
  }, [onComplete]);
  
  // Force transition on click
  const handleClick = () => {
    console.log('Screen clicked - forcing transition');
    setBootComplete(true);
    onComplete();
  };
  
  return (
    <Container onClick={handleClick}>
      <BootLine $delay={0.3} $duration={1.2}>
        &gt; Initializing NCMB_OS v2.077.0_b241...
      </BootLine>
      
      <BootLine $delay={1.8} $duration={0.8}>
        &gt; Checking system integrity...
      </BootLine>
      
      <InfoLine $delay={2.8} $duration={0.6}>
        | Memory: 16.4 TB Quantum Storage
      </InfoLine>
      
      <InfoLine $delay={3.1} $duration={0.6}>
        | CPU: Neural Processor MK-IV
      </InfoLine>
      
      <InfoLine $delay={3.4} $duration={0.6}>
        | Network: Secured Blackwall Connection
      </InfoLine>
      
      <ErrorLine $delay={4.0} $duration={0.5}>
        ! Warning: Unauthorized access attempts detected
      </ErrorLine>
      
      <SuccessLine $delay={4.5} $duration={0.5}>
        # Firewall active: NetWatch protection enabled
      </SuccessLine>
      
      <LoadingText $delay={4.8}>Loading core systems...</LoadingText>
      <ProgressBar $delay={4.9} $duration={0.9} />
      
      <BootLine ref={finalLineRef} $delay={5.8} $duration={0.5}>
        &gt; System ready. Welcome to Night City.
      </BootLine>
      
      {bootComplete && (
        <LogoContainer $delay={0.1}>
          NC_MISSION_BOARD
        </LogoContainer>
      )}
    </Container>
  );
};

export default BootSequence; 