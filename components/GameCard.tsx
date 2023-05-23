import React from 'react'
import styled from 'styled-components'

interface Props {
  game: any
  lineScoreActiveGame: any
  isToday: boolean
  isLive: boolean
  todayGameRef: any
  gameDate: any
  gameTime: any
  seriesStatus: any
  onClick: () => null
}

const GameCard = ({
  game, 
  lineScoreActiveGame, 
  isToday, 
  isLive,
  todayGameRef, 
  gameDate,
  gameTime,
  seriesStatus,
  onClick }: Props) => {
  
  return (
    <S.Game
    key={game.gamePk}
    onClick={onClick}
    ref={isToday ? todayGameRef : null}
  >
    <h4>{gameDate}</h4>
    <h2>{game.teams.away.team.name}</h2>
    <h2>{game.teams.home.team.name}</h2>
    <h5>{game?.status?.abstractGameState}</h5>
    <h6>{seriesStatus}</h6>
    <h6>{gameTime}</h6>
    {isLive && (
      <h5>{`${lineScoreActiveGame.inningHalf} ${lineScoreActiveGame.currentInningOrdinal}`}</h5>
    )}
  </S.Game>
  )
}

export default GameCard

const S = {
  Game: styled.div`
    width: calc(100% - 2rem);
    margin-bottom: 1rem;
    padding: 1rem;
    border: 2px solid #0e3386;
    border-radius: 0.5rem;
  `,
}