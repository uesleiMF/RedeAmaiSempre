import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo, // ← ESSA LINHA ESTAVA FALTANDO NAS PROPS!
  songs,
  setCurrentSong,
  updateActive,
}) => {
  // Play/Pause
  const playSongHandler = () => {
    setIsPlaying(!isPlaying);
  };

  // Pular faixa
  const skipTrackHandler = (direction) => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndex =
      direction === "skip-forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = songs.length - 1;
    if (newIndex >= songs.length) newIndex = 0;
    const newSong = songs[newIndex];
    setCurrentSong(newSong);
    updateActive(newSong);
    if (isPlaying) audioRef.current.play();
  };

  // Arrastar barra de progresso
  const dragHandler = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    // Atualiza o estado visual imediatamente
    setSongInfo({ ...songInfo, currentTime: newTime });
  };

  // Formatar tempo (mm:ss)
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Animação da barra de progresso
  const trackAnim = {
    transform: `translateX(${songInfo.percentage}%)`,
  };

  return (
    <div className="player">
      {/* Barra de progresso */}
      <div className="time-control">
        <p>{formatTime(songInfo.currentTime)}</p>

        <div className="progress-bar-container">
          <div className="progress-track" />
          <div className="progress-fill" style={trackAnim} />
          <input
            type="range"
            min="0"
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
        </div>

        <p>{formatTime(songInfo.duration)}</p>
      </div>

      {/* Controles */}
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="4x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;