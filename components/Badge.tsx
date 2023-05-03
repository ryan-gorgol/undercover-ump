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

export default Badge;

interface StyledProps {
  isTextVisible: boolean;
}

const S = styled.div`
  border: 2px solid #0e3386;
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

const TextContent = styled.span<StyledProps>`
  transition: filter 0.2s ease;  
  ${({ isTextVisible }) =>
    !isTextVisible &&
    `
    filter: blur(8px);
  `}
`;
