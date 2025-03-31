import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  baseReward: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'FOOD' | 'COMBAT' | 'STEALTH' | 'TECH';
  completed: boolean;
  difficulty: number;
  consecutiveCompletions: number;
}

interface DailyTasksProps {
  onComplete: (reward: number) => void;
  onNavigateToFood: () => void;
  onNavigateToGym: () => void;
  onNavigateToCode: () => void;
  tasks: DailyTask[];
  setTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
}

const glitch = keyframes`
  0% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
  1% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(-2px, 1px);
  }
  2% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(2px, -1px);
  }
  3% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
  100% {
    text-shadow: 2px 0 0 red, -2px 0 0 #0ff;
    transform: translate(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const scanlines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 15px;
  }
`;

const holographicShimmer = keyframes`
  0% {
    opacity: 0.3;
    transform: translateY(-10px) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(5px) rotate(0.5deg);
  }
  100% {
    opacity: 0.3;
    transform: translateY(-10px) rotate(0deg);
  }
`;

const dataCorruption = keyframes`
  0% {
    clip-path: inset(0 0 0 0);
  }
  5% {
    clip-path: inset(33% 0 66% 0);
  }
  10% {
    clip-path: inset(66% 0 33% 0);
  }
  15% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
`;

const matrixRain = keyframes`
  0% {
    background-position: 0% -100%;
  }
  100% {
    background-position: 0% 100%;
  }
`;

const circuitAnimation = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    width: 100%;
  }
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    animation: ${scanlines} 0.5s linear infinite;
    z-index: 2;
  }
`;

const TaskTypeFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: ${holographicShimmer} 3s ease infinite;
  }
`;

const FilterButton = styled.button<{ $active: boolean; $taskType: string }>`
  background: transparent;
  border: 1px solid ${({ $taskType }) => {
    switch ($taskType) {
      case 'FOOD': return '#00ff9d';
      case 'COMBAT': return '#ff3e3e';
      case 'STEALTH': return '#9d00ff';
      case 'TECH': return '#00a2ff';
      default: return '#ffffff';
    }
  }};
  color: ${({ $taskType }) => {
    switch ($taskType) {
      case 'FOOD': return '#00ff9d';
      case 'COMBAT': return '#ff3e3e';
      case 'STEALTH': return '#9d00ff';
      case 'TECH': return '#00a2ff';
      default: return '#ffffff';
    }
  }};
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  z-index: 1;
  min-width: 80px;

  @media (max-width: 768px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 1px;
    min-width: 60px;
  }

  ${({ $active }) => $active && css`
    animation: ${pulse} 2s infinite;
    box-shadow: 0 0 20px currentColor;
    text-shadow: 0 0 10px currentColor;
  `}

  &::before {
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    &::before {
      left: 100%;
    }
  }

  ${({ $active }) => $active && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: currentColor;
      box-shadow: 0 0 10px currentColor;
    }
  `}
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'LOW': return '#00ff9d';
    case 'MEDIUM': return '#ffff00';
    case 'HIGH': return '#ff3e3e';
    case 'CRITICAL': return '#ff0000';
    default: return '#ffffff';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'FOOD': return '#00ff9d';
    case 'COMBAT': return '#ff3e3e';
    case 'STEALTH': return '#9d00ff';
    case 'TECH': return '#00a2ff';
    default: return '#ffffff';
  }
};

