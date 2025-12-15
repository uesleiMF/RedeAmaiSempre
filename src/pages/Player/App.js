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
  const [currentSong, setCurrentSong] = useState(null); // ← começa como null
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    percentage: 0,
  });

  // Define a primeira música apenas depois que songs estiver carregado
  useEffect(() => {
    if (songs.length > 0 && !currentSong) {
      const firstSong = { ...songs[0], active: true };
      setCurrentSong(firstSong);
      // Atualiza todas as músicas para marcar a primeira como ativa
      setSongs(songs.map((s, i) => ({ ...s, active: i === 0 })));
    }
  }, [songs, currentSong]);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration || 0;
    const percentage = (current / duration) * 100 || 0;
    setSongInfo({ ...songInfo, currentTime: current, duration, percentage });
  };

  const songEndHandler = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextSong = songs[(currentIndex + 1) % songs.length];
    setCurrentSong(nextSong);
    updateActive(nextSong);
    if (isPlaying) audioRef.current.play();
  };

  const updateActive = (selectedSong) => {
    setSongs(songs.map((s) => ({ ...s, active: s.id === selectedSong.id })));
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Proteção extra: se ainda não carregou, mostra loading
  if (!currentSong) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "50vh" }}>Carregando músicas...</div>;
  }

  return (
    <AppContainer libraryStatus={libraryStatus}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        updateActive={updateActive}
      />
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
        src={currentSong.audio}
        ref={audioRef}
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        onEnded={songEndHandler}
      />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  transition: margin-left 0.5s ease;
  margin-left: ${(p) => (p.libraryStatus ? "20rem" : "0")};
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export default App;