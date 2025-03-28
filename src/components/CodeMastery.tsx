import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  SiHtml5, 
  SiCss3, 
  SiTailwindcss, 
  SiJavascript, 
  SiReact, 
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiAmazon
} from 'react-icons/si';

const glitch = keyframes`
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                 -0.04em -0.025em 0 #fffc00;
  }
`;

const shine = keyframes`
  0% {
    background-position: -100% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: #000;
  color: #e4f3ff;
  font-family: 'Share Tech Mono', monospace;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #00a2ff;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  animation: ${glitch} 725ms infinite;
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
`;

const Subtitle = styled.h2`
  color: rgba(0, 162, 255, 0.7);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0.5rem 0 0 0;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00a2ff;
  color: #00a2ff;
  padding: 0.5rem 1rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 162, 255, 0.1);
  }
`;

const AchievementTracks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TrackCard = styled.div`
  background: rgba(0, 162, 255, 0.05);
  border: 1px solid rgba(0, 162, 255, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
`;

const TrackTitle = styled.h3`
  color: #00a2ff;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
`;

interface TierRequirement {
  BRONZE: number;
  SILVER: number;
  GOLD: number;
  PLATINUM: number;
}

interface Project {
  id: string;
  name: string;
  date: string;
}

interface Badge {
  id: string;
  name: string;
  currentTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  icon: React.ReactNode;
  projectsCompleted: number;
  tierRequirements: TierRequirement;
  projects: Project[];
}

interface Track {
  id: string;
  title: string;
  badges: Badge[];
}

interface CodeMasteryProps {
  onBack: () => void;
}

const BadgeCard = styled(motion.div)<{ unlocked: boolean; tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' }>`
  background: ${props => props.unlocked ? 'rgba(0, 162, 255, 0.1)' : 'rgba(50, 50, 50, 0.1)'};
  border: 2px solid ${props => {
    if (!props.unlocked) return 'rgba(50, 50, 50, 0.3)';
    switch (props.tier) {
      case 'BRONZE': return '#cd7f32';
      case 'SILVER': return '#c0c0c0';
      case 'GOLD': return '#ffd700';
      case 'PLATINUM': return '#e5e4e2';
      default: return '#00a2ff';
    }
  }};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.unlocked && css<{ tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' }>`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        ${props => {
          switch (props.tier) {
            case 'BRONZE': return 'rgba(205, 127, 50, 0.2)';
            case 'SILVER': return 'rgba(192, 192, 192, 0.2)';
            case 'GOLD': return 'rgba(255, 215, 0, 0.2)';
            case 'PLATINUM': return 'rgba(229, 228, 226, 0.2)';
            default: return 'rgba(0, 162, 255, 0.2)';
          }
        }},
        transparent
      );
      animation: ${shine} 2s linear infinite;
    }

    animation: ${float} 3s ease-in-out infinite;
  `}

  &:hover {
    transform: ${props => props.unlocked ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.unlocked ? '0 0 20px rgba(0, 162, 255, 0.2)' : 'none'};
  }
`;

const BadgeIcon = styled.div<{ unlocked: boolean; tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' }>`
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: ${props => props.unlocked ? 'rgba(0, 162, 255, 0.2)' : 'rgba(50, 50, 50, 0.2)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid ${props => {
    if (!props.unlocked) return '#666';
    switch (props.tier) {
      case 'BRONZE': return '#cd7f32';
      case 'SILVER': return '#c0c0c0';
      case 'GOLD': return '#ffd700';
      case 'PLATINUM': return '#e5e4e2';
      default: return '#00a2ff';
    }
  }};

  svg {
    width: 30px;
    height: 30px;
    color: ${props => {
      if (!props.unlocked) return '#666';
      // Original brand colors
      switch (props.tier) {
        case 'BRONZE': return '#cd7f32';
        case 'SILVER': return '#c0c0c0';
        case 'GOLD': return '#ffd700';
        case 'PLATINUM': return '#e5e4e2';
        default: return '#00a2ff';
      }
    }};
  }
