import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Overview from './Overview'
import Matchup from './Matchup'

export default function BoxScoreComponent({ boxScore, lineScore }: any) {
  // gather key data
  const homeTeamName = boxScore?.teams?.home?.team?.clubName;
  const awayTeamName = boxScore?.teams?.away?.team?.clubName;
  const homeScore = boxScore?.teams?.home?.teamStats?.batting?.runs
  const awayScore = boxScore?.teams?.away?.teamStats?.batting?.runs
  const timeObj = boxScore?.info.find((item: any) => item.label === 'T');
  const attendanceObj = boxScore?.info.find((item: any) => item.label === 'Att');

  const gameTime = timeObj ? timeObj.value : '';
  const attendance = attendanceObj ? attendanceObj.value : '';

  // calculate these variables as data returned by the api is inconsistent
  let weather = '';
  let venue = '';
  let firstPitch = '';
  let date = '';

  boxScore?.info.forEach((item: any, index: number, array: any[]) => {

    if (index === array.length - 1) {
      date = item.label
    }

    switch (item.label) {
      case 'Weather':
        weather = item.value
        break
      case 'Venue':
        venue = item.value
        break
      case 'First pitch':
        firstPitch = item.value
        break
      default:
        break
    }
  })

  // startingPitcher's need a seperate API call
  const homeStartingPitcherId = boxScore?.teams?.home?.pitchers?.[0];
  const awayStartingPitcherId = boxScore?.teams?.away?.pitchers?.[0];

  const [homeStartingPitcher, setHomeStartingPitcher] = useState('')
  const [awayStartingPitcher, setAwayStartingPitcher] = useState('')

  // state for UI rendering
  const [gameOffenseScore, setGameOffenseScore] = useState({ home: 0, away: 0 });
  const [gameDefenseScore, setGameDefenseScore] = useState({ home: 0, away: 0 });
  const [excitementScore, setExcitementScore] = useState(0)
  const [competitiveGame, setCompetitiveGame] = useState(0);
  const [isGameScoreVisible, setIsGameScoreVisible] = useState(false);

  useEffect(() => {
    const calculateExcitementScore = () => {
      const offenseScore = (gameOffenseScore.home + gameOffenseScore.away) / 2;
      const defenseScore = (gameDefenseScore.home + gameDefenseScore.away) / 2;

      const evalScore = (competitiveGame + offenseScore + defenseScore) / 2;
      setExcitementScore(evalScore);
    };

    calculateExcitementScore();
  }, [gameOffenseScore, gameDefenseScore, competitiveGame]);

  useEffect(() => {
    const calculateCompetitiveGame = () => {
      const homeTeamAbbreviation = boxScore?.teams?.home?.team?.abbreviation;
      const isCubsHome = homeTeamAbbreviation === 'CHC';
      const cubsScore = isCubsHome ? homeScore : awayScore;
      const opponentScore = isCubsHome ? awayScore : homeScore;

      const calculateLeadChanges = (lineScore: any) => {
        let leadChanges = 0;
        let previousLead: 'home' | 'away' | 'tied' | null = null;
        let homeTotalRuns = 0;
        let awayTotalRuns = 0;

        for (const inning of lineScore.innings) {
          awayTotalRuns += parseInt(inning.away.runs, 10);
          const currentLeadAfterTopInning = homeTotalRuns === awayTotalRuns ? 'tied' : (homeTotalRuns > awayTotalRuns ? 'home' : 'away');

          if (previousLead !== null && previousLead !== currentLeadAfterTopInning) {
            leadChanges += 1;
          }

          previousLead = currentLeadAfterTopInning;

          if (inning.home.runs !== undefined) {
            homeTotalRuns += parseInt(inning.home.runs, 10);
            const currentLeadAfterBottomInning = homeTotalRuns === awayTotalRuns ? 'tied' : (homeTotalRuns > awayTotalRuns ? 'home' : 'away');

            if (previousLead !== null && previousLead !== currentLeadAfterBottomInning) {
              leadChanges += 1;
            }

            previousLead = currentLeadAfterBottomInning;
          }
        }

        return leadChanges;
      };

      const isPitchingDuel = (boxScore: any) => {
        const homePitchers = Object.values(boxScore?.teams?.home?.players || {});
        const awayPitchers = Object.values(boxScore?.teams?.away?.players || {});

        const allPitchers = [...homePitchers, ...awayPitchers];

        const startingPitchers = allPitchers.filter(
          (player: any) => player.stats.pitching.inningsPitched >= 5
        );

        console.log(startingPitchers, 'SPs')

        return startingPitchers.every((pitcher: any) => {
          const inningsPitched = pitcher.stats.pitching.inningsPitched;
          const earnedRuns = pitcher.stats.pitching.earnedRuns;

          const ERA = (earnedRuns / inningsPitched) * 9;

          return ERA <= 2.5;
        });
      };


      let competitiveness = 0;

      // Scoring margin
      const margin = cubsScore - opponentScore;
      if (margin >= 3) {
        competitiveness += 35;
      } else if (margin >= 1 && margin <= 2) {
        competitiveness += 25;
      } else if (margin >= -2 && margin <= -1) {
        competitiveness += 5;
      } else if (margin >= -5 && margin <= -3) {
        competitiveness -= 10;
      } else if (margin <= -6) {
        competitiveness -= 15;
      }

      // Overall scoring
      const totalRuns = cubsScore + opponentScore;
      if (totalRuns > 12) {
        competitiveness += 30;
      } else if (totalRuns > 8) {
        competitiveness += 20;
      } else if (totalRuns > 5) {
        competitiveness += 10;
      }

      // Lead changes
      const leadChanges = calculateLeadChanges(lineScore);
      if (leadChanges >= 7) {
        competitiveness += 75;
      } else if (leadChanges >= 4) {
        competitiveness += 50;
      } else if (leadChanges >= 1) {
        competitiveness += 25;
      }

      // Pitching duel
      if (isPitchingDuel(boxScore)) {
        competitiveness += 30;
      }

      setCompetitiveGame(competitiveness)
    };

    calculateCompetitiveGame()
  }, [awayScore, boxScore, lineScore, homeScore])

useEffect(() => {
  const gameEventAnalysis = () => {
    const homeTeamStats = boxScore?.teams?.home?.teamStats;
    const awayTeamStats = boxScore?.teams?.away?.teamStats;

    const offenseWeights = {
      rbi: 3,
      homeRuns: 3,
      hits: 1,
      doubles: 2,
      triples: 3,
      stolenBases: 5,
      atBats: 0.5,
      baseOnBalls: 2,
      hitByPitch: 5,
      flyOuts: 1.5,
      groundOuts: 1.5,
      sacBunts: 10,
      sacFlies: 6.5
    };

    const defenseWeights = {
      assists: 1.8,
      caughtStealing: 8,
      errors: 5,
      passedBall: 10,
      groundOuts: 3.5,
      airOuts: 3.5,
      strikeOuts: 5,
      completedGames: 10
    };

    const calculateScore = (homeTeamStats: any, awayTeamStats: any, weights: any, statCategories: string[]) => {
      let homeScore = 0;
      let awayScore = 0;
      for (const factor in weights) {
        for (const statCategory of statCategories) {
          homeScore += (homeTeamStats[statCategory][factor] || 0) * weights[factor];
          awayScore += (awayTeamStats[statCategory][factor] || 0) * weights[factor];
        }
      }
      return { homeScore: Math.ceil(homeScore), awayScore: Math.ceil(awayScore) };
    };


    const offenseScores = calculateScore(homeTeamStats, awayTeamStats, offenseWeights, ['batting']);
    const defenseScores = calculateScore(homeTeamStats, awayTeamStats, defenseWeights, ['pitching', 'fielding']);

    return { offenseScores, defenseScores };
  };

  const { offenseScores, defenseScores } = gameEventAnalysis();
  setGameOffenseScore({ home: offenseScores.homeScore, away: offenseScores.awayScore });
  setGameDefenseScore({ home: defenseScores.homeScore, away: defenseScores.awayScore });

}, [boxScore])

// find starting pitchers for the game
useEffect(() => {
  const fetchPitcherData = async (id: number) => {
  const apiUrl = `https://statsapi.mlb.com/api/v1/people/${id}`;
  try {
    const response = await axios.get(apiUrl);
    const playerData = response.data.people[0];
    return `${playerData?.firstName} ${playerData?.lastName}`;
  } catch (error) {
    console.error(error);
    return '';
  }
};

if (homeStartingPitcherId) {
  fetchPitcherData(homeStartingPitcherId).then((name) => setHomeStartingPitcher(name));
}
if (awayStartingPitcherId) {
  fetchPitcherData(awayStartingPitcherId).then((name) => setAwayStartingPitcher(name));
}
}, [homeStartingPitcherId, awayStartingPitcherId]);
  
  return (
    <S.Container>
      <Overview
        date={date}
        venue={venue}
        weather={weather}
        firstPitch={firstPitch}
        excitementScore={excitementScore}
        gameTime={gameTime}
        attendance={attendance}
      />

      <Matchup
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        homeStartingPitcher={homeStartingPitcher}
        awayStartingPitcher={awayStartingPitcher}
        gameOffenseScore={gameOffenseScore}
        gameDefenseScore={gameDefenseScore}
        homeScore={homeScore}
        awayScore={awayScore}
      />
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    width: var(--vw_full_width);
    height: var(--vh_full_height);
  `
}
