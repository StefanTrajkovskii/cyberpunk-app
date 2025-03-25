import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  name: string;
  sets: number;
  muscleGroup: string;
  image?: string;
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

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 62, 62, 0.3);
  padding: 2rem;
  z-index: 1000;
  box-shadow: 0 0 50px rgba(255, 62, 62, 0.3);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 62, 62, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 62, 62, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 62, 62, 0.5);
  }
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
  margin-top: 1.5rem;
`;



const ExerciseName = styled.div`
  color: #ff3e3e;
  font-family: 'Share Tech Mono', monospace;
  flex: 1;
`;

const ExerciseSets = styled.div`
  color: rgba(255, 62, 62, 0.8);
  margin: 0 1rem;
`;

const MuscleGroup = styled.div`
  color: rgba(255, 62, 62, 0.6);
  font-size: 0.9rem;
  text-align: right;
  width: 100px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid #ff3e3e;
  color: #ff3e3e;
  padding: 0.5rem;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  
  &:hover {
    background: rgba(255, 62, 62, 0.1);
  }
`;

const ExerciseImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin: 1rem auto;
  border: 1px solid rgba(255, 62, 62, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 62, 62, 0.8);
    box-shadow: 0 0 20px rgba(255, 62, 62, 0.2);
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
`;

const ExerciseRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 62, 62, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GymTracker: React.FC<GymTrackerProps> = ({ onBack }) => {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              <CloseButton onClick={() => setSelectedDay(null)}>X</CloseButton>
              <DayName>{selectedDay.day}</DayName>
              <WorkoutType>{selectedDay.focus}</WorkoutType>
              <ExerciseList>
                {selectedDay.exercises.map((exercise, index) => (
                  <ExerciseRow key={index}>
                    <ExerciseDetails>
                      <ExerciseName>{exercise.name}</ExerciseName>
                      <ExerciseSets>{exercise.sets}x</ExerciseSets>
                      <MuscleGroup>{exercise.muscleGroup}</MuscleGroup>
                    </ExerciseDetails>
                    {exercise.image && (
                      <ExerciseImage
                        src={exercise.image}
                        alt={exercise.name}
                        onClick={() => exercise.image && setSelectedImage(exercise.image)}
                      />
                    )}
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