const TaskCard = styled(motion.div)<{ $type: string; $riskLevel: string }>`
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid ${({ $type }) => getTypeColor($type)};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  cursor: ${({ $type }) => ($type === 'FOOD' || $type === 'COMBAT' || $type === 'TECH') ? 'pointer' : 'default'};
  box-shadow: 0 0 20px rgba(${({ $type }) => {
    switch ($type) {
      case 'FOOD': return '0, 255, 157';
      case 'COMBAT': return '255, 62, 62';
      case 'STEALTH': return '157, 0, 255';
      case 'TECH': return '0, 162, 255';
      default: return '255, 255, 255';
    }
  }}, 0.2);

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &::before {
    background: 
      linear-gradient(
        90deg,
        transparent 50%,
        rgba(${({ $type }) => {
          switch ($type) {
            case 'FOOD': return '0, 255, 157';
            case 'COMBAT': return '255, 62, 62';
            case 'STEALTH': return '157, 0, 255';
            case 'TECH': return '0, 162, 255';
            default: return '255, 255, 255';
          }
        }}, 0.1) 100%
      ),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none' stroke='%23FFF' stroke-width='0.25'/%3E%3Cpath d='M10 0v100M20 0v100M30 0v100M40 0v100M50 0v100M60 0v100M70 0v100M80 0v100M90 0v100M0 10h100M0 20h100M0 30h100M0 40h100M0 50h100M0 60h100M0 70h100M0 80h100M0 90h100' fill='none' stroke='%23FFF' stroke-width='0.125'/%3E%3C/svg%3E");
    opacity: 0.1;
    animation: ${circuitAnimation} 20s linear infinite;
  }

  &::after {
    background: linear-gradient(
      0deg,
      transparent 0%,
      rgba(${({ $type }) => {
        switch ($type) {
          case 'FOOD': return '0, 255, 157';
          case 'COMBAT': return '255, 62, 62';
          case 'STEALTH': return '157, 0, 255';
          case 'TECH': return '0, 162, 255';
          default: return '255, 255, 255';
        }
      }}, 0.1) 50%,
      transparent 100%
    );
    animation: ${matrixRain} 2s linear infinite;
  }

  ${({ $riskLevel }) => $riskLevel === 'CRITICAL' && css`
    animation: ${dataCorruption} 5s infinite;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 5px 30px rgba(${({ $type }) => {
        switch ($type) {
          case 'FOOD': return '0, 255, 157';
          case 'COMBAT': return '255, 62, 62';
          case 'STEALTH': return '157, 0, 255';
          case 'TECH': return '0, 162, 255';
          default: return '255, 255, 255';
        }
      }}, 0.3),
      inset 0 0 20px rgba(${({ $type }) => {
        switch ($type) {
          case 'FOOD': return '0, 255, 157';
          case 'COMBAT': return '255, 62, 62';
          case 'STEALTH': return '157, 0, 255';
          case 'TECH': return '0, 162, 255';
          default: return '255, 255, 255';
        }
      }}, 0.2);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3<{ $type: string }>`
  color: ${({ $type }) => getTypeColor($type)};
  font-size: 1.3rem;
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  position: relative;
  padding-left: 20px;
  text-shadow: 0 0 10px currentColor;
  letter-spacing: 2px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 10px;
    height: 10px;
    background: currentColor;
    transform: translateY(-50%);
    box-shadow: 0 0 10px currentColor;
  }

  &::after {
    content: '[EXECUTING]';
    position: absolute;
    right: 0;
    top: 0;
    font-size: 0.8rem;
    opacity: 0;
    transition: 0.3s;
  }

  ${TaskCard}:hover &::after {
    opacity: 0.7;
    animation: ${glitch} 1s infinite;
  }
`;

const RiskBadge = styled.div<{ $risk: string }>`
  color: ${({ $risk }) => getRiskColor($risk)};
  border: 1px solid currentColor;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-family: 'Share Tech Mono', monospace;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 5px currentColor;

  ${({ $risk }) => $risk === 'CRITICAL' && css`
    animation: ${glitch} 3s infinite;
    &::before {
      content: 'DANGER';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: red;
      mix-blend-mode: multiply;
      animation: ${dataCorruption} 2s infinite;
    }
  `}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0.1;
  }
`;

const DifficultyMeter = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
`;

const DifficultyFill = styled.div<{ $difficulty: number; $type: string }>`
  width: ${({ $difficulty }) => ($difficulty * 10)}%;
  height: 100%;
  background: ${({ $type }) => getTypeColor($type)};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: white;
    opacity: 0.5;
  }
`;

const TaskDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 1rem 0;
  line-height: 1.6;
`;

