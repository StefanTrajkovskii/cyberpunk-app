import React, { useState, useEffect, FormEvent } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import MissionDetailModal from './components/MissionDetailModal';
import NavHeader from './components/NavHeader';
import CyberFooter from './components/CyberFooter';
import SplashScreen from './components/SplashScreen';

// Types for our mission data
interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  fixer: string;
  location: string;
  deadline: string;
  completed: boolean;
}

// Sample mission data
const SAMPLE_MISSIONS: Mission[] = [
  {
    id: '001',
    title: 'Netrunner Extraction',
    description: 'Extract a rogue netrunner from Arasaka Tower before they fry his neural implants.',
    reward: '¥5,000',
    difficulty: 'hard',
    fixer: 'Wakako Okada',
    location: 'Night City, Downtown',
    deadline: '48 hours',
    completed: false
  },
  {
    id: '002',
    title: 'Data Courier Run',
    description: 'Transport a high-value data shard across town without getting flatlined.',
    reward: '¥2,500',
    difficulty: 'medium',
    fixer: 'Dexter DeShawn',
    location: 'Watson District',
    deadline: '24 hours',
    completed: false
  },
  {
    id: '003',
    title: 'Tech Retrieval',
    description: 'Acquire prototype augmentation tech from a Militech convoy.',
    reward: '¥3,500',
    difficulty: 'medium',
    fixer: 'Regina Jones',
    location: 'Pacifica',
    deadline: '72 hours',
    completed: false
  },
  {
    id: '004',
    title: 'Recon Op',
    description: 'Scout Maelstrom gang territory and report back on their numbers and equipment.',
    reward: '¥1,200',
    difficulty: 'easy',
    fixer: 'Sebastian "Padre" Ibarra',
    location: 'Northside',
    deadline: '12 hours',
    completed: false
  }
];

// Define glitch animation keyframes
const glitchEffect = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
`;

const glitchText = keyframes`
  0% {
    text-shadow: -2px 0 #ff3e88, 2px 0 #00f6ff;
    opacity: 1;
  }
  10% {
    text-shadow: 2px 0 #ff3e88, -2px 0 #00f6ff;
    opacity: 0.9;
  }
  20% {
    text-shadow: -3px 0 #ff3e88, 3px 0 #00f6ff;
    opacity: 1;
  }
  30% {
    text-shadow: 3px 0 #ff3e88, -3px 0 #00f6ff;
    opacity: 0.9;
  }
  40% {
    text-shadow: -1px 0 #ff3e88, 1px 0 #00f6ff;
    opacity: 1;
  }
  50% {
    text-shadow: 1px 0 #ff3e88, -1px 0 #00f6ff;
    opacity: 0.9;
  }
  60% {
    text-shadow: -2px 0 #ff3e88, 2px 0 #00f6ff;
    opacity: 1;
  }
  70% {
    text-shadow: 2px 0 #ff3e88, -2px 0 #00f6ff;
    opacity: 0.9;
  }
  80% {
    text-shadow: -3px 0 #ff3e88, 3px 0 #00f6ff;
    opacity: 1;
  }
  90% {
    text-shadow: 3px 0 #ff3e88, -3px 0 #00f6ff;
    opacity: 0.9;
  }
  100% {
    text-shadow: -1px 0 #ff3e88, 1px 0 #00f6ff;
    opacity: 1;
  }
`;

// Styled components
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

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MissionCard = styled(motion.div)<{ difficulty: string; completed: boolean }>`
  background: ${props => props.completed ? 'rgba(35, 209, 139, 0.05)' : 'rgba(10, 10, 18, 0.7)'};
  border: 1px solid ${props => 
    props.completed ? '#23d18b' : 
    props.difficulty === 'easy' ? '#10823A' : 
    props.difficulty === 'medium' ? '#FF8A15' : 
    '#E93845'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15), 
    ${props => props.completed ? 
    '0 0 10px rgba(35, 209, 139, 0.3)' : 
    '0 0 8px rgba(255, 62, 136, 0.2)'};
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${props => props.completed && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, #23d18b, transparent);
    }
  `}
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MissionTitle = styled.h3`
  font-size: 1.3rem;
  color: #e4f3ff;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
`;

const MissionId = styled.span`
  font-size: 0.8rem;
  color: #b8c0c2;
  font-family: 'Share Tech Mono', monospace;
  opacity: 0.7;
`;

const MissionDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MissionFixer = styled.span`
  font-size: 0.9rem;
  color: #00f6ff;
