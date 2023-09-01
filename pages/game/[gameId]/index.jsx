import React from 'react'
import axios from 'axios'
import styled from 'styled-components'

import Game from '../../../components/Game'

export default function Index({ boxScore, lineScore }) {

  console.log(boxScore, 'box')
  console.log(lineScore, 'line')

  return (
    <S.Wrap>
      <S.Container>
        <Game boxScore={boxScore} lineScore={lineScore} />
      </S.Container>
    </S.Wrap>
  )
}

export async function getServerSideProps(context) {
  const gameId = context.params.gameId;
  
  const boxScoreApiUrl = `http://statsapi.mlb.com/api/v1/game/${gameId}/boxscore`;
  const lineScoreApiUrl = `http://statsapi.mlb.com/api/v1/game/${gameId}/linescore`;

  try {
    const [boxScoreResponse, lineScoreResponse] = await Promise.all([
      axios.get(boxScoreApiUrl),
      axios.get(lineScoreApiUrl),
    ]);

    const boxScore = boxScoreResponse.data;
    const lineScore = lineScoreResponse.data;

    return {
      props: {
        boxScore: boxScore,
        lineScore: lineScore,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        boxScore: {},
        lineScore: {},
      },
    };
  }
}

const S = {
  Wrap: styled.div`
    width: 100%;
    background-color: var(--cubbie_blue_dark);
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Container: styled.div`
    padding:  0 1rem;
    width: 100%;

    @media (min-width: 768px) {
      padding: 0;
      width: calc(100% - 4rem);
      max-width: 800px;
    }
  `,
}
