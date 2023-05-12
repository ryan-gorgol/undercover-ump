import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  textContent: string;
}

const Badge = ({ textContent }: Props) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleBadgeClick = () => {
    setIsTextVisible(true);
  };

  return (
    <S onClick={handleBadgeClick}>
      <TextContent isTextVisible={isTextVisible}>{textContent}</TextContent>
    </S>
  );
};

export default Badge

interface StyledProps {
  isTextVisible: boolean;
}

const S = styled.div`
  border: 2px solid var(--cubbie_blue);
  border-radius: 0.25rem;
  padding: 0.5rem;
  min-width: 2rem;
  max-width: 3rem;
  min-height: 2rem;
  max-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TextContent = styled.div<StyledProps>`
  width: 100%;
  height: 100%;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: filter 0.2s ease;  
  ${({ isTextVisible }) =>
    !isTextVisible &&
    `
    color: white;
  `}
`;