`;

const MissionLocation = styled.span`
  font-size: 0.9rem;
  color: #b8c0c2;
`;

const MissionReward = styled.div`
  font-size: 1.4rem;
  color: #23d18b;
  font-weight: 700;
  margin: 1rem 0;
  text-shadow: 0 0 5px rgba(35, 209, 139, 0.5);
`;

const CompleteButton = styled(motion.button)`
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(90deg, #23d18b 0%, #1aa073 100%);
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
  box-shadow: 0 0 10px rgba(35, 209, 139, 0.3);
  
  &:hover {
    background: linear-gradient(90deg, #29eca0 0%, #1fc088 100%);
  }
`;

const CompletedBadge = styled(motion.div)`
  background: rgba(35, 209, 139, 0.2);
  color: #23d18b;
  text-align: center;
  padding: 0.7rem;
  border-radius: 5px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 1rem;
  border: 1px solid #23d18b;
`;

const MissionDesc = styled.p`
  color: #b8c0c2;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const MissionMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
`;

const MetaLabel = styled.span`
  color: #00f6ff;
  margin-right: 0.5rem;
  font-weight: 600;
`;

const MetaValue = styled.span`
  color: #e4f3ff;
`;

const DifficultyBadge = styled.span<{ level: 'easy' | 'medium' | 'hard' }>`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${({ level }) => 
    level === 'easy' ? '#10823A' : 
    level === 'medium' ? '#FF8A15' : 
    '#E93845'};
  color: white;
`;

const RewardTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(15, 15, 35, 0.9);
  border: 1px solid #00f6ff;
  color: #00f6ff;
  padding: 0.4rem 0.8rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 246, 255, 0.4);
`;

const StatusBar = styled.div`
  background: rgba(10, 10, 18, 0.9);
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 246, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const StatusText = styled.div`
  color: #b8c0c2;
  font-size: 0.9rem;
  font-family: 'Share Tech Mono', monospace;
`;

const StatusHighlight = styled.span`
  color: #00f6ff;
  font-weight: 600;
`;

const GlitchText = styled(motion.span)`
  position: relative;
  display: inline-block;
  
  &::before, &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }
  
  &::before {
    color: #ff3e88;
    z-index: -1;
  }
  
  &::after {
    color: #00f6ff;
    z-index: -2;
  }
`;

const SectionTitle = styled.h2`
  color: #e4f3ff;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, #ff3e88, transparent);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled(motion.button)<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ active }) => active ? 'rgba(255, 62, 136, 0.2)' : 'rgba(15, 15, 35, 0.6)'};
  border: 1px solid ${({ active }) => active ? '#ff3e88' : 'rgba(0, 246, 255, 0.3)'};
  border-radius: 4px;
  color: ${({ active }) => active ? '#ff3e88' : '#e4f3ff'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #ff3e88;
    background: rgba(255, 62, 136, 0.1);
  }
`;

// Add these new styled components for the job form modal
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(7, 10, 25, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #0a0a12;
  border: 1px solid #00f6ff;
  border-radius: 5px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  color: #e4f3ff;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff3e88, #00f6ff);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(0, 246, 255, 0.1), transparent 70%);
    pointer-events: none;
  }
`;

const FormTitle = styled.h2`
  color: #00f6ff;
  margin-top: 0;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #00f6ff, transparent);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #00f6ff;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  background: rgba(7, 15, 25, 0.7);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 4px;
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.7rem;
  background: rgba(7, 15, 25, 0.7);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 4px;
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  background: rgba(7, 15, 25, 0.7);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 4px;
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
  
  &:focus {
    outline: none;
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  background: rgba(255, 62, 136, 0.2);
  border: 1px solid #ff3e88;
  border-radius: 4px;
  color: #ff3e88;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 62, 136, 0.3);
    box-shadow: 0 0 15px rgba(255, 62, 136, 0.5);
  }
  
  &.cancel {
    background: rgba(7, 15, 25, 0.7);
    border-color: rgba(0, 246, 255, 0.3);
    color: #e4f3ff;
    
    &:hover {
      border-color: #00f6ff;
      box-shadow: 0 0 15px rgba(0, 246, 255, 0.3);
    }
  }
`;

const AddButton = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  background: rgba(35, 209, 139, 0.2);
  border: 1px solid #23d18b;
  border-radius: 4px;
  color: #23d18b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto; /* Push to the right */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(35, 209, 139, 0.3);
    box-shadow: 0 0 15px rgba(35, 209, 139, 0.3);
  }
