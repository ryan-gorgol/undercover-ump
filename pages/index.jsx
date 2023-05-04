import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Index = ({ games, lineScoreActiveGame }) => {
  useEffect(() => console.log(games, 'allGames'), [games]);
  useEffect(() => console.log(lineScoreActiveGame, 'lineScoreActiveGame'), [lineScoreActiveGame]);

  const router = useRouter();
  const todayGameRef = useRef(null);

  const handleClick = (gameId) => {
    console.log(gameId);

    router.push(`/game/${gameId}`);
  };

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
        const isLive = game.status.abstractGameState === 'Live';

        const seriesStatus = `${game?.seriesGameNumber} of ${game?.gamesInSeries}`;

        return (
          <S.Game
            key={game.gamePk}
            onClick={() => handleClick(game.gamePk)}
            ref={isToday ? todayGameRef : null}
          >
            <h4>{gameDate}</h4>
            <h2>{game.teams.away.team.name}</h2>
            <h2>{game.teams.home.team.name}</h2>
            <h5>{game?.status?.abstractGameState}</h5>
            <h6>{seriesStatus}</h6>
            <h6>{gameTime}</h6>
            {isLive && (
              <>
                <h5>Line Score:</h5>
                <p>
                  {game.teams.away.team.name}: {game.lineScore.teams.away.runs}
                </p>
                <p>
                  {game.teams.home.team.name}: {game.lineScore.teams.home.runs}
                </p>
              </>
            )}
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
  const teamId = 112;
  const apiUrl = `http://statsapi.mlb.com/api/v1/schedule?sportId=1&team_ids=${teamId}&startDate=${startDate}&endDate=${endDate}`;

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
