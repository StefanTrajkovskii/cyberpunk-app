import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  participants?: string[];
  category: 'social' | 'appointment' | 'task' | 'other';
  completed: boolean;
}

const Missions: React.FC = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    participants: [],
    category: 'other',
    completed: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      participants: [],
      category: 'other',
      completed: false
    });
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description || '',
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location || '',
      participants: newEvent.participants || [],
      category: newEvent.category as Event['category'],
      completed: false
    };

    setEvents([...events, event]);
    setIsModalOpen(false);
  };

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === eventId ? { ...event, completed: true } : event
    ));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  return (
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
            <span>Welcome, {user?.username || 'netrunner'}. {events.length} events scheduled.</span>
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
            <span>{new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} | Network: <StatusHighlight>SECURE</StatusHighlight></span>
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
                repeatDelay: 6
              }}
            >
              BALANCE:
            </GlitchText>
            <span>¥ {user?.currency?.toLocaleString() || '0'}</span>
          </StatusText>
        </StatusBar>
      </HeaderSection>

      <ContentSection>
        <ActionBar>
          <AddButton onClick={handleAddEvent}>
            <AddIcon>+</AddIcon>
            SCHEDULE EVENT
          </AddButton>
        </ActionBar>

        <EventGrid>
          <AnimatePresence>
            {events.map(event => (
              <EventCard
                key={event.id}
                category={event.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EventHeader>
                  <EventTitle category={event.category}>{event.title}</EventTitle>
                  <CategoryBadge category={event.category}>{event.category}</CategoryBadge>
                </EventHeader>

                <EventDetails>
                  <DetailItem>
                    <DetailLabel>Date</DetailLabel>
                    <DetailValue>{event.date}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Time</DetailLabel>
                    <DetailValue>{event.time}</DetailValue>
                  </DetailItem>
                  {event.location && (
                    <DetailItem>
                      <DetailLabel>Location</DetailLabel>
                      <DetailValue>{event.location}</DetailValue>
                    </DetailItem>
                  )}
                  {event.participants && event.participants.length > 0 && (
                    <DetailItem>
                      <DetailLabel>Participants</DetailLabel>
                      <DetailValue>{event.participants.join(', ')}</DetailValue>
                    </DetailItem>
                  )}
                </EventDetails>

                <EventDescription>{event.description}</EventDescription>

                <EventFooter>
                  <ButtonGroup>
                    <ActionButton
                      onClick={() => handleCompleteEvent(event.id)}
                      disabled={event.completed}
                      completed={event.completed}
                    >
                      {event.completed ? 'COMPLETED' : 'COMPLETE'}
                    </ActionButton>
                    <DeleteButton onClick={() => handleDeleteEvent(event.id)}>
                      DELETE
                    </DeleteButton>
                  </ButtonGroup>
                </EventFooter>
              </EventCard>
            ))}
          </AnimatePresence>
        </EventGrid>
      </ContentSection>

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
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Schedule New Event</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmitEvent}>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="title">
                      Event Title
                      <CharCount color={newEvent.title?.length === 16 ? '#ff3e88' : '#00f6ff'}>
                        {newEvent.title?.length || 0}/16
                      </CharCount>
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                      maxLength={16}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      type="time"
                      id="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="participants">Participants (Optional)</Label>
                    <Input
                      type="text"
                      id="participants"
                      name="participants"
                      value={newEvent.participants?.join(', ')}
                      onChange={(e) => {
                        const participants = e.target.value.split(',').map(p => p.trim());
                        setNewEvent(prev => ({ ...prev, participants }));
                      }}
                      placeholder="Enter participants (comma-separated)"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      id="category"
                      name="category"
                      value={newEvent.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="social">Social</option>
                      <option value="appointment">Appointment</option>
                      <option value="task">Task</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormGroup>

                  <FormGroup className="full-width">
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                      id="description"
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      placeholder="Describe the event"
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
                    SCHEDULE EVENT
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: #0a0a12;
  color: #e4f3ff;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const StatusBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  border-radius: 5px;
`;

const StatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
`;

const GlitchText = styled(motion.span)`
  color: #00f6ff;
  text-shadow: 0 0 5px rgba(0, 246, 255, 0.7);
`;

const StatusHighlight = styled.span`
  color: #23d18b;
  text-shadow: 0 0 5px rgba(35, 209, 139, 0.7);
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #00f6ff;
  color: #00f6ff;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
  }
`;

const AddIcon = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled(motion.div)<{ category: string }>`
  background: rgba(0, 10, 20, 0.6);
  border: 1px solid ${props => {
    switch (props.category) {
      case 'social': return '#ff3e88';
      case 'appointment': return '#00f6ff';
      case 'task': return '#23d18b';
      default: return '#ff3e88';
    }
  }};
  border-radius: 5px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => {
        switch (props.category) {
          case 'social': return '#ff3e88';
          case 'appointment': return '#00f6ff';
          case 'task': return '#23d18b';
          default: return '#ff3e88';
        }
      }}, 
      transparent
    );
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3<{ category: string }>`
  margin: 0;
  color: ${props => {
    switch (props.category) {
      case 'social': return '#ff3e88';
      case 'appointment': return '#00f6ff';
      case 'task': return '#23d18b';
      default: return '#ff3e88';
    }
  }};
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CategoryBadge = styled.span<{ category: string }>`
  padding: 0.25rem 0.75rem;
  background: ${props => {
    switch (props.category) {
      case 'social': return 'rgba(255, 62, 136, 0.2)';
      case 'appointment': return 'rgba(0, 246, 255, 0.2)';
      case 'task': return 'rgba(35, 209, 139, 0.2)';
      default: return 'rgba(255, 62, 136, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'social': return '#ff3e88';
      case 'appointment': return '#00f6ff';
      case 'task': return '#23d18b';
      default: return '#ff3e88';
    }
  }};
  border-radius: 3px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.div`
  color: #00f6ff;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DetailValue = styled.div`
  color: #e4f3ff;
  font-size: 0.9rem;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
  border-left: 2px solid #ff3e88;
`;

const EventDescription = styled.p`
  color: #b8c0c2;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 1rem 0;
  flex-grow: 1;
`;

const EventFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)<{ completed?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.completed ? 'rgba(35, 209, 139, 0.2)' : 'transparent'};
  border: 2px solid ${props => props.completed ? '#23d18b' : '#00f6ff'};
  color: ${props => props.completed ? '#23d18b' : '#00f6ff'};
  font-family: 'Share Tech Mono', monospace;
  cursor: ${props => props.completed ? 'default' : 'pointer'};
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.completed ? 'rgba(35, 209, 139, 0.2)' : 'rgba(0, 246, 255, 0.1)'};
    box-shadow: ${props => props.completed ? 'none' : '0 0 20px rgba(0, 246, 255, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 2px solid #ff3e88;
  color: #ff3e88;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 62, 136, 0.1);
    box-shadow: 0 0 20px rgba(255, 62, 136, 0.3);
  }
`;

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
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  background: rgba(15, 15, 35, 0.95);
  border: 2px solid #00f6ff;
  border-radius: 5px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 246, 255, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  color: #00f6ff;
  margin: 0;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #e4f3ff;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff3e88;
    transform: scale(1.1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const CharCount = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.8rem;
  color: ${props => props.color || '#00f6ff'};
`;

const Label = styled.label`
  color: #00f6ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
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
  padding: 0.8rem;
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

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #00f6ff;
  color: #00f6ff;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
  }
  
  &.cancel {
    border-color: #ff3e88;
    color: #ff3e88;
    
    &:hover {
      background: rgba(255, 62, 136, 0.1);
      box-shadow: 0 0 20px rgba(255, 62, 136, 0.3);
    }
  }
`;

export default Missions; 