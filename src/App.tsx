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
    deadline: '48 hours'
  },
  {
    id: '002',
    title: 'Data Courier Run',
    description: 'Transport a high-value data shard across town without getting flatlined.',
    reward: '¥2,500',
    difficulty: 'medium',
    fixer: 'Dexter DeShawn',
    location: 'Watson District',
    deadline: '24 hours'
  },
  {
    id: '003',
    title: 'Tech Retrieval',
    description: 'Acquire prototype augmentation tech from a Militech convoy.',
    reward: '¥3,500',
    difficulty: 'medium',
    fixer: 'Regina Jones',
    location: 'Pacifica',
    deadline: '72 hours'
  },
  {
    id: '004',
    title: 'Recon Op',
    description: 'Scout Maelstrom gang territory and report back on their numbers and equipment.',
    reward: '¥1,200',
    difficulty: 'easy',
    fixer: 'Sebastian "Padre" Ibarra',
    location: 'Northside',
    deadline: '12 hours'
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

const MissionCard = styled(motion.div)`
  background-color: rgba(7, 15, 25, 0.85);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 1.5rem;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(0, 246, 255, 0.05) 0%,
      rgba(255, 62, 136, 0.05) 100%
    );
    pointer-events: none;
  }
  
  &:hover {
    .mission-title {
      animation: ${glitchText} 0.2s linear 1;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 246, 255, 0.05);
      animation: ${glitchEffect} 0.2s linear 1;
      pointer-events: none;
    }
  }
`;

const MissionTitle = styled.h2`
  color: #ff3e88;
  margin-top: 0;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
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
  
  &::before {
    content: '+';
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

function App() {
  const [missions, setMissions] = useState<Mission[]>(SAMPLE_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [dateTime] = useState<string>(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  const [filter, setFilter] = useState<string>('all');
  const [splashScreenActive, setSplashScreenActive] = useState<boolean>(true);
  
  // New state for job form modal
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<Partial<Mission>>({
    difficulty: 'medium' // Default value
  });

  // Log component mount for debugging
  useEffect(() => {
    console.log('App component mounted');
    
    // Add listener for special key combination to reset splash screen (for testing)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+R to reset splash screen
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        console.log('Debug key combination pressed - resetting splash screen');
        setSplashScreenActive(true);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      deadline: newJob.deadline || '24 hours'
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
          <NavHeader missionCount={missions.length} />
          
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
                </GlitchText> Welcome, netrunner. <StatusHighlight>{missions.length}</StatusHighlight> gigs available on the board.
              </StatusText>
              <StatusText>
                Last scan: <StatusHighlight>{dateTime}</StatusHighlight>
              </StatusText>
            </StatusBar>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <SectionTitle>Active Gigs</SectionTitle>
              <AddButton 
                onClick={openAddJobModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NEW JOB
              </AddButton>
            </div>
            
            <FilterBar>
              <FilterButton 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Gigs
              </FilterButton>
              <FilterButton 
                active={filter === 'easy'} 
                onClick={() => setFilter('easy')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Easy
              </FilterButton>
              <FilterButton 
                active={filter === 'medium'} 
                onClick={() => setFilter('medium')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Medium
              </FilterButton>
              <FilterButton 
                active={filter === 'hard'} 
                onClick={() => setFilter('hard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hard
              </FilterButton>
            </FilterBar>
            
            <AnimatePresence mode="popLayout">
              <MissionGrid>
                {filteredMissions.map((mission) => (
                  <MissionCard 
                    key={mission.id}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: '0 0 15px rgba(255, 62, 136, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => handleMissionClick(mission)}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <RewardTag>{mission.reward}</RewardTag>
                    <MissionTitle className="mission-title">{mission.title}</MissionTitle>
                    <DifficultyBadge level={mission.difficulty}>
                      {mission.difficulty}
                    </DifficultyBadge>
                    <MissionDesc>{mission.description}</MissionDesc>
                    <MissionMeta>
                      <MetaItem>
                        <MetaLabel>Fixer:</MetaLabel>
                        <MetaValue>{mission.fixer}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>Location:</MetaLabel>
                        <MetaValue>{mission.location}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>Deadline:</MetaLabel>
                        <MetaValue>{mission.deadline}</MetaValue>
                      </MetaItem>
                    </MissionMeta>
                  </MissionCard>
                ))}
              </MissionGrid>
            </AnimatePresence>
          </MainContent>
          
          {/* Modal for mission details */}
          <MissionDetailModal 
            mission={selectedMission} 
            onClose={handleCloseModal} 
          />
          
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
