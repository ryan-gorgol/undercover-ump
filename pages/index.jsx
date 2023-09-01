import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { fetchGames, formatDate, getDateRange } from '@/libs/helper';
import GameCard from '@/components/GameCard';

const Index = ({ games, lineScoreActiveGame }) => {
  const router = useRouter();
  const todayGameRef = useRef(null);

  const handleClick = (gameId) => {
    router.push(`/game/${gameId}`);
  };

  // Generate date range from -30 days to now
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 5);
  const allDates = getDateRange(startDate, endDate).reverse();

  // Filter and sort games
  const filteredGames = games
    .filter((game) => ['Final', 'Preview', 'In Progress'].includes(game.status.detailedState))
    .sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate));

  useEffect(() => {
    if (todayGameRef.current) {
      todayGameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    console.log('games', games);
  }, []);

  return (
    <S.Container>
      <S.Header>
        Your Header Content Here
      </S.Header>
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
            return <S.OffDay key={date}>No game on {date}</S.OffDay>;
          }
        })}
      </S.Wrap>
    </S.Container>
  );
};

export default Index;


export async function getServerSideProps() {
  // Calculate startDate and endDate to fetch data for the last 5 days and next 2 days
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 5);
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 2);

  // Format dates as strings
  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);

  const teamId = 112;

  try {
    const { games, lineScoreActiveGame } = await fetchGames(startDateString, endDateString, teamId);

    return {
      props: {
        games,
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
    padding:  0 1rem;
    width: calc(100% - 2rem);
    height: 100%;
    display: flex;
    flex-direction: column;
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
  `,Header: styled.header`
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
    background: #0e3386;
    color: white;
    padding: 1rem;
    text-align: center;
  `,
  Wrap: styled.div`
    width: 100%;
    max-width: 600px;
    padding-top: 1rem;  // to make sure content is not hidden under the sticky header
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
    width: calc(100% - 4rem + 4px);
    padding: 1rem;
    height: 1.2rem;
    background: #0e328648;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
  `
};
