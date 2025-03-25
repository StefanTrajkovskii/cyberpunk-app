import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  name: string;
  sets: number;
  muscleGroup: string;
  image?: string;
  completed?: boolean;
}

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
  padding: 1rem;

  @media (max-width: 768px) {
    background: rgba(20, 0, 0, 0.95);
    border: 1px solid rgba(255, 62, 62, 0.3);
    margin-bottom: 1rem;
    padding: 0.75rem;
    min-height: 60px;
  }
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

  @media (max-width: 768px) {
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
`;

const Subtitle = styled.div`
  color: rgba(255, 62, 62, 0.7);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.6rem;
    color: rgba(255, 62, 62, 0.4);
    letter-spacing: 0.5px;
  }
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

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid rgba(255, 62, 62, 0.3);
    margin-left: auto;
  }
`;

const WorkoutSchedule = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 62, 62, 0.3);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
`;

const DaySchedule = styled.div<{ isRest: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: ${props => props.isRest ? 'rgba(255, 62, 62, 0.05)' : 'rgba(255, 62, 62, 0.1)'};
  border: 1px solid rgba(255, 62, 62, 0.3);
  cursor: ${props => props.isRest ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isRest ? 'rgba(255, 62, 62, 0.05)' : 'rgba(255, 62, 62, 0.2)'};
    border-color: rgba(255, 62, 62, 0.5);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 1rem;
    background: ${props => props.isRest ? 'rgba(255, 62, 62, 0.05)' : 'rgba(20, 0, 0, 0.95)'};
    border: 1px solid rgba(255, 62, 62, 0.3);
    margin-bottom: 0.75rem;

    &:hover {
      transform: none;
      box-shadow: none;
      border-color: rgba(255, 62, 62, 0.3);
      background: ${props => props.isRest ? 'rgba(255, 62, 62, 0.05)' : 'rgba(20, 0, 0, 0.95)'};
    }
  }
`;

const DayName = styled.div`
  color: #ff3e3e;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 62, 62, 0.3);

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0;
    letter-spacing: 1px;
  }
`;

const WorkoutType = styled.div`
  color: rgba(255, 62, 62, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    color: rgba(255, 62, 62, 0.5);
    letter-spacing: 0.5px;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(255, 62, 62, 0.3);
  padding: 2rem;
  z-index: 1000;
  box-shadow: 0 0 50px rgba(255, 62, 62, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    padding: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 62, 62, 0.3);
`;

const ModalTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

const ExerciseList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ExerciseRow = styled.div<{ completed: boolean }>`
  background: ${props => props.completed ? 'rgba(255, 62, 62, 0.1)' : 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.completed ? 'rgba(255, 62, 62, 0.5)' : 'rgba(255, 62, 62, 0.2)'};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 62, 62, 0.1) 50%,
      transparent 100%
    );
    opacity: ${props => props.completed ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 62, 62, 0.2);
    border-color: rgba(255, 62, 62, 0.4);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    background: rgba(20, 0, 0, 0.95);
    border: 1px solid rgba(255, 62, 62, 0.3);
    border-radius: 0;
    margin-bottom: 1px;

    &:hover {
      transform: none;
      box-shadow: none;
      border-color: rgba(255, 62, 62, 0.3);
    }
  }
`;

const ExerciseContent = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  position: relative;
  min-height: 200px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    min-height: unset;
    gap: 0.5rem;
  }
`;

const ExerciseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  position: relative;
  padding-bottom: 4rem;

  @media (max-width: 768px) {
    padding-bottom: 0;
    gap: 0.75rem;
  }
`;

const ExerciseImageContainer = styled.div`
  width: 300px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(255, 62, 62, 0.2);

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 62, 62, 0.2);

  @media (max-width: 768px) {
    padding-bottom: 0.25rem;
  }
`;

const ExerciseName = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? 'rgba(255, 62, 62, 0.6)' : '#ff3e3e'};
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  color: rgba(255, 62, 62, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 0.75rem;
  }
`;

const ExerciseSets = styled.div`
  background: rgba(255, 62, 62, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 62, 62, 0.3);
  font-weight: bold;

  @media (max-width: 768px) {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
  }
`;

const MuscleGroup = styled.div`
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(255, 62, 62, 0.05);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 62, 62, 0.2);

  @media (max-width: 768px) {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    letter-spacing: 0.5px;
  }
`;

const CompleteButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 62, 62, 0.2);

  @media (max-width: 768px) {
    position: static;
    order: 3;
    padding: 0.75rem 0 0 0;
    margin-top: 0.5rem;
  }
