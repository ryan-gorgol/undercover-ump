import React from 'react'
import styled from 'styled-components'

interface Props {
  date: string
  venue: string
  weather: string
  firstPitch: string
  excitementScore: number
}

const Matchup = ({date, venue, weather, firstPitch, excitementScore}: Props) => {
  return (
    <S.EventInfo>

      <S.Overview>
        <S.Date>{date.slice(0, date.length)}</S.Date>
        <S.Venue>{venue.slice(0, venue.length - 1)}</S.Venue>
        <S.Weather>{weather.slice(0, weather.length - 1)}</S.Weather>
        <S.FirstPitch>{firstPitch.slice(0, firstPitch.length - 1)}</S.FirstPitch>

      </S.Overview>

      <S.Score>
        <h6>Overall Action</h6>
        <div>{excitementScore}</div>
      </S.Score>

    </S.EventInfo>
  )
}

export default Matchup

const S = {
  EventInfo: styled.div`
    width: 100%;
    height: fit-content;
    background: #0E3386;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 0.5rem;
    box-shadow: inset 0px -4px 2px #0b2561,
                inset 0px -8px 4px #0b256162,
                inset 0px -12px 6px #0b256162;
  `,
  Overview: styled.div`
    text-shadow: 0px 1px 3px #0b2561,
                 0px 2px 6px #0b2561,
                 0px 3px 9px #0b2561;
  `,
  Date: styled.h2`
    margin: 0;
    padding: 0 1rem;
    color: #fff;
    font-size: 2rem;
  `,
  Venue: styled.div`
    margin: 0;
    padding: 1rem 1rem 0.5rem 1rem;
    color: #B6CEF6;
    font-weight: 200;
    font-size: 1.25rem;
    text-transform: uppercase;
  `,
  Weather: styled.div`
    margin: 0;
    padding: 0 1rem;
    color: #B6CEF6;
    font-weight: 100;
    font-size: 1.25rem;

  `,
  FirstPitch: styled.div`
    margin: 0;
    padding: 0.5rem 1rem;
    color: #B6CEF6;
    font-weight: 100;
    font-size: 1.25rem;
  `,
  Score: styled.div`
    margin-top: 0.5rem;
    padding: 0.5rem;
    width: calc(100% - 2rem);
    height: fit-content;
    diplay: flex;
    flex-wrap: nowrap;
    

    h6 {
      margin: 1rem 0.5rem;
      font-size: 1rem;
      text-shadow: 0px 1px 3px #0b2561,
                   0px 2px 6px #0b2561,
                   0px 3px 9px #0b2561;
    }

    div {
      box-sizing: border-box;
      margin-left: 0.5rem;
      display: flex;
      border: 1px solid #CC3433;
      border-radius: 0.25rem;
      width: fit-content;
      padding: 0.5rem;
      box-shadow:  0px 1px 3px #0b2561,
                   0px 2px 6px #0b2561,
                   0px 3px 9px #0b2561;
    }
`
}