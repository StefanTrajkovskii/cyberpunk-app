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
  imageUrl?: string; // This will now contain a base64 string of the uploaded image
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    text-align: center;
  }
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
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ProductCard = styled(motion.div)`
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid #00f6ff;
  border-radius: 4px;
  padding: 1.5rem;
  position: relative;
  overflow: visible;
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.1);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff003c, #00f6ff, #ff003c);
    background-size: 200% 100%;
    animation: gradient-slide 3s linear infinite;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 246, 255, 0.2) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 25px rgba(0, 246, 255, 0.2);
    
    &::after {
      opacity: 0.05;
    }
  }
  
  @keyframes gradient-slide {
    0% { background-position: 0% 0; }
    100% { background-position: 200% 0; }
  }
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const ProductName = styled.h3`
  color: #00f6ff;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
  font-family: 'Share Tech Mono', monospace;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 1px;
    background: #00f6ff;
    box-shadow: 0 0 8px rgba(0, 246, 255, 0.7);
  }
`;

const ProductPrice = styled.div`
  color: #23d18b;
  font-size: 1.4rem;
  font-weight: bold;
  margin-left: auto;
  background: rgba(35, 209, 139, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 3px;
  text-shadow: 0 0 10px rgba(35, 209, 139, 0.5);
  
  &::before {
    content: "¥";
    margin-right: 0.2rem;
  }
`;

const ProductDescription = styled.p`
  color: #b8c0c2;
  margin: 1rem 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  padding-left: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: rgba(0, 246, 255, 0.3);
  }
`;

const ImageContainer = styled.div`
  margin: 1rem 0;
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 246, 255, 0.3);
    z-index: 1;
    pointer-events: none;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 246, 255, 0.3);
  font-size: 0.9rem;
  letter-spacing: 1px;
  border: 1px dashed rgba(0, 246, 255, 0.3);
`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0 1rem;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 246, 255, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: linear-gradient(90deg, #00f6ff, #00f6ff 70%, #23d18b);
    box-shadow: 0 0 10px rgba(0, 246, 255, 0.7);
    transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  color: #b8c0c2;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  
  > span:last-child {
    color: #23d18b;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; $disabled?: boolean }>`
  background: ${props => props.$variant === 'secondary' ? 'transparent' : 'rgba(0, 246, 255, 0.1)'};
  border: 1px solid ${props => props.$disabled ? 'rgba(0, 246, 255, 0.3)' : '#00f6ff'};
  color: ${props => props.$disabled ? 'rgba(0, 246, 255, 0.5)' : '#00f6ff'};
  padding: 0.8rem 1.5rem;
  border-radius: 3px;
  cursor: pointer !important;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  position: relative;
  z-index: 5;
  overflow: visible;
  opacity: ${props => props.$disabled ? '0.7' : '1'};
  pointer-events: auto !important;
  user-select: none;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    height: calc(100% + 4px);
    width: calc(100% + 4px);
    background: linear-gradient(45deg, #00f6ff, transparent, #00f6ff);
    border-radius: 3px;
    z-index: -1;
    animation: border-rotate 3s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    background: ${props => props.$disabled ? 'rgba(100, 100, 100, 0.1)' : 'rgba(0, 246, 255, 0.2)'};
    box-shadow: ${props => props.$disabled ? 'none' : '0 0 15px rgba(0, 246, 255, 0.3)'};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-2px)'};
    
    &::before {
      opacity: ${props => props.$disabled ? '0' : '1'};
    }
  }

  @keyframes border-rotate {
    0% { background-position: 0% 0%; }
    100% { background-position: 300% 0%; }
  }
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

const FileUploadContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px dashed rgba(0, 246, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00f6ff;
    background: rgba(0, 246, 255, 0.05);
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const UploadIcon = styled.div`
  color: #00f6ff;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '↑';
  }
`;

const UploadText = styled.div`
  color: #b8c0c2;
  font-size: 0.9rem;
  text-align: center;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 60, 60, 0.8);
    }
  }
`;

const Market: React.FC<MarketProps> = ({ onBack }) => {
  const { user, updateCurrency } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImagePreview(base64String);
      setNewProduct({ ...newProduct, imageUrl: base64String });
    };
    
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setNewProduct({ ...newProduct, imageUrl: undefined });
  };

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
      setImagePreview(null);
      setIsModalOpen(false);
    }
  };

  const calculateProgress = (price: number) => {
    return Math.min((user?.currency || 0) / price * 100, 100);
  };

  const handlePurchase = (product: Product) => {
    console.log("Purchase button clicked for:", product.name);
    
    if (user?.currency && user.currency >= product.price) {
      console.log("Processing purchase");
      updateCurrency(user.currency - product.price);
      setProducts(products.filter(p => p.id !== product.id));
    } else {
      console.log("Not enough funds");
      alert("Not enough funds to purchase this item");
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
            whileHover={{ y: -5 }}
          >
            <ProductHeader>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price.toLocaleString()}</ProductPrice>
            </ProductHeader>
            
            {product.imageUrl ? (
              <ImageContainer>
                <ProductImage src={product.imageUrl} alt={product.name} />
              </ImageContainer>
            ) : (
              <ImageContainer>
                <NoImage>NO IMAGE AVAILABLE</NoImage>
              </ImageContainer>
            )}
            
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
              $disabled={!user?.currency || user.currency < product.price}
              type="button"
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
              
              {imagePreview ? (
                <ImagePreview>
                  <img src={imagePreview} alt="Preview" />
                  <button onClick={removeImage}>×</button>
                </ImagePreview>
              ) : (
                <FileUploadContainer>
                  <FileUploadLabel htmlFor="image-upload">
                    <UploadIcon />
                    <UploadText>Upload product image</UploadText>
                    <UploadText>(Max. 5MB)</UploadText>
                  </FileUploadLabel>
                  <FileInput
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </FileUploadContainer>
              )}

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