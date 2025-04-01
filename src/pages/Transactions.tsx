import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TransactionsProps {
  onBack: () => void;
}

// Transaction interfaces
interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}


// Predefined colors for categories
const CATEGORY_COLORS = [
  '#00f6ff', // Cyan
  '#ff3e88', // Pink
  '#23d18b', // Green
  '#ff9500', // Orange
  '#9d00ff', // Purple
  '#ffff00', // Yellow
  '#1a75ff', // Blue
  '#ff5c33', // Red
  '#00cc99', // Teal
  '#ff00ff', // Magenta
];

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
  text-align: center;
`;

const TitleSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: 'NIGHT CITY';
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    letter-spacing: 8px;
    color: #00f6ff;
    font-family: 'Share Tech Mono', monospace;
    opacity: 0.8;
    text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
    white-space: nowrap;
    text-align: center;
    width: 100%;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      letter-spacing: 3px;
      top: -1.8rem;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #00f6ff 50%,
      transparent 100%
    );
    box-shadow: 0 0 20px rgba(0, 246, 255, 0.5);
  }
`;

const Title = styled.h1`
  color: #00f6ff;
  font-size: 6rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 12px;
  text-shadow: 
    0 0 20px rgba(0, 246, 255, 0.5),
    0 0 40px rgba(0, 246, 255, 0.3),
    0 0 60px rgba(0, 246, 255, 0.1);
  font-family: 'Share Tech Mono', monospace;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    letter-spacing: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: 4px;
    width: 100%;
    word-break: break-word;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid #00f6ff;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PanelTitle = styled.h2`
  color: #00f6ff;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
  border-bottom: 1px solid rgba(0, 246, 255, 0.3);
  padding-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #b8c0c2;
  font-size: 0.9rem;
  font-family: 'Share Tech Mono', monospace;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  border-radius: 4px;
  
  &:focus {
    outline: none;
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
  border-radius: 4px;
  
  &:focus {
    outline: none;
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
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
  }
`;

const Button = styled.button<{ $variant?: 'expense' | 'income' }>`
  background: ${props => 
    props.$variant === 'expense' 
      ? 'rgba(255, 62, 136, 0.1)' 
      : props.$variant === 'income' 
        ? 'rgba(35, 209, 139, 0.1)' 
        : 'rgba(0, 246, 255, 0.1)'
  };
  border: 1px solid ${props => 
    props.$variant === 'expense' 
      ? '#ff3e88' 
      : props.$variant === 'income' 
        ? '#23d18b' 
        : '#00f6ff'
  };
  color: ${props => 
    props.$variant === 'expense' 
      ? '#ff3e88' 
      : props.$variant === 'income' 
        ? '#23d18b' 
        : '#00f6ff'
  };
  padding: 0.8rem 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => 
      props.$variant === 'expense' 
        ? 'rgba(255, 62, 136, 0.2)' 
        : props.$variant === 'income' 
          ? 'rgba(35, 209, 139, 0.2)' 
          : 'rgba(0, 246, 255, 0.2)'
    };
    box-shadow: 0 0 15px ${props => 
      props.$variant === 'expense' 
        ? 'rgba(255, 62, 136, 0.3)' 
        : props.$variant === 'income' 
          ? 'rgba(35, 209, 139, 0.3)' 
          : 'rgba(0, 246, 255, 0.3)'
    };
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TransactionList = styled.div`
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 246, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 246, 255, 0.5);
  }
`;

