import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import CyberFooter from './components/CyberFooter';
import DailyTasks from './pages/DailyTasks';
import FoodTracker from './pages/FoodTracker';
import GymTracker from './pages/GymTracker';
import CodeMastery from './pages/CodeMastery';
import Login from './pages/Login';
import Register from './pages/Register';
import Missions from './pages/Missions';
import { UserProvider, useUser } from './contexts/UserContext';
import BootSequence from './pages/BootSequence';



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



// Add new job interface


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<ViewType>('daily');
  const { user } = useUser();
  const [currency, setCurrency] = useState<number>(user?.currency || 0);
  const [bootComplete, setBootComplete] = useState(false);

  // Update currency whenever user's currency changes
  useEffect(() => {
    if (user) {
      setCurrency(user.currency);
    }
  }, [user?.currency]);

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
      title: 'CODE MASTERY',
      description: "Enhance your programming skills through daily coding challenges and projects. Stay sharp in the digital frontier.",
      baseReward: 0,
      riskLevel: 'LOW',
      type: 'TECH',
      completed: false,
      difficulty: 4,
      consecutiveCompletions: 0
    }
  ]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Handle navigation based on current path
        if (location.pathname !== '/') {
          navigate('/');
          if (currentView !== 'daily') {
            setCurrentView('daily');
          }
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [currentView, navigate, location]);

  // Update currentView when location changes
  useEffect(() => {
    if (location.pathname === '/missions') {
      setCurrentView('missions');
    }
  }, [location.pathname]);

  // If boot sequence is not complete, show boot sequence
  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  // If no user is logged in, show login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
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
          onViewChange={(view) => {
            setCurrentView(view);
            if (view === 'missions') {
              navigate('/missions');
            } else if (view === 'daily') {
              navigate('/');
            }
          }}
          userName={user.username}
          onLogout={() => navigate('/')}
        />
        
        <MainContent>
          <Routes>
            <Route path="/" element={
              <DailyTasks 
                onComplete={(reward: number) => {
                  setCurrency(prev => prev + reward);
                }}
                onNavigateToFood={() => navigate('/food-tracker')}
                onNavigateToGym={() => navigate('/gym-tracker')}
                onNavigateToCode={() => navigate('/code-mastery')}
                tasks={tasks}
                setTasks={setTasks}
              />
            } />
            <Route path="/food-tracker" element={<FoodTracker onBack={() => navigate('/')} />} />
            <Route path="/gym-tracker" element={<GymTracker onBack={() => navigate('/')} />} />
            <Route path="/code-mastery" element={<CodeMastery onBack={() => navigate('/')} />} />
            <Route path="/missions" element={<Missions />} />
          </Routes>
        </MainContent>

        <CyberFooter />
      </AppContainer>
    </FadeIn>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