`;

const BadgeName = styled.h4<{ unlocked: boolean }>`
  color: ${props => props.unlocked ? '#00a2ff' : '#666'};
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BadgeTier = styled.div<{ tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' }>`
  color: ${props => {
    switch (props.tier) {
      case 'BRONZE': return '#cd7f32';
      case 'SILVER': return '#c0c0c0';
      case 'GOLD': return '#ffd700';
      case 'PLATINUM': return '#e5e4e2';
      default: return '#00a2ff';
    }
  }};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const Progress = styled.div`
  font-size: 0.8rem;
  color: rgba(0, 162, 255, 0.7);
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border: 2px solid #00a2ff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #00a2ff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background: rgba(0, 162, 255, 0.1);
  border: 1px solid #00a2ff;
  color: #00a2ff;
  padding: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  border-radius: 4px;
`;


const SubmitButton = styled(motion.button)`
  background: #00a2ff;
  border: none;
  color: #000;
  padding: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  margin-top: 1rem;
`;

const AddProjectButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00a2ff;
  color: #00a2ff;
  padding: 0.5rem 1rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: rgba(0, 162, 255, 0.1);
  }
`;

const ProjectList = styled.div`
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 162, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00a2ff;
    border-radius: 4px;
  }
`;

const ProjectItem = styled.div`
  background: rgba(0, 162, 255, 0.05);
  border: 1px solid rgba(0, 162, 255, 0.2);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 162, 255, 0.1);
    transform: translateX(5px);
  }
`;

const ProjectName = styled.div`
  color: #00a2ff;
  font-size: 0.9rem;
`;

const ProjectDate = styled.div`
  color: rgba(0, 162, 255, 0.7);
  font-size: 0.8rem;
`;

const BadgeDetails = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 162, 255, 0.2);
`;

const BadgeDescription = styled.p`
  color: rgba(0, 162, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const TechnologyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 162, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00a2ff;
    border-radius: 4px;
  }
`;

const TechnologyCard = styled(motion.div)<{ selected: boolean }>`
  background: ${props => props.selected ? 'rgba(0, 162, 255, 0.2)' : 'rgba(0, 162, 255, 0.05)'};
  border: 2px solid ${props => props.selected ? '#00a2ff' : 'rgba(0, 162, 255, 0.2)'};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 162, 255, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      ${props => props.selected ? 'rgba(0, 162, 255, 0.1)' : 'transparent'},
      transparent
    );
    animation: ${shine} 2s linear infinite;
  }
`;

const TechnologyIcon = styled.div<{ techId: string }>`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 40px;
    height: 40px;
    color: ${props => {
      switch (props.techId) {
        case 'html': return '#E34F26'; // HTML5 orange
        case 'css': return '#264DE4'; // CSS3 blue
        case 'tailwind': return '#38B2AC'; // Tailwind teal
        case 'javascript': return '#F7DF1E'; // JavaScript yellow
        case 'react': return '#61DAFB'; // React blue
        case 'nextjs': return '#000000'; // Next.js black
        case 'nodejs': return '#339933'; // Node.js green
        case 'express': return '#000000'; // Express black
        case 'mongodb': return '#47A248'; // MongoDB green
        case 'sql': return '#336791'; // PostgreSQL blue
        case 'git': return '#F05032'; // Git orange
        case 'docker': return '#2496ED'; // Docker blue
        case 'aws': return '#FF9900'; // AWS orange
        default: return '#00a2ff';
      }
    }};
  }
`;

