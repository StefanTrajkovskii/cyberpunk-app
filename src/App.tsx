import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import CyberFooter from './components/CyberFooter';
import SplashScreen from './components/SplashScreen';
import DailyTasks from './components/DailyTasks';
import FoodTracker from './components/FoodTracker';
import GymTracker from './components/GymTracker';



// Add task type
interface Task {
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

// Add animations
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

const noise = keyframes`
  0% {
    clip-path: inset(40% 0 61% 0);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
  }
`;

const scanlines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 15px;
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

// Helper functions
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

// Add styled components
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

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TaskCard = styled(motion.div)<{ type: string; riskLevel: string }>`
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid ${({ type }) => getTypeColor(type)};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 20px rgba(${({ type }) => {
    switch (type) {
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
        rgba(${({ type }) => {
          switch (type) {
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
      rgba(${({ type }) => {
        switch (type) {
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

  ${({ riskLevel }) => riskLevel === 'CRITICAL' && css`
    animation: ${dataCorruption} 5s infinite;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 5px 30px rgba(${({ type }) => {
        switch (type) {
          case 'FOOD': return '0, 255, 157';
          case 'COMBAT': return '255, 62, 62';
          case 'STEALTH': return '157, 0, 255';
          case 'TECH': return '0, 162, 255';
          default: return '255, 255, 255';
        }
      }}, 0.3),
      inset 0 0 20px rgba(${({ type }) => {
        switch (type) {
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

const TaskTitle = styled.h3<{ type: string }>`
  color: ${({ type }) => getTypeColor(type)};
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

const RiskBadge = styled.div<{ risk: string }>`
  color: ${({ risk }) => getRiskColor(risk)};
  border: 1px solid currentColor;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-family: 'Share Tech Mono', monospace;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 5px currentColor;

  ${({ risk }) => risk === 'CRITICAL' && css`
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

const DifficultyFill = styled.div<{ difficulty: number; type: string }>`
  width: ${({ difficulty }) => (difficulty * 10)}%;
  height: 100%;
  background: ${({ type }) => getTypeColor(type)};
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

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const RewardSection = styled.div``;

const BaseReward = styled.div<{ type: string }>`
  color: ${({ type }) => getTypeColor(type)};
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

const ExecuteButton = styled(motion.button)<{ type: string }>`
  background: transparent;
  border: 2px solid ${({ type }) => getTypeColor(type)};
  color: ${({ type }) => getTypeColor(type)};
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
    background: ${({ type }) => getTypeColor(type)};
    opacity: 0.2;
    transition: all 0.3s ease;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    background: ${({ type }) => getTypeColor(type)};
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

const StatItem = styled.div<{ type: string }>`
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
    color: ${({ type }) => getTypeColor(type)};
    font-family: 'Share Tech Mono', monospace;
  }
`;

const ProgressBar = styled.div<{ progress: number; type: string }>`
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
    width: ${props => props.progress}%;
    background: ${props => getTypeColor(props.type)};
    box-shadow: 0 0 10px ${props => getTypeColor(props.type)};
    transition: width 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: ${props => props.progress}%;
    height: 100%;
    width: 4px;
    background: white;
    opacity: 0.5;
    box-shadow: 0 0 5px white;
  }
`;

// Add a type for our different views
type ViewType = 'daily' | 'missions' | 'market' | 'messages';

// Add back the core styled components
const AppContainer = styled.div`
  background-color: #0a0a12;
  min-height: 100vh;
  color: #e4f3ff;
  font-family: 'Rajdhani', 'Segment7', sans-serif;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(0, 246, 255, 0.03) 0%, transparent 80%),
      linear-gradient(0deg, rgba(10, 10, 18, 0.95) 80%, rgba(10, 10, 18, 0.8) 100%),
      url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%230a0a12"/><path d="M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M0 60 H100 M0 70 H100 M0 80 H100 M0 90 H100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/><path d="M10 0 V100 M20 0 V100 M30 0 V100 M40 0 V100 M50 0 V100 M60 0 V100 M70 0 V100 M80 0 V100 M90 0 V100" stroke="%23003b47" stroke-width="0.5" stroke-opacity="0.4"/></svg>');
    background-size: 100% 100%, cover, 50px 50px;
    z-index: -1;
    opacity: 0.8;
  }
`;

const FadeIn = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const StatusBar = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 1rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
`;

const StatusText = styled.div`
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 0.3rem;
    
    > * {
      margin: 0.1rem 0;
    }
  }
`;

const StatusHighlight = styled.span`
  color: #00f6ff;
  font-weight: 600;
`;

const GlitchText = styled(motion.span)`
  color: #ff3e88;
  position: relative;
  margin-right: 0.3rem;
  
  @media (max-width: 768px) {
    margin-right: 0.2rem;
  }
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: -2px;
    text-shadow: -1px 0 #00f6ff;
    top: 0;
    color: #ff3e88;
    background: #0a0a12;
    overflow: hidden;
    clip: rect(0, 900px, 0, 0);
    animation: ${noise} 2s infinite linear alternate-reverse;
  }
`;

const AddJobButton = styled(motion.button)`
  background: rgba(0, 246, 255, 0.1);
  border: 1px solid rgba(0, 246, 255, 0.3);
  color: #00f6ff;
  padding: 0.75rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px currentColor;
  margin-bottom: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  align-self: flex-start;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(0, 246, 255, 0.1);
    transition: 0.5s;
    z-index: -1;
  }

  &:hover {
    background: rgba(0, 246, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.2);

    &::before {
      left: 100%;
    }
  }

  &::after {
    content: '+';
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

// Add modal styled components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(10, 10, 18, 0.95);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 2rem;
  border-radius: 5px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 246, 255, 0.2);
`;

const FormTitle = styled.h2`
  color: #00f6ff;
  font-family: 'Share Tech Mono', monospace;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px currentColor;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.75rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.75rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.75rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }

  option {
    background: #0a0a12;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  background: transparent;
  border: 1px solid #00f6ff;
  color: #00f6ff;
  padding: 0.75rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;

  &.cancel {
    border-color: #ff3e88;
    color: #ff3e88;
  }

  &:hover {
    background: rgba(0, 246, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.2);
  }

  &.cancel:hover {
    background: rgba(255, 62, 136, 0.1);
    box-shadow: 0 0 20px rgba(255, 62, 136, 0.2);
  }
`;

// Add new job interface
interface NewJob {
  title: string;
  description: string;
  baseReward: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'FOOD' | 'COMBAT' | 'STEALTH' | 'TECH';
  difficulty: number;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<ViewType>('daily');
  const [currency, setCurrency] = useState<number>(0);
  const [splashScreenActive, setSplashScreenActive] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [dateTime] = useState<string>(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  const [showFoodTracker, setShowFoodTracker] = useState(false);
  const [showGymTracker, setShowGymTracker] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'FOOD TRACKER',
      description: 'Track your daily nutrition intake to optimize your cybernetic performance.',
      baseReward: 0,
      riskLevel: 'HIGH',
      type: 'FOOD',
      completed: false,
      difficulty: 8,
      consecutiveCompletions: 0
    },
    {
      id: '2',
      title: 'GYM TRACKER',
      description: 'Monitor your physical training progress and maintain peak physical condition.',
      baseReward: 0,
      riskLevel: 'CRITICAL',
      type: 'COMBAT',
      completed: false,
      difficulty: 10,
      consecutiveCompletions: 0
    },
    {
      id: '3',
      title: 'Data Extraction',
      description: 'Retrieve sensitive data from a heavily guarded server room.',
      baseReward: 1000,
      riskLevel: 'CRITICAL',
      type: 'STEALTH',
      completed: false,
      difficulty: 9,
      consecutiveCompletions: 0
    },
    {
      id: '4',
      title: 'Cyberware Maintenance',
      description: "Perform routine maintenance on local clinic's medical equipment.",
      baseReward: 300,
      riskLevel: 'LOW',
      type: 'TECH',
      completed: false,
      difficulty: 4,
      consecutiveCompletions: 0
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState<NewJob>({
    title: '',
    description: '',
    baseReward: 500,
    riskLevel: 'MEDIUM',
    type: 'FOOD',
    difficulty: 5
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
          return;
        }

        // Handle navigation based on current path
        if (location.pathname === '/food-tracker' || location.pathname === '/gym-tracker') {
          navigate('/');
          return;
        }

        if (currentView !== 'daily') {
          setCurrentView('daily');
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, currentView, navigate, location]);

  const handleSplashEnter = (name: string) => {
    console.log('Splash screen complete, showing main app');
    setUserName(name);
    setSplashScreenActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'baseReward') {
      // Remove all non-numeric characters and parse as integer
      const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      setNewJob(prev => ({
        ...prev,
        baseReward: numericValue
      }));
    } else {
      setNewJob(prev => ({
        ...prev,
        [name]: name === 'difficulty' ? Number(value) : value
      }));
    }
  };

  const handleAddJob = () => {
    setIsModalOpen(true);
    setNewJob({
      title: '',
      description: '',
      baseReward: 500,
      riskLevel: 'MEDIUM',
      type: 'FOOD',
      difficulty: 5
    });
  };

  const handleSubmitJob = () => {
    const task: Task = {
      id: (tasks.length + 1).toString(),
      ...newJob,
      completed: false,
      consecutiveCompletions: 0
    };
    setTasks([...tasks, task]);
    setIsModalOpen(false);
  };

  const handleExecuteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId && !task.completed) {
        // Calculate reward with streak bonus
        const streakBonus = task.consecutiveCompletions * 0.1;
        const totalReward = Math.floor(task.baseReward * (1 + streakBonus));
        
        // Add reward to currency (divide by 2 to fix double counting)
        setCurrency(prev => prev + (totalReward / 2));
        
        // Update task
        return {
          ...task,
          completed: true,
          consecutiveCompletions: task.consecutiveCompletions + 1
        };
      }
      return task;
    }));
  };

  const handleCardClick = (taskItem: Task) => {
    if (taskItem.type === 'FOOD') {
      navigate('/food-tracker');
    } else if (taskItem.type === 'COMBAT') {
      navigate('/gym-tracker');
    }
  };

  // Render splash screen if active
  if (splashScreenActive) {
    return <SplashScreen onEnter={handleSplashEnter} />;
  }

  return (
    <FadeIn
      key="main-app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AppContainer>
        <NavHeader 
          missionCount={0}
          currency={currency}
          currentView={currentView}
          onViewChange={setCurrentView}
          userName={userName}
        />
        
        <MainContent>
          <Routes>
            <Route path="/" element={
              currentView === 'daily' ? (
                <DailyTasks 
                  onComplete={(reward: number) => {
                    setCurrency(prev => prev + reward);
                  }}
                  onNavigateToFood={() => navigate('/food-tracker')}
                  onNavigateToGym={() => navigate('/gym-tracker')}
                  tasks={tasks}
                  setTasks={setTasks}
                />
              ) : currentView === 'missions' ? (
                <Container>
                  <HeaderSection>
                    <StatusBar>
                      <StatusText>
                        <GlitchText
                          data-text="SYSTEM:"
                          animate={{
                            x: [0, -2, 0, 2, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            repeatDelay: 5
                          }}
                        >
                          SYSTEM:
                        </GlitchText>
                        <span>Welcome, {userName || 'netrunner'}. {tasks.length} gigs available.</span>
                      </StatusText>
                      <StatusText>
                        <GlitchText
                          data-text="STATUS:"
                          animate={{
                            x: [0, -1, 0, 1, 0],
                          }}
                          transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "mirror",
                            repeatDelay: 7
                          }}
                        >
                          STATUS:
                        </GlitchText>
                        <span>{dateTime} | Network: <StatusHighlight>SECURE</StatusHighlight></span>
                      </StatusText>
                      <StatusText>
                        <GlitchText
                          data-text="BALANCE:"
                          animate={{
                            x: [0, -1, 0, 1, 0],
                          }}
                          transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "mirror",
                            repeatDelay: 7
                          }}
                        >
                          BALANCE:
                        </GlitchText>
                        <span><StatusHighlight>¥{currency.toLocaleString()}</StatusHighlight></span>
                      </StatusText>
                    </StatusBar>
                    <AddJobButton
                      onClick={handleAddJob}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      NEW JOB
                    </AddJobButton>
                  </HeaderSection>

                  <TaskGrid>
                    <AnimatePresence>
                      {tasks.map(task => (
                        <TaskCard
                          key={task.id}
                          type={task.type}
                          riskLevel={task.riskLevel}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TaskHeader>
                            <TaskTitle type={task.type}>{task.title}</TaskTitle>
                            <RiskBadge risk={task.riskLevel}>{task.riskLevel}</RiskBadge>
                          </TaskHeader>

                          <DifficultyMeter>
                            <DifficultyFill difficulty={task.difficulty} type={task.type} />
                          </DifficultyMeter>

                          <TaskStats>
                            <StatItem type={task.type}>
                              <span>DIFFICULTY</span>
                              <span>{task.difficulty}/10</span>
                            </StatItem>
                            <StatItem type={task.type}>
                              <span>STREAK</span>
                              <span>{task.consecutiveCompletions}x</span>
                            </StatItem>
                            <StatItem type={task.type}>
                              <span>REWARD</span>
                              <span>¥{task.baseReward}</span>
                            </StatItem>
                          </TaskStats>

                          <TaskDescription>{task.description}</TaskDescription>

                          <ProgressBar progress={task.completed ? 100 : 0} type={task.type} />

                          <TaskFooter>
                            <RewardSection>
                              <BaseReward type={task.type}>
                                {Math.floor(task.baseReward * (1 + task.consecutiveCompletions * 0.1)).toLocaleString()}
                              </BaseReward>
                              {task.consecutiveCompletions > 0 && (
                                <StreakMultiplier>
                                  {task.consecutiveCompletions}x STREAK (+{task.consecutiveCompletions * 10}%)
                                </StreakMultiplier>
                              )}
                            </RewardSection>

                            <ExecuteButton
                              type={task.type}
                              onClick={() => handleExecuteTask(task.id)}
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
              ) : (
                <div>{currentView} coming soon...</div>
              )
            } />
            <Route path="/food-tracker" element={<FoodTracker onBack={() => navigate('/')} />} />
            <Route path="/gym-tracker" element={<GymTracker onBack={() => navigate('/')} />} />
          </Routes>
        </MainContent>
        
        <AnimatePresence>
          {isModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <FormTitle>CREATE NEW JOB</FormTitle>
                <form onSubmit={e => { e.preventDefault(); handleSubmitJob(); }}>
                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={newJob.title}
                        onChange={handleInputChange}
                        placeholder="Enter job title"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="baseReward">Reward</Label>
                      <Input
                        type="text"
                        id="baseReward"
                        name="baseReward"
                        value={`¥${newJob.baseReward.toLocaleString()}`}
                        onChange={handleInputChange}
                        placeholder="¥1,000"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="full-width">
                      <Label htmlFor="description">Description</Label>
                      <TextArea
                        id="description"
                        name="description"
                        value={newJob.description}
                        onChange={handleInputChange}
                        placeholder="Describe the job in detail"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="type">Job Type</Label>
                      <Select
                        id="type"
                        name="type"
                        value={newJob.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="FOOD">FOOD</option>
                        <option value="COMBAT">COMBAT</option>
                        <option value="STEALTH">STEALTH</option>
                        <option value="TECH">TECH</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select
                        id="riskLevel"
                        name="riskLevel"
                        value={newJob.riskLevel}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="difficulty">Difficulty (1-10)</Label>
                      <Input
                        type="number"
                        id="difficulty"
                        name="difficulty"
                        value={newJob.difficulty}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        required
                      />
                    </FormGroup>
                  </FormGrid>

                  <ButtonGroup>
                    <Button
                      className="cancel"
                      type="button"
                      onClick={() => setIsModalOpen(false)}
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
                      CREATE JOB
                    </Button>
                  </ButtonGroup>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

        <CyberFooter />
      </AppContainer>
    </FadeIn>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