`;

const CompleteButton = styled.button<{ completed: boolean }>`
  width: 100%;
  background: ${props => props.completed ? 'rgba(255, 62, 62, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.completed ? 'rgba(255, 62, 62, 0.6)' : 'rgba(255, 62, 62, 0.3)'};
  color: ${props => props.completed ? 'rgba(255, 62, 62, 0.6)' : '#ff3e3e'};
  padding: 0.8rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(255, 62, 62, 0.1);
    border-color: rgba(255, 62, 62, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem;
    letter-spacing: 0.5px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid #ff3e3e;
  color: #ff3e3e;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 62, 62, 0.1);
    box-shadow: 0 0 20px rgba(255, 62, 62, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
  }
`;

const ExerciseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0.9;
  border-radius: 0;
  border: none;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  isRest?: boolean;
}

interface GymTrackerProps {
  onBack: () => void;
}

const ImageModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  width: 95%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 62, 62, 0.3);
  padding: 1rem;
  z-index: 1001;
  box-shadow: 0 0 50px rgba(255, 62, 62, 0.3);
`;

const FullImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

const GymTracker: React.FC<GymTrackerProps> = ({ onBack }) => {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Add scroll lock effect
  useEffect(() => {
    if (selectedDay || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDay, selectedImage]);

  const workoutSchedule: WorkoutDay[] = [
    {
      day: 'DAY 1',
      focus: 'CHEST/BICEPS/SHOULDERS',
      exercises: [
        { 
          name: 'Reverse Fly (Cable)', 
          sets: 2, 
          muscleGroup: 'shoulders',
          image: '/assets/exercises/cable-reverse-fly.jpg'
        },
        { 
          name: 'Incline Bench Press (Smith)', 
          sets: 2, 
          muscleGroup: 'chest',
          image: '/assets/exercises/incline-bench-press.png'
        },
        { name: 'Incline Chest Press (Machine)', sets: 2, muscleGroup: 'chest', image: '/assets/exercises/incline-chest-press-machine.png' },
        { name: 'Chest Fly', sets: 2, muscleGroup: 'chest', image: '/assets/exercises/chest-fly.png' },
        { name: 'Lateral Raise (Dumbbell)', sets: 3, muscleGroup: 'shoulders', image: '/assets/exercises/dumbbell-lateral-raise.png' },
        { name: 'Biceps Curl (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/cable-bicep-curl.png' },
        { name: 'Hammer Curl (Dumbbell)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/Hammer-Curl-dumbbell.png' },
        { name: 'Forearm', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/forearm-curl.png' }
      ]
    },
    {
      day: 'DAY 2',
      focus: 'LEGS 1',
      exercises: [
        { name: 'Calf Press on Seated Leg Press', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/Calf-Press-on-Seated-Leg-Press.png' },
        { name: 'Squat (Smith Machine)', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/smith-machine-squat.png' },
        { name: 'Seated Leg Curl (Machine)', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/seated-leg-curl-machine.png' },
        { name: 'Single Leg Press', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/single-leg-press.png' },
        { name: 'Leg Extension (Machine)', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/leg-extension-machine.png' },
        { name: 'Hanging Raises', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/Hanging_Leg_Raises.png' }
      ]
    },
    {
      day: 'DAY 3',
      focus: 'BACK/TRICEPS/SHOULDERS',
      exercises: [
        { name: 'Lateral Raise (Machine)', sets: 2, muscleGroup: 'shoulders', image: '/assets/exercises/machine-lateral-raise.png' },
        { name: 'Iso-Lateral Row (Machine)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/iso-lateral-row-machine.png' },
        { name: 'Lat Pulldown (Machine)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/lat-pulldown-machine.png' },
        { name: 'Seated Row (Cable)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/seated-row-cable.png' },
        { name: 'Reverse Fly (Machine)', sets: 3, muscleGroup: 'shoulders', image: '/assets/exercises/machine-reverse-fly.png' },
        { name: 'Triceps Pushdown (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/straight-bar-tricep-pushdown.png' },
        { name: 'Triceps Extension (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/triceps-extension-cable.png' },
        { name: 'Forearm', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/forearm-curl.png' }
      ]
    },
    {
      day: 'DAY 4',
      focus: 'REST DAY',
      exercises: [],
      isRest: true
    },
    {
      day: 'DAY 5',
      focus: 'SHOULDER/ARMS',
      exercises: [
        { name: 'Overhead Press (Dumbbell)', sets: 2, muscleGroup: 'shoulders', image: '/assets/exercises/overhead-press-dumbbell.png' },
        { name: 'Lateral Raise (Cable)', sets: 2, muscleGroup: 'shoulders', image: '/assets/exercises/cable-lateral-raise.png' },
        { name: 'Lateral Raise (Machine)', sets: 2, muscleGroup: 'shoulders', image: '/assets/exercises/machine-lateral-raise.png' },
        { name: 'Reverse Fly (Machine)', sets: 3, muscleGroup: 'shoulders', image: '/assets/exercises/machine-reverse-fly.png' },
        { name: 'Biceps Curl (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/cable-bicep-curl.png' },
        { name: 'Incline Curl (Dumbbell)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/incline-curl-dumbbell.png' },
        { name: 'Triceps Pushdown (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/straight-bar-tricep-pushdown.png' },
        { name: 'Triceps Extension (Cable)', sets: 2, muscleGroup: 'arms', image: '/assets/exercises/triceps-extension-cable.png' }
      ]
    },
    {
      day: 'DAY 6',
      focus: 'LEGS 2',
      exercises: [
        { name: 'Calf Press on Leg Press', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/Calf-Press-on-Seated-Leg-Press.png' },
        { name: 'Hack Squat', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/smith-machine-squat.png' },
        { name: 'Seated Leg Curl (Machine)', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/seated-leg-curl-machine.png' },
        { name: 'Single Leg Press', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/single-leg-press.png' },
        { name: 'Leg Extensions (Machine)', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/leg-extension-machine.png' },
        { name: 'Hanging Raises', sets: 3, muscleGroup: 'legs', image: '/assets/exercises/Hanging_Leg_Raises.png' }
      ]
    },
    {
      day: 'DAY 7',
      focus: 'CHEST/BACK',
      exercises: [
        { name: 'Iso-Lateral Row (Machine)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/iso-lateral-row-machine.png' },
        { name: 'Incline Chest Press (Machine)', sets: 2, muscleGroup: 'chest', image: '/assets/exercises/incline-chest-press-machine.png' },
        { name: 'Lat Pulldown (Cable)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/lat-pulldown-machine.png' },
        { name: 'Chest Press (Machine)', sets: 2, muscleGroup: 'chest', image: '/assets/exercises/chest-press-machine.png' },
        { name: 'Seated Row (Machine)', sets: 2, muscleGroup: 'back', image: '/assets/exercises/seated-row-cable.png' },
        { name: 'Chest Fly (Cable)', sets: 2, muscleGroup: 'chest', image: '/assets/exercises/chest-fly.png' },
        { name: 'Pull Up', sets: 1, muscleGroup: 'back', image: '/assets/exercises/pull-up.png' },
        { name: 'Push Up', sets: 1, muscleGroup: 'chest', image: '/assets/exercises/push-up.png' }
      ]
    },
    {
      day: 'DAY 8',
      focus: 'REST DAY',
      exercises: [],
      isRest: true
    }
  ];

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
        {workoutSchedule.map((day) => (
          <DaySchedule
            key={day.day}
            isRest={!!day.isRest}
            onClick={() => !day.isRest && setSelectedDay(day)}
          >
            <DayName>{day.day}</DayName>
            <WorkoutType>{day.focus}</WorkoutType>
          </DaySchedule>
        ))}
      </WorkoutSchedule>

      <AnimatePresence>
        {selectedDay && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!selectedImage) setSelectedDay(null);
              }}
            />
            <Modal
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <ModalHeader>
                <ModalTitle>
                  <DayName>{selectedDay.day}</DayName>
                  <WorkoutType>{selectedDay.focus}</WorkoutType>
                </ModalTitle>
                <CloseButton onClick={() => setSelectedDay(null)}>X</CloseButton>
              </ModalHeader>
              <ExerciseList>
                {selectedDay.exercises.map((exercise, index) => (
                  <ExerciseRow key={index} completed={exercise.completed || false}>
                    <ExerciseContent>
                      <ExerciseDetails>
                        <ExerciseHeader>
                          <ExerciseName completed={exercise.completed || false}>
                            {exercise.name}
                          </ExerciseName>
                        </ExerciseHeader>
                        <ExerciseInfo>
                          <ExerciseSets>{exercise.sets}x</ExerciseSets>
                          <MuscleGroup>{exercise.muscleGroup}</MuscleGroup>
                        </ExerciseInfo>
                        {!isMobile && (
                          <CompleteButtonContainer>
                            <CompleteButton
                              completed={exercise.completed || false}
                              onClick={() => {
                                const updatedExercises = [...selectedDay.exercises];
                                updatedExercises[index] = {
                                  ...exercise,
                                  completed: !exercise.completed
                                };
                                setSelectedDay({
                                  ...selectedDay,
                                  exercises: updatedExercises
                                });
                              }}
                            >
                              {exercise.completed ? 'Completed' : 'Complete'}
                            </CompleteButton>
                          </CompleteButtonContainer>
                        )}
                      </ExerciseDetails>
                      {exercise.image && (
                        <ExerciseImageContainer>
                          <ExerciseImage
                            src={exercise.image}
                            alt={exercise.name}
                            onClick={() => exercise.image && setSelectedImage(exercise.image)}
                          />
                        </ExerciseImageContainer>
                      )}
                      {isMobile && (
                        <CompleteButtonContainer>
                          <CompleteButton
                            completed={exercise.completed || false}
                            onClick={() => {
                              const updatedExercises = [...selectedDay.exercises];
                              updatedExercises[index] = {
                                ...exercise,
                                completed: !exercise.completed
                              };
                              setSelectedDay({
                                ...selectedDay,
                                exercises: updatedExercises
                              });
                            }}
                          >
                            {exercise.completed ? 'Completed' : 'Complete'}
                          </CompleteButton>
                        </CompleteButtonContainer>
                      )}
                    </ExerciseContent>
                  </ExerciseRow>
                ))}
              </ExerciseList>
            </Modal>
          </>
        )}
        {selectedImage && (
          <ImageModal
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <CloseButton onClick={() => setSelectedImage(null)}>X</CloseButton>
            <FullImage src={selectedImage} alt="Exercise demonstration" />
          </ImageModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default GymTracker; 