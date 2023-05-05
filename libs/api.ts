export function saveCompletedGamesToLocalStorage(games: any) {
  const completedGames = games.filter((game: any) => game.status.abstractGameState === 'Final');
  localStorage.setItem('completedGames', JSON.stringify(completedGames));
}

export function getCompletedGamesFromLocalStorage() {
  const completedGames = localStorage.getItem('completedGames');
  return completedGames ? JSON.parse(completedGames) : [];
}