import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

interface Props {
  date: string
  venue: string
  weather: string
  firstPitch: string
  excitementScore: number
  gameTime: string
  attendance: string
}

const Matchup = ({ date, venue, weather, firstPitch, excitementScore, gameTime, attendance }: Props) => {
  const [initialPosition, setInitialPosition] = useState(true);
  
  const getLeftPosition = (excitementScore: number, initial = false) => {
    if (initial) return "0%";
  
    const minScore = 55;
    const maxScore = 125;
    const range = maxScore - minScore;
  
    // Ensure that the excitementScore is within the defined range.
    let boundedScore = Math.max(minScore, Math.min(maxScore, excitementScore));
  
    // Calculate the percentage based on the bounded excitement score.
    // We scale the percentage to a maximum of 70% instead of 100%.
    const percentage = ((boundedScore - minScore) / range) * 80;
  
    console.log(percentage, 'percentage');
  
    return `${percentage}%`;
  };
  
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialPosition(false);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <S.EventInfo>

      <S.Overview>
        <S.Date>{date.slice(0, date.length)}</S.Date>
        <S.Venue>{venue.slice(0, venue.length - 1)}</S.Venue>
        
        <S.Weather>{weather.slice(0, weather.length - 1)}</S.Weather>
        <S.FirstPitch>{firstPitch.slice(0, firstPitch.length - 1)}</S.FirstPitch>

        <S.Secondary><span>Total Time</span><span>{gameTime.slice(0, gameTime.length - 1)}</span></S.Secondary>
        <S.Secondary><span>Attendance</span><span>{attendance.slice(0, attendance.length - 1)}</span></S.Secondary>
      </S.Overview>

      <S.Score>
        <h6>Overall Action</h6>
        <div style={{ left: getLeftPosition(excitementScore, initialPosition)  }}>{excitementScore}</div>
      </S.Score>

    </S.EventInfo>
  )
}

export default Matchup

const S = {
  EventInfo: styled.div`
    width: calc(100% - 2rem);
    max-width: 600px;
    height: fit-content;
    background: var(--cubbie_blue);
    color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    box-shadow: inset 0px -4px 2px #0b2561,
                inset 0px -8px 4px #0b256162,
                inset 0px -12px 6px #0b256162;
  `,
  Overview: styled.div`
    text-shadow: 0px 1px 3px #0b2561,
                 0px 2px 4px #0b2561,
                 0px 3px 6px #0b2561;
  `,
  Date: styled.h2`
    margin: 0;
    color: #fff;
    font-size: 2rem;
  `,
  Venue: styled.div`
    margin: 0;
    padding: 1rem 0 0.5rem 0;
    color: #B6CEF6;
    font-weight: 200;
    font-size: 1.25rem;
    text-transform: uppercase;
  `,
  Weather: styled.div`
    margin: 0;
    padding: 0;
    color: #B6CEF6;
    font-weight: 200;
    font-size: 1.25rem;

  `,
  FirstPitch: styled.div`
    margin: 0 0 1rem 0;
    padding: 0.5rem 0;
    color: #B6CEF6;
    font-weight: 200;
    font-size: 1.25rem;
  `,
  Secondary: styled.div`
    min-height: 1.5rem;
    display: flex;
    margin: 0;
    padding: 0rem 0;
    color: #B6CEF6;
    font-weight: 200;
    font-size: 0.875rem;
    text-transform: uppercase;

    span {
      display: block;
      width: 100px;
    }
  `,
  Score: styled.div`
    padding: 0rem;
    margin: 0;
    padding-bottom: 0.4rem;
    width: calc(100% - 1rem);
    height: 4rem;
    diplay: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid red;
    

    h6 {
      margin: 1rem 0;
      font-size: 1rem;
      text-shadow: 0px 1px 3px #0b2561,
                   0px 2px 6px #0b2561,
                   0px 3px 9px #0b2561;
    }

    div {
      box-sizing: border-box;
      background-color: var(--cubbie_blue);
      position: relative;
      margin-left: 0.5rem;
      display: flex;
      border: 1px solid var(--cubbie_red);
      border-radius: 0.25rem;
      width: fit-content;
      padding: 0.5rem;
      box-shadow:  0px 1px 3px #0b2561,
                   0px 2px 6px #0b2561,
                   0px 3px 9px #0b2561;
      transition: left 0.75s ease-out;
    }
`
}