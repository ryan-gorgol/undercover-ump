import React, { useState } from "react";
import styled from "styled-components";

const LineScore = ({ innings, homeTeamName, awayTeamName }) => {
  // 2D state to keep track of visible cells, initialized to false
  const [visibleCells, setVisibleCells] = useState(
    Array.from({ length: 2 }, () => Array(innings.length).fill(false))
  );

  const handleCellClick = (inningIndex, typeIndex) => {
    // Clone the current visibleCells state
    const newVisibleCells = JSON.parse(JSON.stringify(visibleCells));

    // Set all cells before and including the clicked cell for Away and Home to visible
    for (let i = 0; i <= inningIndex; i++) {
      newVisibleCells[0][i] = true; // Away
      newVisibleCells[1][i] = true; // Home
    }

    // If the clicked cell is "Home", hide it as per your requirement
    if (typeIndex === 0) {
      newVisibleCells[1][inningIndex] = false;
    }

    // Update the state
    setVisibleCells(newVisibleCells);
  };

  return (
    <S.Table>
      <thead>
        <tr>
          <th></th>
          {innings.map((inning, index) => (
            <S.HeaderCell key={index}>{inning.ordinalNum}</S.HeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <S.LabelCell>{awayTeamName}</S.LabelCell>
          {innings.map((inning, index) => (
            <S.BodyCell
              key={index}
              visible={visibleCells[0][index]}
              onClick={() => handleCellClick(index, 0)}
            >
              {visibleCells[0][index] ? inning.away.runs : ""}
            </S.BodyCell>
          ))}
        </tr>
        <tr>
          <S.LabelCell>{homeTeamName}</S.LabelCell>
          {innings.map((inning, index) => (
            <S.BodyCell
              key={index}
              visible={visibleCells[1][index]}
              onClick={() => handleCellClick(index, 1)}
            >
              {visibleCells[1][index] ? inning.home.runs : ""}
            </S.BodyCell>
          ))}
        </tr>
      </tbody>
    </S.Table>
  );
};

const S = {
  Table: styled.table`
    width: 100%;
    color: white;
    border-collapse: collapse;
    margin-top: 2rem;
    margin-bottom: 8rem;
  `,
  HeaderCell: styled.th`
    padding: 0.25rem;
    border: 1px solid #ffffff7f;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 200;
  `,
  LabelCell: styled.td`
    font-size: 0.75rem;
    font-weight: 400;
    padding: 0.125rem;
    border: 1px solid #ffffff7f;
    text-align: center;
    width: calc(var(--vw) * 10);
  `,
  BodyCell: styled.td`
    padding: 0.25rem;
    border: 1px solid #ffffff7f;
    text-align: center;
    cursor: pointer;
    background-color: ${props => (props.visible ? "" : "#273f68")};
    font-size: 0.75rem;
    width: calc(var(--vw) * 10);
    height: calc(var(--vh) * 5);

    @media (orientation: landscape) {
      height: calc(var(--vh) * 15);
    }
  `
}

export default LineScore;