const TechnologyName = styled.div`
  color: #00a2ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SelectedCount = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #00a2ff;
  color: #000;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CodeMastery: React.FC<CodeMasteryProps> = ({ onBack }) => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      badges: [
        {
          id: 'html',
          name: 'HTML',
          currentTier: 'BRONZE',
          icon: <SiHtml5 />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 5,
            GOLD: 8,
            PLATINUM: 12
          },
          projects: []
        },
        {
          id: 'css',
          name: 'CSS',
          currentTier: 'BRONZE',
          icon: <SiCss3 />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 5,
            GOLD: 8,
            PLATINUM: 12
          },
          projects: []
        },
        {
          id: 'tailwind',
          name: 'Tailwind',
          currentTier: 'BRONZE',
          icon: <SiTailwindcss />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        },
        {
          id: 'javascript',
          name: 'JavaScript',
          currentTier: 'BRONZE',
          icon: <SiJavascript />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 3,
            SILVER: 6,
            GOLD: 9,
            PLATINUM: 15
          },
          projects: []
        },
        {
          id: 'react',
          name: 'React',
          currentTier: 'BRONZE',
          icon: <SiReact />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 5,
            GOLD: 8,
            PLATINUM: 12
          },
          projects: []
        },
        {
          id: 'nextjs',
          name: 'Next.js',
          currentTier: 'BRONZE',
          icon: <SiNextdotjs />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Mastery',
      badges: [
        {
          id: 'nodejs',
          name: 'Node.js',
          currentTier: 'BRONZE',
          icon: <SiNodedotjs />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 5,
            GOLD: 8,
            PLATINUM: 12
          },
          projects: []
        },
        {
          id: 'express',
          name: 'Express',
          currentTier: 'BRONZE',
          icon: <SiExpress />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        },
        {
          id: 'mongodb',
          name: 'MongoDB',
          currentTier: 'BRONZE',
          icon: <SiMongodb />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        },
        {
          id: 'sql',
          name: 'SQL',
          currentTier: 'BRONZE',
          icon: <SiPostgresql />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps Mastery',
      badges: [
        {
          id: 'git',
          name: 'Git',
          currentTier: 'BRONZE',
          icon: <SiGit />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        },
        {
          id: 'docker',
          name: 'Docker',
          currentTier: 'BRONZE',
          icon: <SiDocker />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        },
        {
          id: 'aws',
          name: 'AWS',
          currentTier: 'BRONZE',
          icon: <SiAmazon />,
          projectsCompleted: 0,
          tierRequirements: {
            BRONZE: 2,
            SILVER: 4,
            GOLD: 6,
            PLATINUM: 10
          },
          projects: []
        }
      ]
    }
  ]);

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    technologies: [] as string[],
    projectName: ''
  });

  const updateBadgeTier = (badge: Badge, projectsCompleted: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' => {
    if (projectsCompleted >= badge.tierRequirements.PLATINUM) return 'PLATINUM';
    if (projectsCompleted >= badge.tierRequirements.GOLD) return 'GOLD';
    if (projectsCompleted >= badge.tierRequirements.SILVER) return 'SILVER';
    if (projectsCompleted >= badge.tierRequirements.BRONZE) return 'BRONZE';
    return 'BRONZE';
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    setTracks(prevTracks => 
      prevTracks.map(track => ({
        ...track,
        badges: track.badges.map(badge => {
          if (newProject.technologies.includes(badge.id)) {
            const newProjectsCompleted = badge.projectsCompleted + 1;
            const projectToAdd: Project = {
              id: Date.now().toString(),
              name: newProject.projectName,
              date: new Date().toISOString().split('T')[0]
            };
            return {
              ...badge,
              projectsCompleted: newProjectsCompleted,
              currentTier: updateBadgeTier(badge, newProjectsCompleted),
              projects: [...badge.projects, projectToAdd]
            };
          }
          return badge;
        })
      }))
    );

    setShowModal(false);
    setNewProject({ technologies: [], projectName: '' });
  };

  const handleTechnologyClick = (techId: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter(id => id !== techId)
        : [...prev.technologies, techId]
    }));
  };

  const getNextTierRequirement = (badge: Badge) => {
    switch (badge.currentTier) {
      case 'BRONZE':
        return badge.tierRequirements.SILVER;
      case 'SILVER':
        return badge.tierRequirements.GOLD;
      case 'GOLD':
        return badge.tierRequirements.PLATINUM;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Code Mastery</Title>
          <Subtitle>SKILL_ENHANCEMENT_OS v1.0</Subtitle>
        </div>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Tasks
        </BackButton>
      </Header>

      <AddProjectButton
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add New Project
      </AddProjectButton>

      <AchievementTracks>
        {tracks.map(track => (
          <TrackCard key={track.id}>
            <TrackTitle>{track.title}</TrackTitle>
            <BadgeGrid>
              {track.badges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  unlocked={badge.projectsCompleted >= badge.tierRequirements.BRONZE}
                  tier={badge.currentTier}
                  onClick={() => setSelectedBadge(badge)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BadgeIcon 
                    unlocked={badge.projectsCompleted >= badge.tierRequirements.BRONZE} 
                    tier={badge.currentTier}
                  >
                    {badge.icon}
                  </BadgeIcon>
                  <BadgeName unlocked={badge.projectsCompleted >= badge.tierRequirements.BRONZE}>
                    {badge.name}
                  </BadgeName>
                  <BadgeTier tier={badge.currentTier}>
                    {badge.currentTier}
                  </BadgeTier>
                  <Progress>
                    {badge.projectsCompleted} Projects
                    {getNextTierRequirement(badge) !== null && 
                      ` (${getNextTierRequirement(badge)! - badge.projectsCompleted} to ${
                        badge.currentTier === 'BRONZE' ? 'SILVER' :
                        badge.currentTier === 'SILVER' ? 'GOLD' :
                        badge.currentTier === 'GOLD' ? 'PLATINUM' : ''
                      })`
                    }
                  </Progress>
                </BadgeCard>
              ))}
            </BadgeGrid>
          </TrackCard>
        ))}
      </AchievementTracks>

      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent>
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            <h3 style={{ color: '#00a2ff', marginBottom: '1rem' }}>Add New Project</h3>
            <Form onSubmit={handleAddProject}>
              <div>
                <label style={{ color: '#00a2ff', marginBottom: '0.5rem', display: 'block' }}>
                  Select Technologies Used
                </label>
                <TechnologyGrid>
                  {tracks.flatMap(track => 
                    track.badges.map(badge => (
                      <TechnologyCard
                        key={badge.id}
                        selected={newProject.technologies.includes(badge.id)}
                        onClick={() => handleTechnologyClick(badge.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {newProject.technologies.includes(badge.id) && (
                          <SelectedCount>
                            {newProject.technologies.indexOf(badge.id) + 1}
                          </SelectedCount>
                        )}
                        <TechnologyIcon techId={badge.id}>
                          {badge.icon}
                        </TechnologyIcon>
                        <TechnologyName>{badge.name}</TechnologyName>
                      </TechnologyCard>
                    ))
                  )}
                </TechnologyGrid>
                {newProject.technologies.length === 0 && (
                  <div style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Please select at least one technology
                  </div>
                )}
              </div>
              <Input
                type="text"
                placeholder="Project Name"
                value={newProject.projectName}
                onChange={(e) => setNewProject(prev => ({ ...prev, projectName: e.target.value }))}
                required
              />
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={newProject.technologies.length === 0}
                style={{ 
                  opacity: newProject.technologies.length === 0 ? 0.5 : 1,
                  cursor: newProject.technologies.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Add Project
              </SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {selectedBadge && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent>
            <CloseButton onClick={() => setSelectedBadge(null)}>×</CloseButton>
            <BadgeDetails>
              <BadgeIcon 
                unlocked={selectedBadge.projectsCompleted >= selectedBadge.tierRequirements.BRONZE} 
                tier={selectedBadge.currentTier}
              >
                {selectedBadge.icon}
              </BadgeIcon>
              <BadgeName unlocked={selectedBadge.projectsCompleted >= selectedBadge.tierRequirements.BRONZE}>
                {selectedBadge.name}
              </BadgeName>
              <BadgeTier tier={selectedBadge.currentTier}>
                {selectedBadge.currentTier}
              </BadgeTier>
              <BadgeDescription>
                {selectedBadge.projectsCompleted} Projects Completed
                {getNextTierRequirement(selectedBadge) !== null && 
                  ` (${getNextTierRequirement(selectedBadge)! - selectedBadge.projectsCompleted} to ${
                    selectedBadge.currentTier === 'BRONZE' ? 'SILVER' :
                    selectedBadge.currentTier === 'SILVER' ? 'GOLD' :
                    selectedBadge.currentTier === 'GOLD' ? 'PLATINUM' : ''
                  })`
                }
              </BadgeDescription>
            </BadgeDetails>
            <h3 style={{ color: '#00a2ff', marginBottom: '1rem' }}>Projects</h3>
            <ProjectList>
              {selectedBadge.projects.map(project => (
                <ProjectItem key={project.id}>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectDate>{project.date}</ProjectDate>
                </ProjectItem>
              ))}
            </ProjectList>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CodeMastery; 