`;

function App() {
  // Initialize state from localStorage or use default values if no saved data exists
  const [missions, setMissions] = useState<Mission[]>(() => {
    const savedMissions = localStorage.getItem('cyberpunk_missions');
    return savedMissions ? JSON.parse(savedMissions) : SAMPLE_MISSIONS;
  });
  
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [dateTime] = useState<string>(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  const [filter, setFilter] = useState<string>('all');
  const [splashScreenActive, setSplashScreenActive] = useState<boolean>(() => {
    // Only show splash screen if this is the first visit or it's been explicitly requested
    const hasVisited = localStorage.getItem('cyberpunk_visited');
    return !hasVisited;
  });
  
  // Currency system - load from localStorage or start at 0
  const [currency, setCurrency] = useState<number>(() => {
    const savedCurrency = localStorage.getItem('cyberpunk_currency');
    return savedCurrency ? parseInt(savedCurrency, 10) : 0;
  });
  
  // New state for job form modal
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<Partial<Mission>>({
    difficulty: 'medium' // Default value
  });

  // Save missions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cyberpunk_missions', JSON.stringify(missions));
  }, [missions]);
  
  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cyberpunk_currency', currency.toString());
  }, [currency]);
  
  // Mark that the user has visited the site when splash screen is closed
  useEffect(() => {
    if (!splashScreenActive) {
      localStorage.setItem('cyberpunk_visited', 'true');
    }
  }, [splashScreenActive]);

  // Log component mount for debugging
  useEffect(() => {
    console.log('App component mounted');
    
    // Add listener for special key combination to reset splash screen (for testing)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+R to reset splash screen
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        console.log('Debug key combination pressed - resetting splash screen');
        localStorage.removeItem('cyberpunk_visited');
        setSplashScreenActive(true);
        e.preventDefault();
      }
      
      // Ctrl+Shift+C to clear all data (for testing)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        console.log('Debug key combination pressed - clearing all data');
        localStorage.removeItem('cyberpunk_missions');
        localStorage.removeItem('cyberpunk_currency');
        setMissions(SAMPLE_MISSIONS);
        setCurrency(0);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Function to complete a mission and earn reward
  const handleCompleteMission = (missionId: string) => {
    // Find the mission
    const missionToComplete = missions.find(m => m.id === missionId);
    
    if (missionToComplete && !missionToComplete.completed) {
      // Extract the numeric value from the reward string (e.g., "¥5,000" -> 5000)
      const rewardValue = parseInt(missionToComplete.reward.replace(/\D/g, ''), 10);
      
      // Update currency
      setCurrency(prev => prev + rewardValue);
      
      // Mark mission as completed
      setMissions(prev => 
        prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, completed: true } 
            : mission
        )
      );
      
      // Close modal if it's open
      setSelectedMission(null);
    }
  };

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleCloseModal = () => {
    setSelectedMission(null);
  };

  const handleSplashEnter = () => {
    console.log('Splash screen complete, showing main app');
    setSplashScreenActive(false);
  };
  
  // Add Job form handlers
  const openAddJobModal = () => {
    setIsAddJobModalOpen(true);
  };
  
  const closeAddJobModal = () => {
    setIsAddJobModalOpen(false);
    // Reset form when closing
    setNewJob({
      difficulty: 'medium'
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddJob = (e: FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID
    const id = `00${missions.length + 1}`;
    
    // Create new mission object
    const newMission: Mission = {
      id,
      title: newJob.title || 'Untitled Job',
      description: newJob.description || 'No description provided.',
      reward: newJob.reward || '¥0',
      difficulty: (newJob.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      fixer: newJob.fixer || 'Anonymous',
      location: newJob.location || 'Unknown',
      deadline: newJob.deadline || '24 hours',
      completed: false
    };
    
    // Add to missions array
    setMissions(prev => [...prev, newMission]);
    
    // Close modal
    closeAddJobModal();
  };

  const filteredMissions = filter === 'all' 
    ? missions 
    : missions.filter(mission => mission.difficulty === filter);

  // Render splash screen if active
  if (splashScreenActive) {
    return <SplashScreen onEnter={handleSplashEnter} />;
  }

  // Otherwise render main app
  return (
    <AnimatePresence mode="wait">
      <FadeIn
        key="main-app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AppContainer>
          <NavHeader missionCount={missions.length} currency={currency} />
          
          <MainContent>
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
                </GlitchText> Welcome, netrunner. <StatusHighlight>{missions.length}</StatusHighlight> gigs available. Your balance: <StatusHighlight>¥{currency.toLocaleString()}</StatusHighlight>
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
                </GlitchText> {dateTime} | Network: <StatusHighlight>SECURE</StatusHighlight>
              </StatusText>
            </StatusBar>
            
            <TitleRow>
              <SectionTitle>
                ACTIVE GIGS
              </SectionTitle>
              <AddButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddJobModal}
              >
                + NEW JOB
              </AddButton>
            </TitleRow>
            
            <FilterContainer>
              <FilterButton 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
              >
                ALL JOBS
              </FilterButton>
              <FilterButton 
                active={filter === 'easy'} 
                onClick={() => setFilter('easy')}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                color="#10823A"
              >
                EASY
              </FilterButton>
              <FilterButton 
                active={filter === 'medium'} 
                onClick={() => setFilter('medium')}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                color="#FF8A15"
              >
                MEDIUM
              </FilterButton>
              <FilterButton 
                active={filter === 'hard'} 
                onClick={() => setFilter('hard')}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                color="#E93845"
              >
                HARD
              </FilterButton>
            </FilterContainer>
            
            <MissionGrid>
              {filteredMissions.map(mission => (
                <MissionCard 
                  key={mission.id}
                  onClick={() => handleMissionClick(mission)}
                  whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ y: 0 }}
                  difficulty={mission.difficulty}
                  completed={mission.completed}
                >
                  <MissionHeader>
                    <MissionTitle>{mission.title}</MissionTitle>
                    <MissionId>ID: {mission.id}</MissionId>
                  </MissionHeader>
                  
                  <MissionDetails>
                    <MissionFixer>{mission.fixer}</MissionFixer>
                    <MissionLocation>{mission.location}</MissionLocation>
                  </MissionDetails>
                  
                  <MissionReward>{mission.reward}</MissionReward>
                  
                  {mission.completed ? (
                    <CompletedBadge 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      COMPLETED
                    </CompletedBadge>
                  ) : (
                    <CompleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteMission(mission.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      COMPLETE
                    </CompleteButton>
                  )}
                </MissionCard>
              ))}
            </MissionGrid>
          </MainContent>
          
          {/* Mission Detail Modal */}
          <AnimatePresence>
            {selectedMission && (
              <MissionDetailModal 
                mission={selectedMission} 
                onClose={handleCloseModal}
                onComplete={handleCompleteMission}
              />
            )}
          </AnimatePresence>
          
          {/* New Job Form Modal */}
          <AnimatePresence>
            {isAddJobModalOpen && (
              <ModalOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeAddJobModal}
              >
                <ModalContent
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking form
                >
                  <FormTitle>CREATE NEW JOB</FormTitle>
                  <form onSubmit={handleAddJob}>
                    <FormGrid>
                      <FormGroup>
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          type="text" 
                          id="title" 
                          name="title" 
                          value={newJob.title || ''} 
                          onChange={handleInputChange} 
                          placeholder="Enter job title" 
                          required 
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="reward">Reward</Label>
                        <Input 
                          type="text" 
                          id="reward" 
                          name="reward" 
                          value={newJob.reward || ''} 
                          onChange={handleInputChange} 
                          placeholder="¥5,000" 
                          required 
                        />
                      </FormGroup>
                      
                      <FormGroup className="full-width">
                        <Label htmlFor="description">Description</Label>
                        <TextArea 
                          id="description" 
                          name="description" 
                          value={newJob.description || ''} 
                          onChange={handleInputChange} 
                          placeholder="Describe the job in detail" 
                          required 
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select 
                          id="difficulty" 
                          name="difficulty" 
                          value={newJob.difficulty || 'medium'} 
                          onChange={handleInputChange} 
                          required
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input 
                          type="text" 
                          id="deadline" 
                          name="deadline" 
                          value={newJob.deadline || ''} 
                          onChange={handleInputChange} 
                          placeholder="24 hours" 
                          required 
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="fixer">Fixer</Label>
                        <Input 
                          type="text" 
                          id="fixer" 
                          name="fixer" 
                          value={newJob.fixer || ''} 
                          onChange={handleInputChange} 
                          placeholder="Who's offering this job?" 
                          required 
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          type="text" 
                          id="location" 
                          name="location" 
                          value={newJob.location || ''} 
                          onChange={handleInputChange} 
                          placeholder="Night City, Downtown" 
                          required 
                        />
                      </FormGroup>
                    </FormGrid>
                    
                    <ButtonGroup>
                      <Button 
                        className="cancel" 
                        type="button" 
                        onClick={closeAddJobModal}
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
                        SUBMIT JOB
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
    </AnimatePresence>
  );
}

export default App;