const TaskFooter = styled.div<{ $type: string }>`
  display: flex;
  justify-content: ${props => props.$type === 'FOOD' || props.$type === 'COMBAT' || props.$type === 'TECH' ? 'flex-start' : 'space-between'};
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const RewardSection = styled.div``;

const BaseReward = styled.div<{ $type: string }>`
  color: ${({ $type }) => getTypeColor($type)};
  font-size: 1.2rem;
  font-family: 'Share Tech Mono', monospace;
  
  &::before {
    content: '¥';
    margin-right: 0.3rem;
    opacity: 0.7;
  }
`;

const StreakMultiplier = styled.div`
  color: #ffff00;
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const ExecuteButton = styled(motion.button)<{ $type: string }>`
  background: transparent;
  border: 2px solid ${({ $type }) => getTypeColor($type)};
  color: ${({ $type }) => getTypeColor($type)};
  padding: 0.7rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px currentColor;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ $type }) => getTypeColor($type)};
    opacity: 0.2;
    transition: all 0.3s ease;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    background: ${({ $type }) => getTypeColor($type)};
    color: #000000;
    text-shadow: none;
    
    &::before {
      left: 0;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-style: dashed;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00ff9d;
    }
  }
`;

const TaskStats = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

const StatItem = styled.div<{ $type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  
  span:first-child {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
  }
  
  span:last-child {
    font-size: 1rem;
    color: ${({ $type }) => getTypeColor($type)};
    font-family: 'Share Tech Mono', monospace;
  }
`;

const ProgressBar = styled.div<{ $progress: number; $type: string }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  margin: 1rem 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: ${props => getTypeColor(props.$type)};
    box-shadow: 0 0 10px ${props => getTypeColor(props.$type)};
    transition: width 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: ${props => props.$progress}%;
    height: 100%;
    width: 4px;
    background: white;
    opacity: 0.5;
    box-shadow: 0 0 5px white;
  }
`;

const DailyTasks: React.FC<DailyTasksProps> = ({ onComplete, onNavigateToFood, onNavigateToGym, onNavigateToCode, tasks, setTasks }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [todaysCalories, setTodaysCalories] = useState<number>(0);
  const [todaysProtein, setTodaysProtein] = useState<number>(0);
  const [nextWorkout, setNextWorkout] = useState<string>('');

  useEffect(() => {
    const updateStats = () => {
      const today = new Date().toLocaleDateString();
      const storedEntries = localStorage.getItem('foodEntries');
      if (storedEntries) {
        const entries = JSON.parse(storedEntries);
        const todayEntries = entries.filter((entry: any) => entry.date === today);
        const totalCalories = todayEntries.reduce((sum: number, entry: { calories: number }) => 
          sum + Number(entry.calories), 0
        );
        const totalProtein = todayEntries.reduce((sum: number, entry: { protein: number }) => 
          sum + Number(entry.protein), 0
        );
        setTodaysCalories(totalCalories);
        setTodaysProtein(totalProtein);
      }
    };

    // Initial load
    updateStats();

    // Set up an interval to check for updates
    const interval = setInterval(updateStats, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Get workout schedule from localStorage
    const updateNextWorkout = () => {
      const savedSchedule = localStorage.getItem('workoutSchedule');
      if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        // Find the first non-completed and non-failed, non-rest day
        const next = schedule.find((day: any) => !day.isCompleted && !day.isFailed && !day.isRest);
        if (next) {
          setNextWorkout(next.focus);
        } else {
          // If all days are completed/failed, find the first non-rest day
          const firstWorkoutDay = schedule.find((day: any) => !day.isRest);
          if (firstWorkoutDay) {
            setNextWorkout(`RESTART: ${firstWorkoutDay.focus}`);
          }
        }
      }
    };

    updateNextWorkout();
    // Update every second to keep in sync with GymTracker
    const interval = setInterval(updateNextWorkout, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && !task.completed) {
          const streakMultiplier = 1 + (task.consecutiveCompletions * 0.1);
          const totalReward = Math.floor(task.baseReward * streakMultiplier);
          
          onComplete(totalReward / 2);
          
          return {
            ...task,
            completed: true,
            consecutiveCompletions: task.consecutiveCompletions + 1
          };
        }
        return task;
      })
    );
  };

  const filteredTasks = selectedType
    ? tasks.filter(task => task.type === selectedType)
    : tasks;

  const handleCardClick = (task: DailyTask) => {
    if (task.type === 'FOOD') {
      onNavigateToFood();
    } else if (task.type === 'COMBAT') {
      onNavigateToGym();
    } else if (task.type === 'TECH') {
      onNavigateToCode();
    }
  };

  return (
    <Container>
      <TaskTypeFilter>
        {['FOOD', 'COMBAT', 'STEALTH', 'TECH'].map(type => (
          <FilterButton
            key={type}
            $taskType={type}
            $active={selectedType === type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
          >
            {type === 'COMBAT' ? 'Combat' : type.charAt(0) + type.slice(1).toLowerCase()}
          </FilterButton>
        ))}
      </TaskTypeFilter>

      <TaskGrid>
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              $type={task.type}
              $riskLevel={task.riskLevel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCardClick(task)}
            >
              <TaskHeader>
                <TaskTitle $type={task.type}>
                  {task.title}
                </TaskTitle>
                <RiskBadge $risk={task.riskLevel}>{task.riskLevel}</RiskBadge>
              </TaskHeader>

              <DifficultyMeter>
                <DifficultyFill $difficulty={task.difficulty} $type={task.type} />
              </DifficultyMeter>

              <TaskStats>
                <StatItem $type={task.type}>
                  <span>DIFFICULTY</span>
                  <span>{task.difficulty}/10</span>
                </StatItem>
                {task.type === 'COMBAT' && (
                  <StatItem $type={task.type}>
                    <span>NEXT</span>
                    <span>{nextWorkout || 'LOADING...'}</span>
                  </StatItem>
                )}
                {task.type !== 'COMBAT' && task.type !== 'TECH' && (
                  <StatItem $type={task.type}>
                    <span>STREAK</span>
                    <span>{task.consecutiveCompletions}x</span>
                  </StatItem>
                )}
                {task.type === 'FOOD' && (
                  <>
                    <StatItem $type={task.type}>
                      <span>CALORIES</span>
                      <span>{todaysCalories}</span>
                    </StatItem>
                    <StatItem $type={task.type}>
                      <span>PROTEIN</span>
                      <span>{todaysProtein}g</span>
                    </StatItem>
                  </>
                )}
                {task.type !== 'FOOD' && task.type !== 'COMBAT' && task.type !== 'TECH' && (
                  <StatItem $type={task.type}>
                    <span>REWARD</span>
                    <span>¥{task.baseReward}</span>
                  </StatItem>
                )}
              </TaskStats>

              <TaskDescription>{task.description}</TaskDescription>

              <ProgressBar $progress={task.completed ? 100 : 0} $type={task.type} />

              <TaskFooter $type={task.type}>
                {task.type !== 'FOOD' && task.type !== 'COMBAT' && task.type !== 'TECH' && (
                  <RewardSection>
                    <BaseReward $type={task.type}>
                      {Math.floor(task.baseReward * (1 + task.consecutiveCompletions * 0.1)).toLocaleString()}
                    </BaseReward>
                    {task.consecutiveCompletions > 0 && (
                      <StreakMultiplier>
                        {task.consecutiveCompletions}x STREAK (+{task.consecutiveCompletions * 10}%)
                      </StreakMultiplier>
                    )}
                  </RewardSection>
                )}

                <ExecuteButton
                  $type={task.type}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompleteTask(task.id);
                  }}
                  disabled={task.completed}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {task.completed ? 'COMPLETED' : 'EXECUTE'}
                </ExecuteButton>
              </TaskFooter>
            </TaskCard>
          ))}
        </AnimatePresence>
      </TaskGrid>
    </Container>
  );
};

export default DailyTasks; 