import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animations
const glitch = keyframes`
  0% {
    text-shadow: 2px 0 0 #ff3e3e, -2px 0 0 #3effff;
    transform: translate(0);
  }
  1% {
    text-shadow: 2px 0 0 #ff3e3e, -2px 0 0 #3effff;
    transform: translate(-2px, 1px);
  }
  2% {
    text-shadow: 2px 0 0 #ff3e3e, -2px 0 0 #3effff;
    transform: translate(2px, -1px);
  }
  3% {
    text-shadow: 2px 0 0 #ff3e3e, -2px 0 0 #3effff;
    transform: translate(0);
  }
  100% {
    text-shadow: 2px 0 0 #ff3e3e, -2px 0 0 #3effff;
    transform: translate(0);
  }
`;

const dataStream = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 62, 62, 0.3);
  box-shadow: 0 0 20px rgba(255, 62, 62, 0.2);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 62, 62, 0.1) 50%,
      transparent 100%
    );
    animation: ${dataStream} 2s linear infinite;
    pointer-events: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const Title = styled.h1`
  color: #ff3e3e;
  font-family: 'Share Tech Mono', monospace;
  font-size: 2rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 62, 62, 0.5);
  animation: ${glitch} 3s infinite;
`;

const Subtitle = styled.div`
  color: rgba(255, 62, 62, 0.7);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #ff3e3e;
  color: #ff3e3e;
  padding: 0.5rem 1rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 62, 62, 0.1);
    transition: 0.3s;
  }

  &:hover {
    background: rgba(255, 62, 62, 0.1);
    box-shadow: 0 0 20px rgba(255, 62, 62, 0.2);

    &::before {
      left: 100%;
    }
  }
`;

const WorkoutSchedule = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 62, 62, 0.3);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
`;

const ScheduleTitle = styled.h2`
  color: #ff3e3e;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DaySchedule = styled.div<{ isToday: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: ${props => props.isToday ? 'rgba(255, 62, 62, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.isToday ? 'rgba(255, 62, 62, 0.5)' : 'rgba(255, 62, 62, 0.2)'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 62, 62, 0.1);
    border-color: rgba(255, 62, 62, 0.5);
  }
`;

const DayName = styled.div`
  color: #ff3e3e;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WorkoutType = styled.div`
  color: rgba(255, 62, 62, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

interface GymTrackerProps {
  onBack: () => void;
}

const GymTracker: React.FC<GymTrackerProps> = ({ onBack }) => {
  const [currentDay, setCurrentDay] = useState<string>('');

  useEffect(() => {
    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setCurrentDay(days[today]);
  }, []);

  const workoutSchedule = {
    Monday: 'PUSH',
    Tuesday: 'PULL',
    Wednesday: 'LEGS',
    Thursday: 'PUSH',
    Friday: 'PULL',
    Saturday: 'LEGS',
    Sunday: 'REST'
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>GYM TRACKER</Title>
          <Subtitle>PHYSICAL_ENHANCEMENT_OS v1.0</Subtitle>
        </div>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BACK
        </BackButton>
      </Header>

      <WorkoutSchedule>
        <ScheduleTitle>WEEKLY PROTOCOL</ScheduleTitle>
        {Object.entries(workoutSchedule).map(([day, workout]) => (
          <DaySchedule key={day} isToday={day === currentDay}>
            <DayName>{day}</DayName>
            <WorkoutType>{workout}</WorkoutType>
          </DaySchedule>
        ))}
      </WorkoutSchedule>
    </Container>
  );
};

export default GymTracker; 