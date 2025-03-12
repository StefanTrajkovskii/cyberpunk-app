import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 180px;
  background-color: rgba(0, 10, 20, 0.4);
  margin: 1rem 0;
  position: relative;
  border: 1px solid rgba(0, 246, 255, 0.3);
  overflow: hidden;
`;

const DataGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
`;

const DataNode = styled.div<{ 
  active: boolean; 
  color: string;
}>`
  background-color: ${props => props.active ? props.color : 'rgba(0, 10, 30, 0.3)'};
  box-shadow: ${props => props.active ? `0 0 5px ${props.color}` : 'none'};
  transition: all 0.3s ease;
`;

const DataOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
  z-index: 1;
  pointer-events: none;
`;

const DataHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: #00f6ff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
`;

const DataFooter = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 62, 136, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
`;

const HexDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 62, 136, 0.4);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  width: 60%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: 0.6;
  user-select: none;
`;

interface DataVizProps {
  title?: string;
}

const DataViz: React.FC<DataVizProps> = ({ title = "NETWORK TRAFFIC ANALYSIS" }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate random data visualization
    const updateDataNodes = () => {
      if (!gridRef.current) return;
      
      const dataNodes = gridRef.current.childNodes;
      const totalNodes = dataNodes.length;
      const activeCount = Math.floor(Math.random() * (totalNodes / 3)) + 5;
      
      // Reset all nodes
      dataNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.setAttribute('data-active', 'false');
          node.style.backgroundColor = 'rgba(0, 10, 30, 0.3)';
          node.style.boxShadow = 'none';
        }
      });
      
      // Activate random nodes
      for (let i = 0; i < activeCount; i++) {
        const randomIndex = Math.floor(Math.random() * totalNodes);
        const node = dataNodes[randomIndex];
        
        if (node instanceof HTMLElement) {
          // Choose a color - cyan, pink, or green
          const colors = [
            'rgba(0, 246, 255, 0.8)', 
            'rgba(255, 62, 136, 0.8)', 
            'rgba(35, 209, 139, 0.8)'
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          node.setAttribute('data-active', 'true');
          node.style.backgroundColor = randomColor;
          node.style.boxShadow = `0 0 5px ${randomColor}`;
        }
      }
    };
    
    // Generate hex data
    const updateHexData = () => {
      if (!hexRef.current) return;
      
      let hexData = '';
      for (let i = 0; i < 100; i++) {
        const randomHex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        hexData += randomHex + ' ';
      }
      
      hexRef.current.textContent = hexData;
    };
    
    // Initialize nodes
    const createInitialNodes = () => {
      if (!gridRef.current) return;
      
      gridRef.current.innerHTML = '';
      const totalCells = 32 * 8;
      
      for (let i = 0; i < totalCells; i++) {
        const node = document.createElement('div');
        node.className = 'data-node';
        node.setAttribute('data-active', 'false');
        gridRef.current.appendChild(node);
      }
    };
    
    createInitialNodes();
    
    // Set up intervals for data updates
    const nodeInterval = setInterval(updateDataNodes, 800);
    const hexInterval = setInterval(updateHexData, 150);
    
    return () => {
      clearInterval(nodeInterval);
      clearInterval(hexInterval);
    };
  }, []);
  
  const currentTime = new Date().toLocaleTimeString();
  const randomPackets = Math.floor(Math.random() * 1000) + 100;
  
  return (
    <Container>
      <DataGrid ref={gridRef} />
      
      <HexDisplay ref={hexRef} />
      
      <DataOverlay>
        <DataHeader>
          <div>{title}</div>
          <div>TIME: {currentTime}</div>
        </DataHeader>
        
        <DataFooter>
          <div>PACKETS: {randomPackets}</div>
          <div>STATUS: MONITORING</div>
        </DataFooter>
      </DataOverlay>
    </Container>
  );
};

export default DataViz; 