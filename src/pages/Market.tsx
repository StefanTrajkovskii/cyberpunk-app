import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import GlitchButton from '../components/GlitchButton';

interface MarketProps {
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  position: relative;
  width: 100%;
  text-align: center;
`;

const TitleSection = styled.div`
  position: relative;
  margin-bottom: 3rem;

  &::before {
    content: 'NIGHT CITY';
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    letter-spacing: 8px;
    color: #00f6ff;
    font-family: 'Share Tech Mono', monospace;
    opacity: 0.8;
    text-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
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
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid #00f6ff;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00f6ff, transparent);
  }
`;

const ProductName = styled.h3`
  color: #00f6ff;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const ProductPrice = styled.div`
  color: #23d18b;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  
  &::before {
    content: "¥";
    margin-right: 0.2rem;
  }
`;

const ProductDescription = styled.p`
  color: #b8c0c2;
  margin-bottom: 1.5rem;
`;

const ProgressContainer = styled.div`
  margin: 1rem 0;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(0, 246, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: #00f6ff;
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  color: #b8c0c2;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'secondary' ? 'transparent' : 'rgba(0, 246, 255, 0.1)'};
  border: 1px solid #00f6ff;
  color: #00f6ff;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: rgba(0, 246, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 246, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: rgba(0, 246, 255, 0.1);
      box-shadow: none;
    }
  }
`;

const HeaderDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(0, 246, 255, 0) 0%,
    rgba(0, 246, 255, 0.5) 50%,
    #00f6ff 100%
  );
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

const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
  color: #fff;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-family: 'Share Tech Mono', monospace;

  &:focus {
    outline: none;
    border-color: #00f6ff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 246, 255, 0.3);
  padding: 0.8rem;
  color: #fff;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-family: 'Share Tech Mono', monospace;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00f6ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledGlitchButton = styled(GlitchButton)`
  margin-top: 2rem;
  
  .button-wrapper {
    padding: 10px;
  }

  .spiderverse-button {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const Market: React.FC<MarketProps> = ({ onBack }) => {
  const { user, updateCurrency } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.description) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description,
        imageUrl: newProduct.imageUrl
      };
      setProducts([...products, product]);
      setNewProduct({});
      setIsModalOpen(false);
    }
  };

  const calculateProgress = (price: number) => {
    return Math.min((user?.currency || 0) / price * 100, 100);
  };

  const handlePurchase = (product: Product) => {
    if (user?.currency && user.currency >= product.price) {
      updateCurrency(user.currency - product.price);
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Market</Title>
        </TitleSection>
        <StyledGlitchButton 
          text="Add New Product"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <ProductGrid>
        {products.map(product => (
          <ProductCard
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price.toLocaleString()}</ProductPrice>
            <ProductDescription>{product.description}</ProductDescription>
            
            <ProgressContainer>
              <ProgressBar $progress={calculateProgress(product.price)} />
              <ProgressText>
                <span>Progress: {calculateProgress(product.price).toFixed(1)}%</span>
                <span>¥{(user?.currency || 0).toLocaleString()} / ¥{product.price.toLocaleString()}</span>
              </ProgressText>
            </ProgressContainer>

            <Button
              onClick={() => handlePurchase(product)}
              disabled={!user?.currency || user.currency < product.price}
            >
              {user?.currency && user.currency >= product.price ? 'Purchase' : 'Not Enough Funds'}
            </Button>
          </ProductCard>
        ))}
      </ProductGrid>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Title style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Add New Product</Title>
              
              <Input
                placeholder="Product Name"
                value={newProduct.name || ''}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price || ''}
                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              
              <TextArea
                placeholder="Description"
                value={newProduct.description || ''}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              
              <Input
                placeholder="Image URL (optional)"
                value={newProduct.imageUrl || ''}
                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />

              <ButtonGroup>
                <Button $variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Market; 