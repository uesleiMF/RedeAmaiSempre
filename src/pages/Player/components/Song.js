import React from "react";
import styled from "styled-components"; // ← ESSA LINHA ESTAVA FALTANDO!
import "./Song.js";


const Song = ({ currentSong, isPlaying = false }) => {
  return (
    <SongContainer>
      <CoverContainer className={isPlaying ? "playing" : ""}>
        <CoverImg
          src={currentSong.cover}
          alt={`Capa - ${currentSong.name} por ${currentSong.artist}`}
        />
      </CoverContainer>

      <SongInfo>
        <SongTitle>{currentSong.name}</SongTitle>
        <SongArtist>{currentSong.artist}</SongArtist>
      </SongInfo>
    </SongContainer>
  );
};

export default Song;

// ====================== STYLED COMPONENTS ======================

const SongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8rem auto 4rem;
  padding: 3rem 2rem;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 1s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    margin: 6rem auto 3rem;
    padding: 2rem 1.5rem;
    border-radius: 24px;
  }
`;

const CoverContainer = styled.div`
  margin-bottom: 2.5rem;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  transition: all 0.5s ease;

  &.playing {
    box-shadow: 0 0 40px rgba(0, 219, 222, 0.6);
  }
`;

const CoverImg = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  display: block;
  border-radius: 24px;
  transition: transform 0.5s ease;

  ${CoverContainer}.playing & {
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }

  @media (max-width: 480px) {
    width: 200px;
    height: 200px;
  }
`;

const SongInfo = styled.div`
  text-align: center;
`;

const SongTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(90deg, #00dbde, #fc00ff, #00dbde);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 8s ease infinite;

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SongArtist = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;