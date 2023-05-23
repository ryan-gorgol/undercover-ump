import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import GameCard from '@/components/GameCard';

const Index = ({ games, lineScoreActiveGame }) => {
  
  const router = useRouter();
  const todayGameRef = useRef(null);

  const handleClick = (gameId) => {
    console.log(gameId);
    router.push(`/game/${gameId}`);
  };

  const getDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  const allDates = getDateRange(startDate, endDate).reverse();

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
      <S.Wrap>
        {allDates.map((date) => {
          const game = filteredGames.find((game) => {
            return new Date(game.gameDate).toISOString().split('T')[0] === date;
          });

          if (game) {
            const gameDate = new Date(game.gameDate).toLocaleDateString();
            const gameTime = new Date(game.gameDate).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });

            const isToday = new Date().toLocaleDateString() === gameDate;
            const isLive = game.status.abstractGameState === 'Live';

            const seriesStatus = `${game?.seriesGameNumber} of ${game?.gamesInSeries}`;

            return (
              <S.TabWrap key={game.gamePk}>
                <GameCard
                  onClick={() => handleClick(game.gamePk)}
                  ref={isToday ? todayGameRef : null}
                  game={game}
                  lineScoreActiveGame={lineScoreActiveGame}
                  isToday={isToday}
                  isLive={isLive}
                  todayGameRef={todayGameRef}
                  gameDate={gameDate}
                  gameTime={gameTime}
                  seriesStatus={seriesStatus}
                />
                <S.NavColumn />
              </S.TabWrap>
            );
          } else {
            // Render the OffDay component
            return <S.OffDay key={date} />;
          }
        })}
      </S.Wrap>
    </S.Container>
  );
};

export default Index;


export async function getServerSideProps() {
  // Calculate startDate and endDate
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 27);
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 3);

  // Format dates as strings
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];

  const teamId = 112;
  const apiUrl = `http://statsapi.mlb.com/api/v1/schedule?sportId=1&team_ids=${teamId}&startDate=${startDateString}&endDate=${endDateString}`;

  try {
    const response = await axios.get(apiUrl);
    const allGames = response.data.dates.flatMap((date) => date.games);
    const games = allGames.filter(
      (game) => game.teams.away.team.id === teamId || game.teams.home.team.id === teamId
    );

    const liveGame = games.find((game) => game.status.abstractGameState === 'Live');

    let lineScoreActiveGame = null;
    if (liveGame) {
      const lineScoreApiUrl = `http://statsapi.mlb.com/api/v1/game/${liveGame.gamePk}/linescore`;
      const lineScoreResponse = await axios.get(lineScoreApiUrl);
      lineScoreActiveGame = lineScoreResponse.data;
    }

    return {
      props: {
        games: games,
        lineScoreActiveGame,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        games: [],
        lineScoreActiveGame: null,
      },
    };
  }
}

const S = {
  Container: styled.div`
    padding: 1rem;
    width: calc(100% - 2rem);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  Wrap: styled.div`
    width: 100%;
    max-width: 600px;
    
  `,
  NavColumn: styled.div`
    width: 2rem;
    height: 100%;
  `,
  TabWrap: styled.div`
    width: 100%;
    display: flex;

  `,
  OffDay: styled.div`
    width: 100%;
    height: 5rem;
    background: blue;
  `
};