const TransactionItem = styled.div<{ $type: 'income' | 'expense' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-bottom: 1px solid rgba(0, 246, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 246, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const TransactionCategory = styled.div<{ $color: string }>`
  font-size: 0.8rem;
  color: ${props => props.$color};
  font-family: 'Share Tech Mono', monospace;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${props => props.$color};
    margin-right: 0.5rem;
    border-radius: 50%;
  }
`;

const TransactionDescription = styled.div`
  font-size: 0.9rem;
  color: #b8c0c2;
`;

const TransactionAmount = styled.div<{ $type: 'income' | 'expense' }>`
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.$type === 'income' ? '#23d18b' : '#ff3e88'};
  font-family: 'Share Tech Mono', monospace;
  min-width: 80px;
  text-align: right;
  
  &::before {
    content: "${props => props.$type === 'income' ? '+¥' : '-¥'}";
    margin-right: 0.2rem;
  }
`;

const TransactionDate = styled.div`
  font-size: 0.7rem;
  color: rgba(184, 192, 194, 0.6);
  margin-top: 0.2rem;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 62, 136, 0.7);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff3e88;
    transform: scale(1.1);
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 246, 255, 0.2);
`;

const SummaryItem = styled.div<{ $type: 'income' | 'expense' | 'balance' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: #b8c0c2;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.3rem;
`;

const SummaryValue = styled.div<{ $type: 'income' | 'expense' | 'balance' }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => 
    props.$type === 'income' 
      ? '#23d18b' 
      : props.$type === 'expense' 
        ? '#ff3e88' 
        : '#00f6ff'
  };
  font-family: 'Share Tech Mono', monospace;
  
  &::before {
    content: "${props => props.$type === 'income' ? '+' : props.$type === 'expense' ? '-' : ''}¥";
    margin-right: 0.2rem;
  }
`;

const AddCategoryContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const CategoryTag = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.$color};
  border-radius: 20px;
  padding: 0.2rem 0.8rem;
  font-size: 0.8rem;
  color: ${props => props.$color};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${props => props.$color};
    margin-right: 0.5rem;
    border-radius: 50%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #b8c0c2;
  font-size: 1rem;
  font-family: 'Share Tech Mono', monospace;
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
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #0a0a12;
  border: 2px solid #00f6ff;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const ModalTitle = styled.h3`
  color: #00f6ff;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
  border-bottom: 1px solid rgba(0, 246, 255, 0.3);
  padding-bottom: 0.5rem;
`;

const Transactions: React.FC<TransactionsProps> = ({ onBack }) => {
  const { user, updateUserData } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return user?.transactions || [];
  });
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    amount: undefined,
    category: '',
    description: '',
    type: 'expense',
  });
  
  const [categories, setCategories] = useState<string[]>([
    'Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education', 'Salary', 'Investment'
  ]);
  
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  useEffect(() => {
    if (user?.transactions) {
      setTransactions(user.transactions);
    }
    
    if (user?.categories) {
      setCategories(user.categories);
    }
  }, [user]);
  
  // Use ref to avoid dependency issues
  const userRef = React.useRef(user);
  const updateUserDataRef = React.useRef(updateUserData);
  
  // Keep refs updated
  useEffect(() => {
    userRef.current = user;
    updateUserDataRef.current = updateUserData;
  }, [user, updateUserData]);
  
  // This effect now depends only on transactions and categories
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userRef.current) {
        updateUserDataRef.current({ 
          transactions,
          categories
        });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [transactions, categories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setNewTransaction({ ...newTransaction, [name]: parseFloat(value) || 0 });
    } else {
      setNewTransaction({ ...newTransaction, [name]: value });
    }
  };
  
  const handleTransactionTypeChange = (type: 'income' | 'expense') => {
    setNewTransaction({ ...newTransaction, type });
  };
  
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTransaction.amount || newTransaction.amount <= 0 || !newTransaction.category || !newTransaction.description) {
      return;
    }
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: newTransaction.amount as number,
      category: newTransaction.category as string,
      description: newTransaction.description as string,
      date: new Date().toISOString(),
      type: newTransaction.type as 'income' | 'expense'
    };
    
    setTransactions([...transactions, transaction]);
    
    // Reset form
    setNewTransaction({
      amount: undefined,
      category: '',
      description: '',
      type: 'expense',
    });
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setNewCategory('');
      setIsAddCategoryModalOpen(false);
    }
  };
  
  // Use memoization to prevent unnecessary chart recalculations
  const expenseData = React.useMemo(() => {
    // Inline implementation of getExpensesByCategory
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};
    
    expenseTransactions.forEach(t => {
      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] = t.amount;
      }
    });
    
    return Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }));
  }, [transactions]);
  
  // Get the color for a specific category
  const getCategoryColor = (category: string): string => {
    const index = categories.indexOf(category);
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  };
  
  // Memoize the total calculations to avoid recalculating on every render
  const { totalIncome, totalExpense, balance } = React.useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);
  
  return (
    <Container>
      
      <Header>
        <TitleSection>
          <Title>Transactions</Title>
        </TitleSection>
      </Header>
      
      <ContentGrid>
        <Panel>
          <PanelTitle>Add Transaction</PanelTitle>
          
          <Form onSubmit={handleAddTransaction}>
            <InputGroup>
              <Label htmlFor="amount">Amount (¥)</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="0"
                step="1"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Select>
              
              <AddCategoryContainer>
                {categories.slice(0, 5).map((category, index) => (
                  <CategoryTag key={index} $color={getCategoryColor(category)}>
                    {category}
                  </CategoryTag>
                ))}
                {categories.length > 5 && <CategoryTag $color="#00f6ff">+{categories.length - 5} more</CategoryTag>}
                <Button 
                  type="button" 
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                >
                  + New
                </Button>
              </AddCategoryContainer>
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                required
              />
            </InputGroup>
            
            <ButtonGroup>
              <Button 
                type="button"
                $variant="expense"
                onClick={() => handleTransactionTypeChange('expense')}
                style={{
                  opacity: newTransaction.type === 'expense' ? 1 : 0.5,
                  flex: 1
                }}
              >
                Expense
              </Button>
              <Button 
                type="button"
                $variant="income"
                onClick={() => handleTransactionTypeChange('income')}
                style={{
                  opacity: newTransaction.type === 'income' ? 1 : 0.5,
                  flex: 1
                }}
              >
                Income
              </Button>
            </ButtonGroup>
            
            <Button 
              type="submit"
              style={{ marginTop: '1rem' }}
            >
              Add Transaction
            </Button>
          </Form>
          
          <SummaryContainer>
            <SummaryItem $type="income">
              <SummaryLabel>Income</SummaryLabel>
              <SummaryValue $type="income">{totalIncome.toLocaleString()}</SummaryValue>
            </SummaryItem>
            
            <SummaryItem $type="expense">
              <SummaryLabel>Expense</SummaryLabel>
              <SummaryValue $type="expense">{totalExpense.toLocaleString()}</SummaryValue>
            </SummaryItem>
            
            <SummaryItem $type="balance">
              <SummaryLabel>Balance</SummaryLabel>
              <SummaryValue $type="balance">{balance.toLocaleString()}</SummaryValue>
            </SummaryItem>
          </SummaryContainer>
        </Panel>
        
        <Panel>
          <PanelTitle>Spending Breakdown</PanelTitle>
          
          {expenseData.length > 0 ? (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`¥${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{ 
                      background: 'rgba(10, 10, 18, 0.95)', 
                      border: '1px solid #00f6ff',
                      borderRadius: '4px',
                      fontFamily: 'Share Tech Mono, monospace',
                      color: '#00f6ff',
                      boxShadow: '0 0 10px rgba(0, 246, 255, 0.3)'
                    }}
                    itemStyle={{
                      color: '#ffffff'
                    }}
                    labelStyle={{
                      color: '#00f6ff'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState>Add some expenses to see your spending breakdown</EmptyState>
          )}
          
          <PanelTitle>Recent Transactions</PanelTitle>
          
          <TransactionList>
            {transactions.length > 0 ? (
              transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(transaction => (
                  <TransactionItem key={transaction.id} $type={transaction.type}>
                    <TransactionInfo>
                      <TransactionCategory $color={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </TransactionCategory>
                      <TransactionDescription>{transaction.description}</TransactionDescription>
                      <TransactionDate>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TransactionDate>
                    </TransactionInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TransactionAmount $type={transaction.type}>
                        {transaction.amount.toLocaleString()}
                      </TransactionAmount>
                      <DeleteButton onClick={() => handleDeleteTransaction(transaction.id)}>×</DeleteButton>
                    </div>
                  </TransactionItem>
                ))
            ) : (
              <EmptyState>No transactions yet</EmptyState>
            )}
          </TransactionList>
        </Panel>
      </ContentGrid>
      
      <AnimatePresence>
        {isAddCategoryModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddCategoryModalOpen(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalTitle>Add New Category</ModalTitle>
              
              <InputGroup>
                <Label htmlFor="newCategory">Category Name</Label>
                <Input
                  type="text"
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </InputGroup>
              
              <ButtonGroup style={{ marginTop: '1.5rem' }}>
                <Button 
                  type="button"
                  $variant="expense"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddCategory}
                  style={{ flex: 1 }}
                >
                  Add Category
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Transactions; 