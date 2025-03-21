import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  timeOfDay: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  date: string;
}

const scanlines = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 15px; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #e4f3ff;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00ff9d;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 157, 0.1) 0px,
      rgba(0, 255, 157, 0.1) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    animation: ${scanlines} 0.5s linear infinite;
  }
`;

const Title = styled.h1`
  color: #00ff9d;
  font-family: 'Share Tech Mono', monospace;
  margin: 0;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff9d;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatBox = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff9d;
  padding: 1rem;
  text-align: center;
  
  h3 {
    color: #00ff9d;
    margin: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  p {
    color: #fff;
    font-size: 1.5rem;
    margin: 0.5rem 0 0;
    font-family: 'Share Tech Mono', monospace;
  }
`;

const Form = styled.form`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00ff9d;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #00ff9d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff9d;
  padding: 0.75rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff9d;
  padding: 0.75rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
  }
  
  option {
    background: #000;
  }
`;

const Button = styled(motion.button)`
  background: transparent;
  border: 2px solid #00ff9d;
  color: #00ff9d;
  padding: 0.75rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(0, 255, 157, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.2);
  }
`;

const EntriesList = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #00ff9d;
  padding: 1.5rem;
`;

const Entry = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff9d;
  padding: 1rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const EntryText = styled.span`
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
`;

const DeleteButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #ff3e88;
  color: #ff3e88;
  padding: 0.5rem;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  
  &:hover {
    background: rgba(255, 62, 136, 0.1);
    box-shadow: 0 0 10px rgba(255, 62, 136, 0.2);
  }
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00ff9d;
  color: #00ff9d;
  padding: 0.75rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  
  &:hover {
    background: rgba(0, 255, 157, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.2);
  }
`;

const ViewToggle = styled(motion.button)`
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid #00ff9d;
  color: #00ff9d;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 157, 0.2);
  }
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
`;

const DateSection = styled.div`
  margin-bottom: 30px;
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 8px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
`;

const DateHeader = styled.h3`
  color: #00ff9d;
  margin-bottom: 15px;
  font-family: 'Share Tech Mono', monospace;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DailySummary = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 255, 157, 0.1);
  border-radius: 4px;
`;

const SummaryItem = styled.div`
  color: #e4f3ff;
  span {
    color: #00ff9d;
    margin-left: 5px;
  }
`;

interface FoodTrackerProps {
  onBack: () => void;
}

const FoodTracker: React.FC<FoodTrackerProps> = ({ onBack }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [entries, setEntries] = useState<FoodEntry[]>(() => {
    const savedEntries = localStorage.getItem('foodEntries');
    if (savedEntries) {
      return JSON.parse(savedEntries);
    }
    return [];
  });

  const [newEntry, setNewEntry] = useState<Omit<FoodEntry, 'id' | 'date'>>({
    name: '',
    calories: 0,
    protein: 0,
    timeOfDay: 'BREAKFAST'
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('foodEntries', JSON.stringify(entries));
  }, [entries]);

  const today = new Date().toLocaleDateString();
  const todayEntries = entries.filter(entry => entry.date === today);
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: FoodEntry = {
      id: Date.now().toString(),
      ...newEntry,
      calories: Number(newEntry.calories) || 0,
      protein: Number(newEntry.protein) || 0,
      date: new Date().toLocaleDateString()
    };
    setEntries([...entries, entry]);
    setNewEntry({
      name: '',
      calories: 0,
      protein: 0,
      timeOfDay: 'BREAKFAST'
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'calories' | 'protein') => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setNewEntry(prev => ({ ...prev, [field]: value }));
      return;
    }
    const cleanValue = value.replace(/^0+/, '').replace(/[^\d]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10);
    setNewEntry(prev => ({ ...prev, [field]: numValue }));
  };

  // Group entries by date for history view
  const groupedEntries = React.useMemo(() => {
    const groups: { [key: string]: FoodEntry[] } = {};
    [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(entry => {
        if (!groups[entry.date]) {
          groups[entry.date] = [];
        }
        groups[entry.date].push(entry);
      });
    return groups;
  }, [entries]);

  return (
    <Container>
      <BackButton
        onClick={onBack}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Tasks
      </BackButton>

      <Header>
        <Title>Food Tracker</Title>
        <Stats>
          <StatBox>
            <h3>Today's Calories</h3>
            <p>{totalCalories}</p>
          </StatBox>
          <StatBox>
            <h3>Today's Protein</h3>
            <p>{totalProtein}g</p>
          </StatBox>
        </Stats>
      </Header>

      <ViewToggle
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showHistory ? 'Show Today' : 'Show History'}
      </ViewToggle>

      {!showHistory ? (
        <>
          <Form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Food Name</Label>
                <Input
                  type="text"
                  value={newEntry.name}
                  onChange={e => setNewEntry({ ...newEntry, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Calories</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={newEntry.calories}
                  onChange={e => handleNumberInput(e, 'calories')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Protein (g)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={newEntry.protein}
                  onChange={e => handleNumberInput(e, 'protein')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Time of Day</Label>
                <Select
                  value={newEntry.timeOfDay}
                  onChange={e => setNewEntry({ ...newEntry, timeOfDay: e.target.value as FoodEntry['timeOfDay'] })}
                >
                  <option value="BREAKFAST">BREAKFAST</option>
                  <option value="LUNCH">LUNCH</option>
                  <option value="DINNER">DINNER</option>
                  <option value="SNACK">SNACK</option>
                </Select>
              </FormGroup>
            </FormGrid>
            <Button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Entry
            </Button>
          </Form>

          <EntriesList>
            <AnimatePresence>
              {todayEntries.map(entry => (
                <Entry
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <EntryText>{entry.name}</EntryText>
                  <EntryText>{entry.calories} cal</EntryText>
                  <EntryText>{entry.protein}g protein</EntryText>
                  <EntryText>{entry.timeOfDay}</EntryText>
                  <DeleteButton
                    onClick={() => handleDelete(entry.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </DeleteButton>
                </Entry>
              ))}
            </AnimatePresence>
          </EntriesList>
        </>
      ) : (
        <HistoryContainer>
          {Object.entries(groupedEntries).map(([date, dateEntries]) => {
            const dailyCalories = dateEntries.reduce((sum, entry) => sum + entry.calories, 0);
            const dailyProtein = dateEntries.reduce((sum, entry) => sum + entry.protein, 0);
            
            return (
              <DateSection key={date}>
                <DateHeader>
                  {date === today ? 'Today' : date}
                </DateHeader>
                <DailySummary>
                  <SummaryItem>Total Calories: <span>{dailyCalories}</span></SummaryItem>
                  <SummaryItem>Total Protein: <span>{dailyProtein}g</span></SummaryItem>
                </DailySummary>
                <EntriesList>
                  {dateEntries.map(entry => (
                    <Entry
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <EntryText>{entry.name}</EntryText>
                      <EntryText>{entry.calories} cal</EntryText>
                      <EntryText>{entry.protein}g protein</EntryText>
                      <EntryText>{entry.timeOfDay}</EntryText>
                      <DeleteButton
                        onClick={() => handleDelete(entry.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </DeleteButton>
                    </Entry>
                  ))}
                </EntriesList>
              </DateSection>
            );
          })}
        </HistoryContainer>
      )}
    </Container>
  );
};

export default FoodTracker;