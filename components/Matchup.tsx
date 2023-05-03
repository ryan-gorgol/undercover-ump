import React, { useState } from 'react'
import styled from 'styled-components'
import Badge from './Badge'

interface Props {
  homeTeamName: any
  awayTeamName: any
  homeStartingPitcher: any
  awayStartingPitcher: any
  gameOffenseScore: any
  gameDefenseScore: any
  homeScore: any
  awayScore: any
}

const Matchup = ({
  homeTeamName,
  awayTeamName,
  homeStartingPitcher,
  awayStartingPitcher,
  gameOffenseScore,
  gameDefenseScore,
  homeScore,
  awayScore
}: Props) => {

  const [isGameScoreVisible, setIsGameScoreVisible] = useState(false)

  const handleToggleGameScoreVisibility = () => {
    const userConfirmation = window.confirm(
      'Are you sure you want to reveal the game score?'
    );

    if (userConfirmation) {
      setIsGameScoreVisible(true);
    }
  };

  return (
    <S.Page>
      <S.Team>
        <S.TeamName>{awayTeamName}</S.TeamName>
        <S.Pitcher>SP {awayStartingPitcher}</S.Pitcher>
        <S.Scores>
          <div>
            <h4>Offense Action</h4>
            <Badge textContent={ gameOffenseScore.away } />
          </div>
            
          <div>
            <h4>Defense Action</h4>
            <Badge textContent={ gameDefenseScore.away } />
          </div>
        </S.Scores> 

        <S.GameScore onClick={handleToggleGameScoreVisibility}>
          Final Away Score
          {isGameScoreVisible && (
            <>
              <h4>{awayScore}</h4>
            </>
          )}
        </S.GameScore>

      </S.Team>
      <S.Team>
        <S.TeamName>{homeTeamName}</S.TeamName>
        <S.Pitcher>SP {homeStartingPitcher}</S.Pitcher>
        <S.Scores>
          <div>
            <h4>Offense Action</h4>
            <Badge textContent={ gameOffenseScore.home } />
          </div>
          <div>
            <h4>Defense Action</h4>
            <Badge textContent={ gameDefenseScore.home } />
          </div>
        </S.Scores> 

        <S.GameScore onClick={handleToggleGameScoreVisibility}>
          Final Home Score
          {isGameScoreVisible && (
            <>
              <h4>{homeScore}</h4>
            </>
          )}
        </S.GameScore>

      </S.Team>
    </S.Page>

  )
}

export default Matchup

const S = {
  Page: styled.div`
    width: var(--vw_full_width);
    height: fit-content;
    background: white;
    color: black;
    display: flex;
    padding: 1rem 0.5rem;
  `,
  Team: styled.div`
    width: 100%;
    height: fit-content;
    padding: 1rem;
  `,
  TeamName: styled.h1`
    margin: 0;
  `,
  Pitcher: styled.h2`
    min-height: 4rem;
    margin: 0;
    margin-top: 0.5rem;
    color: gray;
    font-weight: 300;
    font-size: 1.25rem;
  `,
  Scores: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      align-items: center;
      width: 5rem;
    }

    h4 {
      min-width: 5rem;
    }
  `,
  Badge: styled.div`
    border: 2px solid #0E3386; 
    border-radius: 0.25rem;
    padding: 0.5rem;
    min-width: 2rem;
    max-width: 3rem;
    min-height: 2rem;
    max-height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

  `,
  GameScore: styled.div`
    margin-top: 1rem;
    padding: 1rem;
    width: calc(100% - 2rem);
    height: 10rem;
    border: 2px solid #0E3386;
    border-radius: 0.25rem;
  `,
  ExcitementScore: styled.div`
    margin-top: 0.5rem;
    padding: 0.5rem;
    width: calc(100% - 2rem);
    height: 5rem;
    diplay: flex;
    flex-wrap: nowrap;

    h2 {
      margin: 0;
      padding-left: 0.25rem;
      color: #e5e5e5;
    }

    div {
      display: flex;
    }
  `
}