import axios from 'axios';


export const fetchGames = async (startDate, endDate, teamId) => {
  const apiUrl = `http://statsapi.mlb.com/api/v1/schedule?sportId=1&team_ids=${teamId}&startDate=${startDate}&endDate=${endDate}`;

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

  return { games, lineScoreActiveGame };
};

// Helper function to format a JS Date to YYYY-MM-DD string
export const formatDate = (date) => date.toISOString().split('T')[0];

// Helper function to generate a date range between startDate and endDate
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate))); 
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
