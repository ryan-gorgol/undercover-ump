import React, {useEffect, useRef} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Index = ({ games }) => {

  useEffect(() => console.log(games, 'games'), [games])

  const router = useRouter();
  const todayGameRef = useRef(null);

  const handleClick = (gameId) => {
    console.log(gameId)
  
    router.push(`/game/${gameId}`);
  };

  // Filter concluded games and sort them by date
  const filteredGames = games
    .filter((game) => game.status.detailedState === 'Final' || 'Preview')
    .sort((a, b) => {
      const dateA = new Date(a.gameDate);
      const dateB = new Date(b.gameDate);
      return dateB - dateA;
    });

  useEffect(() => {
    if (todayGameRef.current) {
      todayGameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [todayGameRef]);

  return (
      <S.Container>
        {filteredGames.map((game) => {
          const gameDate = new Date(game.gameDate).toLocaleDateString();
          const gameTime = new Date(game.gameDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          const isToday = new Date().toLocaleDateString() === gameDate;

          const seriesStatus = `${game?.seriesGameNumber} of ${game?.gamesInSeries}`
          
          return (
            <S.Game
              key={game.gamePk}
              onClick={() => handleClick(game.gamePk)}
              ref={isToday ? todayGameRef : null}
            >
              <h4>{gameDate}</h4>
              <h2>
                {game.teams.away.team.name} 
              </h2>
              <h2>
                {game.teams.home.team.name}
              </h2>
              <h5>{game?.status?.abstractGameState}</h5>
              <h6>{seriesStatus}</h6>
              <h6>{gameTime}</h6>
            </S.Game>
          );
        })}
      </S.Container>
  );
};

export default Index;

export async function getServerSideProps() {

  const startDate = '2023-03-30';
  const endDate = '2023-10-01';
  const teamId = 112; // Chicago Cubs team ID
  const apiUrl = `http://statsapi.mlb.com/api/v1/schedule?sportId=1&team_ids=${teamId}&startDate=${startDate}&endDate=${endDate}`;

  try {
    const response = await axios.get(apiUrl);
    const allGames = response.data.dates.flatMap((date) => date.games);
    
    // Filter games for only Chicago Cubs games
    const games = allGames.filter(
      (game) =>
        game.teams.away.team.id === teamId || game.teams.home.team.id === teamId
    );

    return {
      props: {
        games: games,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        games: [],
      },
    };
  }
}

const S = {
  Container: styled.div`
    padding: 1rem;
    width: calc(100% - 2rem);
    height: 100%;
    background: white;
    color: #0e3386;

    h5 {
      margin: 0.5rem 0;
    }

    h6 {
      margin: 0.5rem 0;
      font-weight: 500;
    }
  `,
  Game: styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    border: 2px solid #0e3386;
    border-radius: 0.5rem;
  `,
};