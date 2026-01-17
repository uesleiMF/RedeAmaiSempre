import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import data from "./data";

function App() {
  const audioRef = useRef(null);

  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    percentage: 0,
  });

  // Define a primeira música ao carregar
  useEffect(() => {
    if (songs.length > 0 && !currentSong) {
      const firstSong = { ...songs[0], active: true };
      setCurrentSong(firstSong);
      setSongs(songs.map((s, i) => ({ ...s, active: i === 0 })));
    }
  }, [songs, currentSong]);

  // Atualiza tempo, duração e porcentagem
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration || 0;
    const percentage = duration ? (current / duration) * 100 : 0;
    setSongInfo({ currentTime: current, duration, percentage });
  };

  // Quando a música termina, vai para a próxima
  const songEndHandler = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    setCurrentSong(nextSong);
    updateActive(nextSong);
  };

  // Marca música como ativa na biblioteca
  const updateActive = (selectedSong) => {
    setSongs((prevSongs) =>
      prevSongs.map((s) => ({ ...s, active: s.id === selectedSong.id }))
    );
  };

  // Toca/pausa automaticamente quando muda a música ou estado de play
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.log("Play bloqueado (interação necessária?):", error);
        setIsPlaying(false); // Evita ficar preso em "tocando" sem áudio
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Loading enquanto carrega as músicas
  if (!currentSong) {
    return (
      <LoadingContainer>
        <h2>Carregando músicas...</h2>
      </LoadingContainer>
    );
  }

  return (
    <AppContainer libraryStatus={libraryStatus}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <MainContent>
        <Song currentSong={currentSong} isPlaying={isPlaying} />
        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          songInfo={songInfo}
          setSongInfo={setSongInfo}
          songs={songs}
          setCurrentSong={setCurrentSong}
          updateActive={updateActive}
        />
      </MainContent>
      <Library
        songs={songs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        updateActive={updateActive}
        libraryStatus={libraryStatus}
      />
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        onEnded={songEndHandler}
      />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  transition: margin-left 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-left: ${(p) => (p.libraryStatus ? "20rem" : "0")};
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #00dbde;
  font-size: 2rem;
`;

export default App;
